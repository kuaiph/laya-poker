import WebSocket from '../util/WebSocket'

/** 
 * 操作台
 */
export default class Control {
    constructor(inparam) {
        this.imgAbandon = inparam.imgAbandon
        this.imgRise = inparam.imgRise
        this.imgFollow = inparam.imgFollow
        this.vsliderPoint = inparam.vsliderPoint
        this.init()
    }
    init() {
        this.imgAbandon.visible = false                         // 弃牌按钮
        this.imgRise.visible = false                            // 加注按钮
        this.imgFollow.visible = false                          // 跟注按钮
        this.vsliderPoint.visible = false                       // 点数推杆
        this.vsliderPoint.showLabel = false                     // 点数推杆不显示标签
        // 控制台事件
        this.imgRise.on(Laya.Event.CLICK, this, this.onRiseClick)
        this.vsliderPoint.changeHandler = new Laya.Handler(this, this.onVsliderChange)
        this.vsliderPoint.on(Laya.Event.MOUSE_UP, this, this.onVsliderUp)
    }
    // 发言
    speak(selfSeat) {
        this.selfSeat = selfSeat
        this.imgAbandon.visible = true                                  // 弃牌按钮显示
        this.imgRise.visible = true                                     // 加注按钮显示
        this.imgFollow.visible = true                                   // 跟注按钮显示
        this.vsliderPoint.max = selfSeat.seatPoint                      // 设置加注推杆的最大值
        selfSeat.speak()
    }

    // 沉默
    silent() {
        this.imgAbandon.visible = false                                 // 弃牌按钮
        this.imgRise.visible = false                                    // 加注按钮
        this.imgFollow.visible = false                                  // 跟注按钮
        this.vsliderPoint.visible = false                               // 分数推杆
    }

    // 响应自由加注
    onRiseClick() {
        this.imgRise.visible = false
        this.vsliderPoint.visible = true
    }

    // 响应滑杆变动
    onVsliderChange() {
        this.betPoint = Math.abs(this.vsliderPoint.value - this.vsliderPoint.max)
    }

    // 响应滑杆触摸离开，请求自由投注
    onVsliderUp() {
        if (this.betPoint > 0) {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: this.betPoint })
        }
    }
}