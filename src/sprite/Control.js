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
        this.imgFixrise0 = inparam.imgFixrise0
        this.imgFixrise1 = inparam.imgFixrise1
        this.imgFixrise2 = inparam.imgFixrise2        
        this.init()
    }
    init() {
        this.imgAbandon.visible = false                         // 弃牌按钮
        this.imgRise.visible = false                            // 加注按钮
        this.imgFollow.visible = false                          // 跟注按钮
        this.vsliderPoint.visible = false                       // 点数推杆
        this.vsliderPoint.showLabel = false                     // 点数推杆不显示标签
        this.imgFixrise0.visible = false                        // 定制加注按钮0
        this.imgFixrise1.visible = false                        // 定制加注按钮1
        this.imgFixrise2.visible = false                        // 定制加注按钮2
        
        // 控制台事件
        this.imgRise.on(Laya.Event.CLICK, this, this.onRiseClick)
        this.vsliderPoint.changeHandler = new Laya.Handler(this, this.onVsliderChange)
        this.vsliderPoint.on(Laya.Event.MOUSE_UP, this, this.onVsliderUp)
        // 定制加注事件
        this.imgFixrise0.on(Laya.Event.CLICK, this, this.onRise0Click)
        this.imgFixrise1.on(Laya.Event.CLICK, this, this.onRise1Click)
        this.imgFixrise2.on(Laya.Event.CLICK, this, this.onRise2Click)
    }
    // 发言
    speak(selfSeat) {
        this.selfSeat = selfSeat
        this.imgAbandon.visible = true                                  // 弃牌按钮显示
        this.imgRise.visible = true                                     // 加注按钮显示
        this.imgFollow.visible = true                                   // 跟注按钮显示
        this.imgFixrise0.visible = true                                 // 定制加注按钮0
        this.imgFixrise1.visible = true                                 // 定制加注按钮1
        this.imgFixrise2.visible = true                                 // 定制加注按钮2
        this.vsliderPoint.max = selfSeat.seatPoint                      // 设置加注推杆的最大值
        selfSeat.speak()
    }

    // 沉默
    silent() {
        this.imgAbandon.visible = false                                 // 弃牌按钮
        this.imgRise.visible = false                                    // 加注按钮
        this.imgFollow.visible = false                                  // 跟注按钮
        this.vsliderPoint.visible = false                               // 分数推杆
        this.imgFixrise0.visible = false                                // 定制加注按钮0
        this.imgFixrise1.visible = false                                // 定制加注按钮1
        this.imgFixrise2.visible = false                                // 定制加注按钮2
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

    // 定制加注0
    onRise0Click() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 4 })
    }
    // 定制加注1
    onRise1Click() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 8 })
    }
    // 定制加注2
    onRise2Click() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 16 })
    }
}