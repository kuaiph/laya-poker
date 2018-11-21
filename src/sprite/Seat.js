import WebSocket from '../util/WebSocket'
/**
 * 座位类
 */
export default class Seat extends Laya.Script {

    /** @prop {name:seatId,tips:"座位ID"} */

    constructor(inparam) {
        super()
        if (inparam) {
            // UI元素
            this.boxSeat = inparam.boxSeat                                          // 座位
            this.maskSeat = inparam.maskSeat                                        // 倒计时遮罩            
            this.textName = this.boxSeat.getChildByName('textName')                 // 座位昵称
            this.imgSeat = this.boxSeat.getChildByName('imgSeat')                   // 座位头像
            this.textSeatPoint = this.boxSeat.getChildByName('textSeatPoint')       // 座位点数
            this.boxBet = this.boxSeat.getChildByName('boxBet')                     // 玩家投注盒子
            this.imgChip = this.boxSeat.getChildByName('imgChip')                   // 用于移动的筹码
            this.imgTag = this.boxSeat.getChildByName('imgTag') || {}               // 状态标记
            this.imgHandPoker = this.boxSeat.getChildByName('imgHandPoker') || {}   // 座位手牌标记
            // 数据信息
            this.seatNo = inparam.seatNo                    // 座位真实ID
            this.userId = inparam.userId                    // 玩家ID
            this.headurl = inparam.headurl                  // 座位图片名称
            this.seatPoint = inparam.seatPoint              // 座位带入点数
            this.betPoint = 0                               // 投注点数
            this.betPointArr = []                           // 投注点数数组
            this.speakCountDown = 0                         // 说话时间倒计时
            this.status = null                              // 座位状态
            // 初始化
            this.init()
        }
    }
    onEnable() {
    }

    // 点击头像请求服务器坐下
    onClick() {
        WebSocket.send({ method: 'SIT_DOWN', user: WebSocket.globalData.user, seatId: this.seatId, seatPoint: 200 })
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
        this.boxBet.visible = false
        // 隐藏手牌标识
        this.imgHandPoker.visible = false
        // 记录移动筹码的初始坐标以便复原
        this.imgChipX = this.imgSeat.x
        this.imgChipY = this.imgSeat.y
    }

    // 倒计时20秒
    countDown() {
        this.maskSeat.alpha = 0.5
        this.speakCountDown = 0
        this.intervalCountDown = setInterval(() => {
            this.maskSeat.graphics.clear()
            if (this.speakCountDown > 360) {
                this.closeCountDown()
            } else {
                this.speakCountDown += 0.72
                this.maskSeat.graphics.drawPie(this.maskSeat.width / 2, this.maskSeat.height / 2, this.maskSeat.width, 0, this.speakCountDown, "#ffffff");
            }
        }, 40)
        // 隐藏提示
        this.imgTag.visible = false
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
        if (this.userId) {
            this.textName.text = this.userId
            this.textSeatPoint.text = this.seatPoint
            this.textName.visible = true
            this.textSeatPoint.visible = true
        }else{
            this.textName.visible = false
            this.textSeatPoint.visible = false
        }
    }

    // 发言
    speak() {
        this.textSeatPoint.text = this.seatPoint    // 座位分数更新
    }

    // 投注动画
    bet() {
        if (this.textSeatPoint.text != this.seatPoint) {
            let x = this.boxBet.x
            let y = this.boxBet.y
            this.imgChip.visible = true
            Laya.Tween.to(this.imgChip, { x, y }, 800, Laya.Ease.strongOut, Laya.Handler.create(this, this.betComplete))
        } else {
            this.betComplete()
        }
    }
    // 投注完成
    betComplete() {
        // 移动筹码还原
        this.imgChip.visible = false
        this.imgChip.x = this.imgChipX
        this.imgChip.y = this.imgChipY
        // 座位点数更新，显示新投注点数
        this.textSeatPoint.text = this.seatPoint
        this.boxBet.getChildByName('boxPoint').text = this.betPoint
        this.boxBet.visible = true
    }

    // 隐藏投注盒子
    hideBet() {
        this.boxBet.visible = false
    }

    // 根据状态显示提示
    showTip() {
        if (this.status) {
            if (this.status != 'allin') {
                this.imgTag.skin = `ui/tip_${this.status}.png`
                this.imgTag.visible = true
            } else {
                console.log('allin')
            }
        } else {
            this.imgTag.visible = false
        }
    }

    // 离座
    leave() {

    }
}