import WebSocket from '../util/WebSocket'

/** 
 * 操作台
 */
export default class Control {
    constructor(inparam) {
        // UI元素
        this.btnAbandon = inparam.btnAbandon
        this.btnRise = inparam.btnRise
        this.btnFollow = inparam.btnFollow
        this.vsliderPoint = inparam.vsliderPoint
        this.imgBetnum = inparam.imgBetnum
        this.textBetnum = inparam.textBetnum
        this.btnFixrise0 = inparam.btnFixrise0
        this.btnFixrise1 = inparam.btnFixrise1
        this.btnFixrise2 = inparam.btnFixrise2
        // 数据信息
        this.round = inparam.round
        // 初始化
        this.init()
    }
    // 初始化
    init() {
        this.btnAbandon.visible = false                         // 弃牌按钮
        this.btnRise.visible = false                            // 加注按钮
        this.btnFollow.visible = false                          // 跟注按钮
        this.textFollow = this.btnFollow.getChildByName('textFollow')
        this.vsliderPoint.visible = false                       // 点数推杆
        this.vsliderPoint.showLabel = false                     // 点数推杆不显示标签
        this.imgBetnum.visible = false                          // 推杆显示点数背景
        this.textBetnum.visible = false                         // 推杆显示点数
        this.btnFixrise0.visible = false                        // 定制加注按钮0
        this.btnFixrise1.visible = false                        // 定制加注按钮1
        this.btnFixrise2.visible = false                        // 定制加注按钮2
        this.textFixrise0 = this.btnFixrise0.getChildByName('textFixrise')
        this.textFixrise1 = this.btnFixrise1.getChildByName('textFixrise')
        this.textFixrise2 = this.btnFixrise2.getChildByName('textFixrise')

        // 控制台事件
        this.btnRise.on(Laya.Event.CLICK, this, this.onRiseClick)
        this.vsliderPoint.changeHandler = new Laya.Handler(this, this.onVsliderChange)
        this.vsliderPoint.on(Laya.Event.MOUSE_UP, this, this.onVsliderUp)
    }
    // 发言
    speak(selfSeat) {
        let roundPoint = this.round.roundPoint
        this.minBetPoint = this.round.seatMap['seat0'].minBetPoint

        this.selfSeat = selfSeat
        this.btnAbandon.visible = true                                  // 弃牌按钮显示
        this.btnRise.visible = true                                     // 加注按钮显示
        this.btnFollow.visible = true                                   // 跟注按钮显示

        this.textFixrise0.text = Math.floor(1 / 2 * roundPoint)
        this.textFixrise1.text = Math.floor(2 / 3 * roundPoint)
        this.textFixrise2.text = Math.floor(2 * roundPoint)
        this.btnFixrise0.visible = true                                 // 定制加注按钮0
        this.btnFixrise1.visible = true                                 // 定制加注按钮1
        this.btnFixrise2.visible = true                                 // 定制加注按钮2

        // 设定跟注最小值
        if (this.minBetPoint == selfSeat.seatPoint) {
            this.btnFollow.skin = 'ui/btn_allin.png'
            this.textFollow.text = this.minBetPoint
            this.btnRise.visible = false
            this.btnFixrise0.visible = false
            this.btnFixrise1.visible = false
            this.btnFixrise2.visible = false
        } else {
            this.textFixrise0.text >= selfSeat.seatPoint ? this.btnFixrise0.visible = false : null
            this.textFixrise1.text >= selfSeat.seatPoint ? this.btnFixrise1.visible = false : null
            this.textFixrise2.text >= selfSeat.seatPoint ? this.btnFixrise2.visible = false : null

            this.textFixrise0.text < this.minBetPoint ? this.btnFixrise0.visible = false : null
            this.textFixrise1.text < this.minBetPoint ? this.btnFixrise1.visible = false : null
            this.textFixrise2.text < this.minBetPoint ? this.btnFixrise2.visible = false : null
            this.textFollow.text = this.minBetPoint > 0 ? `跟注 ${this.minBetPoint}` : '看牌'
        }
        this.vsliderPoint.max = selfSeat.seatPoint                           // 设置加注推杆的最大值
        this.vsliderPoint.value = this.vsliderPoint.max - this.minBetPoint   // 设置加注推杆的初始值
        this.vsliderPoint.visible = false
        this.imgBetnum.visible = false
        this.textBetnum.visible = false
    }

    // 沉默
    silent() {
        this.btnAbandon.visible = false                                 // 弃牌按钮
        this.btnRise.visible = false                                    // 加注按钮
        this.btnFollow.visible = false                                  // 跟注按钮
        this.vsliderPoint.visible = false                               // 分数推杆
        this.imgBetnum.visible = false                                  // 推杆显示点数背景
        this.textBetnum.visible = false                                 // 推杆显示点数
        this.btnFixrise0.visible = false                                // 定制加注按钮0
        this.btnFixrise1.visible = false                                // 定制加注按钮1
        this.btnFixrise2.visible = false                                // 定制加注按钮2
    }

    // 响应自由加注，隐藏其他按钮，只显示推杆
    onRiseClick() {
        this.silent()
        this.vsliderPoint.visible = true
        this.imgBetnum.visible = true
        this.textBetnum.visible = true
    }

    // 响应推杆变动
    onVsliderChange() {
        this.betPoint = Math.abs(this.vsliderPoint.value - this.vsliderPoint.max)
        if (this.betPoint == this.vsliderPoint.max) {
            this.textBetnum.text = 'ALLIN'
        } else if (this.betPoint >= this.minBetPoint) {
            this.textBetnum.text = this.betPoint
        } else {
            this.textBetnum.text = ''
        }
    }

    // 响应推杆触摸离开，请求自由投注
    onVsliderUp() {
        if (this.betPoint >= this.minBetPoint) {
            this.silent()   // 隐藏控制台
            WebSocket.send({ method: 'BET', betPoint: this.betPoint })
        }
    }
}