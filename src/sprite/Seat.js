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
            this.textSeatPoint = inparam.textSeatPoint  // 玩家点数
            this.box = inparam.box                      // 玩家投注盒子
            this.imgAbandon = inparam.imgAbandon        // 弃牌按钮
            this.imgRise = inparam.imgRise              // 加注按钮
            this.imgFollow = inparam.imgFollow          // 跟注按钮
            this.vsliderPoint = inparam.vsliderPoint    // 投注推杆
            this.maskSeat = inparam.maskSeat            // 倒计时遮罩
            // 数据信息
            this.seatId = inparam.seatId                // 座位显示ID
            this.seatNo = inparam.seatNo                // 座位真实ID
            this.userId = inparam.userId                // 玩家ID
            this.headurl = inparam.headurl              // 座位图片名称
            this.seatPoint = inparam.seatPoint          // 座位带入点数
            this.betPoint = 0                           // 投注点数
            this.betPointArr = []                       // 投注点数数组
            this.speakCountDown = 0                     // 说话时间倒计时
        }
    }
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'SIT_DOWN', user: WebSocket.globalData.user, seatId: this.owner.name, seatPoint: 200 })
    }

    // 初始化
    init() {
        // 显示头像
        this.imgSeat.skin = `ui/${this.headurl}`
        this.maskSeat.texture = `ui/${this.headurl}`
        this.maskSeat.alpha = 1
        // 显示筹码
        if (this.userId != 0) {
            this.textSeatPoint.text = this.seatPoint
            this.textSeatPoint.visible = true
        } else {
            this.textSeatPoint.visible = false
        }
        this.imgAbandon.visible = false
        this.imgRise.visible = false
        this.imgFollow.visible = false
        this.vsliderPoint.visible = false
        this.box.visible = false
    }

    //倒计时18秒
    countDown() {
        this.maskSeat.alpha = 0.5
        this.speakCountDown = 0
        this.intervalCountDown = setInterval(() => {
            this.maskSeat.graphics.clear()
            if (this.speakCountDown > 360) {
                this.closeCountDown()
            }
            this.maskSeat.graphics.drawPie(this.maskSeat.width / 2, this.maskSeat.height / 2, this.maskSeat.width, 0, this.speakCountDown, "#ffffff");
            this.speakCountDown++
        }, 25)
    }

    // 关闭倒计时
    closeCountDown() {
        clearInterval(this.intervalCountDown)
        this.maskSeat.alpha = 1
        this.maskSeat.graphics.clear()
        this.maskSeat.graphics.drawPie(this.maskSeat.width / 2, this.maskSeat.height / 2, this.maskSeat.width, 0, 360, "#ffffff");
    }

    // 入座
    sitdown() {
        this.imgSeat.skin = `ui/${this.headurl}`
        this.maskSeat.texture = `ui/${this.headurl}`
        if (this.seatPoint > 0) {
            this.textSeatPoint.text = this.seatPoint
            this.textSeatPoint.visible = true
        }
    }

    // 发言
    speak() {
        this.imgAbandon.visible = true              // 弃牌按钮显示
        this.imgRise.visible = true                 // 加注按钮显示
        this.imgFollow.visible = true               // 跟注按钮显示
        this.textSeatPoint.text = this.seatPoint    // 座位分数更新
    }
    // 沉默
    silent() {
        this.imgAbandon.visible = false     // 弃牌按钮
        this.imgRise.visible = false        // 加注按钮
        this.imgFollow.visible = false      // 跟注按钮
        this.vsliderPoint.visible = false   // 分数推杆
        // this.box.visible = false            // 投注盒子
    }
    // 大小盲自动投注
    bet() {
        this.textSeatPoint.text = this.seatPoint
        this.box.getChildByName('boxPoint').text = this.betPoint
        this.box.visible = true
    }
    // 隐藏投注盒子
    hideBet(){
        this.box.visible = false
    }
    // // 投注
    // bet(point) {
    //     this.silent()
    //     this.box.getChildByName('boxPoint').text = this.seatPoint += point
    //     this.box.visible = true
    // }
    // 离座
    leave() {

    }
}