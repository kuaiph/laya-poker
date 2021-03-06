import WebSocket from '../util/WebSocket'
/**
 * 座位类
 */
export default class Seat extends Laya.Script {
    // 作为脚本使用
    /** @prop {name:seatId,tips:"座位ID"} */
    onEnable() {
    }
    // 点击头像请求服务器坐下
    onClick() {
        WebSocket.globalData.gameView.dialogSit.show()
        WebSocket.send({ method: 'SIT_DOWN', seatId: this.seatId, seatPoint: 200 })
    }

    // 作为实例使用
    constructor(inparam) {
        super()
        if (inparam) {
            // 父级UI元素
            this.boxSeat = inparam.boxSeat                                          // 座位
            this.maskSeat = inparam.maskSeat                                        // 倒计时遮罩
            this.textRoundPoint = inparam.textRoundPoint                            // 底池
            this.boxBet = inparam.boxBet                                            // 玩家投注盒子
            this.imgChip = inparam.imgChip                                          // 用于移动的筹码
            this.boxPokerType = inparam.boxPokerType                                // 牌型
            // 子级UI元素
            this.textName = this.boxSeat.getChildByName('textName')                 // 座位昵称
            this.imgHead = this.boxSeat.getChildByName('imgHead')                   // 座位头像
            this.imgSeat = this.boxSeat.getChildByName('imgSeat')                   // 座位底图
            this.textSeatPoint = this.boxSeat.getChildByName('textSeatPoint')       // 座位点数
            this.imgTag = this.boxSeat.getChildByName('imgTag') || {}               // 状态标记
            this.imgHandPoker = this.boxSeat.getChildByName('imgHandPoker') || {}   // 座位手牌标记

            this.textPokerType = this.boxPokerType.getChildByName('textPokerType')  // 牌型文字
            this.boxPoint = this.boxBet.getChildByName('boxPoint')                  // 投注点数
            // 动画元素
            this.aniFire = new Laya.Animation()                                     // ALLIN火焰
            this.aniFire.loadAnimation('Fire.ani')
            this.aniFire.visible = false
            Laya.stage.addChild(this.aniFire)
            // 数据信息
            this.seatNo = inparam.seatNo                                            // 座位真实ID
            this.userId = inparam.userId                                            // 玩家ID
            this.headurl = inparam.headurl                                          // 座位图片名称
            this.seatPoint = inparam.seatPoint                                      // 座位带入点数
            this.betPoint = inparam.betPoint                                        // 投注点数
            // this.betPointArr = []                                                // 投注点数数组
            this.speakCountDown = 0                                                 // 说话时间倒计时
            this.status = inparam.status                                            // 座位状态
            // 坐标还原信息
            this.imgChipX = this.imgChip.x
            this.imgChipY = this.imgChip.y
            this.boxBetX = this.boxBet.x
            this.boxBetY = this.boxBet.y
        }
    }

    /**
     * 重置
     */
    reset() {
        // 显示头像
        this.imgHead.skin = `ui/${this.headurl}`
        // this.imgSeat.skin = `ui/${this.headurl}`
        // this.imgSeat.skin = `ui/rectprogress.png`
        // this.maskSeat.texture = `ui/${this.headurl}`
        // this.maskSeat.alpha = 1
        // 显示筹码
        if (this.userId != 0) {
            this.textSeatPoint.text = this.seatPoint
            this.textSeatPoint.visible = true
        } else {
            this.textSeatPoint.visible = false
        }
        this.boxBet.visible = false
        this.boxPokerType.visible = false
        // 隐藏手牌标识
        this.imgHandPoker.visible = false
        // 火焰动画停止
        this.aniFire.stop()
        this.aniFire.visible = false
        // 还原动画元素
        this.imgChip.x = this.imgChipX
        this.imgChip.y = this.imgChipY
        this.boxBet.x = this.boxBetX
        this.boxBet.y = this.boxBetY
    }

    /**
     * 刷新
     */
    refresh() {
        // 显示头像
        this.imgHead.skin = `ui/${this.headurl}`
        // 显示筹码,手牌标识,座位更新
        if (this.userId != 0) {
            this.textSeatPoint.text = this.seatPoint
            this.textSeatPoint.visible = true
            this.imgHandPoker.visible = true
            this.update(null, null, true)
        } else {
            this.textSeatPoint.visible = false
            this.imgHandPoker.visible = false
        }
        this.boxBet.visible = false
        this.boxPokerType.visible = false
        // 火焰动画停止
        this.aniFire.stop()
        this.aniFire.visible = false
        // 还原动画元素
        this.imgChip.x = this.imgChipX
        this.imgChip.y = this.imgChipY
        this.boxBet.x = this.boxBetX
        this.boxBet.y = this.boxBetY
    }

    /**
     * 根据数据更新座位界面
     * @param userId 更新的用户ID
     * @param pokerType 牌型
     * @param isRefresh 是否刷新
     */
    update(userId, pokerType, isRefresh) {
        // 状态更新
        this.showTag()
        // 自己位置更新牌型
        if (this.userId == userId) {
            pokerType && this.updatePokerType(pokerType)
        }
        // 投注更新
        if (this.betPoint) {
            this.bet(isRefresh)
        } else {
            this.hideBet()
        }
        // 所有座位倒计时关闭
        this.closeCountDown()
    }

    /**
     * 入座
     */
    sitdown() {
        this.imgHead.skin = `ui/${this.headurl}`
        // this.imgSeat.skin = `ui/${this.headurl}`
        // this.imgSeat.skin = `ui/rectprogress.png`
        // this.maskSeat.texture = `ui/${this.headurl}`
        if (this.userId) {
            this.textName.text = this.userId
            this.textSeatPoint.text = this.seatPoint
            this.textName.visible = true
            this.textSeatPoint.visible = true
        } else {
            this.textName.visible = false
            this.textSeatPoint.visible = false
        }
    }

    /**
     * 倒计时20秒
     */
    countDown() {
        // this.maskSeat.alpha = 0.5
        this.speakCountDown = 0
        this.imgSeat.visible = true
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
        if (this.intervalCountDown) {
            clearInterval(this.intervalCountDown)
            // this.maskSeat.alpha = 1
            this.maskSeat.graphics.clear()
            this.maskSeat.graphics.drawPie(this.maskSeat.width / 2, this.maskSeat.height / 2, this.maskSeat.width, 0, 0.72, "#ffffff");
            this.imgSeat.visible = false
            // this.maskSeat.graphics.drawPie(this.maskSeat.width / 2, this.maskSeat.height / 2, this.maskSeat.width, 0, 360, "#ffffff");
        }
    }
    //投注动画（从初始位置移动至投注盒子）
    bet(isRefresh) {
        if (this.textSeatPoint.text != this.seatPoint || isRefresh) {
            let x = this.boxBet.x
            let y = this.boxBet.y
            this.imgChip.visible = true
            Laya.Tween.to(this.imgChip, { x, y }, 800, Laya.Ease.strongOut, Laya.Handler.create(this, this.betComplete, [this.seatPoint, this.betPoint]))
        } else {
            this.betComplete(this.seatPoint, this.betPoint)
        }
    }
    // 投注完成
    betComplete(seatPoint, betPoint) {
        // 移动筹码还原
        this.imgChip.visible = false
        this.imgChip.x = this.imgChipX
        this.imgChip.y = this.imgChipY
        // 座位点数更新，显示新投注点数
        this.textSeatPoint.text = seatPoint
        this.boxPoint.text = betPoint
        this.boxBet.visible = true
    }

    /**
     * 阶段结束动画
     */
    phaseEnd() {
        if (this.boxBet.visible) {
            let x = this.textRoundPoint.x
            let y = this.textRoundPoint.y
            Laya.Tween.to(this.boxBet, { x, y }, 800, Laya.Ease.strongOut, Laya.Handler.create(this, this.phaseEndComplete))
        }
    }
    // 阶段结束动画完成
    phaseEndComplete() {
        this.boxBet.visible = false
        this.boxBet.x = this.boxBetX
        this.boxBet.y = this.boxBetY
    }

    /**
     * 回收所有筹码动画
     */
    roundEnd() {
        if (this.status == 'win') {
            let x = this.imgChip.x
            let y = this.imgChip.y
            this.imgChip.x = this.textRoundPoint.x
            this.imgChip.y = this.textRoundPoint.y
            this.imgChip.visible = true
            Laya.Tween.to(this.imgChip, { x, y }, 800, Laya.Ease.strongOut, Laya.Handler.create(this, this.roundEndComplete))
        }
    }
    // 回收所有筹码动画完成
    roundEndComplete() {
        this.imgChip.visible = false
    }
    // 隐藏投注盒子
    hideBet() {
        this.boxBet.visible = false
    }
    // 根据状态显示提示
    showTag() {
        if (this.status) {
            if (this.status != 'allin') {
                this.imgTag.skin = `ui/tag_${this.status}.png`
                this.imgTag.visible = true
            } else if (!this.aniFire.visible) {
                this.aniFire.x = this.boxSeat.x + this.imgHead.x
                this.aniFire.y = this.boxSeat.y + this.imgHead.y + 5
                this.aniFire.visible = true
                this.aniFire.play(0, true, `fire${this.seatNo}`)
            }
        } else {
            this.imgTag.visible = false
        }
    }
    // 更新牌型
    // @param {*} pokerType 
    updatePokerType(pokerType) {
        this.boxPokerType.visible = true
        this.textPokerType.text = pokerType
    }
    // 离座
    leave() {

    }
}