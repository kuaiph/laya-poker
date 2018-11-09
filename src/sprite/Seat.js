import WebSocket from '../util/WebSocket'
/**
 * 座位类
 */
export default class Seat extends Laya.Script {
    constructor(inparam) {
        super()
        if (inparam) {
            // UI元素
            this.imgSeat = inparam.imgSeat              // 座位图
            this.textPoint = inparam.textPoint          // 玩家点数
            this.box = inparam.box                      // 玩家投注盒子
            this.imgAbandon = inparam.imgAbandon        // 弃牌按钮
            this.imgRise = inparam.imgRise              // 加注按钮
            this.imgFollow = inparam.imgFollow          // 跟注按钮
            this.vsliderPoint = inparam.vsliderPoint    // 投注推杆
            // 数据信息
            this.seatId = inparam.seatId                // 座位显示ID
            this.seatNo = inparam.seatNo                // 座位真实ID
            this.userId = inparam.userId                // 玩家ID
            this.headurl = inparam.headurl              // 座位图片名称
            this.seatPoint = inparam.seatPoint          // 座位带入点数
        }
    }
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'SIT_DOWN', user: WebSocket.globalData.user, seatId: this.owner.name, point: 200 })
    }

    // 初始化
    init() {
        // 显示头像
        this.imgSeat.skin = `ui/${this.headurl}`
        // 显示筹码
        if (this.userId != 0) {
            this.textPoint.text = this.seatPoint
            this.textPoint.visible = true
        } else {
            this.textPoint.visible = false
        }
        this.imgAbandon.visible = false
        this.imgRise.visible = false
        this.imgFollow.visible = false
        this.vsliderPoint.visible = false
        this.box.visible = false        
    }

    // 入座
    sitdown() {
        this.imgSeat.skin = `ui/${this.headurl}`
    }

    // 发言
    speak() {
        this.imgAbandon.visible = true      // 弃牌按钮
        this.imgRise.visible = true         // 加注按钮
        this.imgFollow.visible = true       // 跟注按钮
    }
    // 沉默
    silent() {
        this.imgAbandon.visible = false     // 弃牌按钮
        this.imgRise.visible = false        // 加注按钮
        this.imgFollow.visible = false      // 跟注按钮
        this.vsliderPoint = false           // 分数推杆
        this.box = false                    // 投注盒子
    }

    // 离座
    leave() {

    }
}