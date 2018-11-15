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
    speak(seatPoint) {
        this.imgAbandon.visible = true                                  // 弃牌按钮显示
        this.imgRise.visible = true                                     // 加注按钮显示
        this.imgFollow.visible = true                                   // 跟注按钮显示
        this.vsliderPoint.max = seatPoint                               // 设置加注推杆的最大值
    }

    // 沉默
    silent() {
        this.imgAbandon.visible = false                                 // 弃牌按钮
        this.imgRise.visible = false                                    // 加注按钮
        this.imgFollow.visible = false                                  // 跟注按钮
        this.vsliderPoint.visible = false                               // 分数推杆
    }

    onRiseClick() {
        this.imgRise.visible = false
        this.vsliderPoint.visible = true
    }

    onVsliderChange() {
        this.betPoint = Math.abs(this.vsliderPoint.value - this.vsliderPoint.max)
    }

    onVsliderUp() {
        if (this.vsliderPoint.visible) {
            console.log("抬起投注值：" + this.betPoint);
        }
    }
}