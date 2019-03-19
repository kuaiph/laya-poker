/**
 * 扑克类
 */
export default class Poker {
    constructor(inparam) {
        // UI元素
        this.imgPoker = inparam.imgPoker
        // 数据信息
        this.pokerData = inparam.pokerData
        this.seat = inparam.seat
        this.user = inparam.user
        this.isMe = inparam.seat && inparam.seat.boxSeat.name == 'seat0' ? true : false
        // 坐标还原信息
        this.pokerX = this.imgPoker.x
        this.pokerY = this.imgPoker.y
    }
    // 重置
    reset() {
        this.imgPoker.skin = 'ui/poker.png'
        this.imgPoker.x = this.pokerX
        this.imgPoker.y = this.pokerY
        this.imgPoker.visible = true
    }
    // 隐藏
    hide() {
        this.imgPoker.visible = false
    }
    // 发牌
    send() {
        let x = this.seat.boxSeat.x
        let y = this.seat.boxSeat.y + 33
        if (this.isMe) {
            if (!this.user.isFirstSent) {
                x += 100
                this.user.isFirstSent = true
            } else {
                x += 200
            }
        }
        Laya.Tween.to(this.imgPoker, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete))
    }
    // 手牌发牌完成，显示自己的牌，显示手牌标记
    sendComplete() {
        if (!this.isMe) {
            this.imgPoker.visible = false
        } else {
            this.imgPoker.skin = `ui/pokers/${this.pokerData.card}.png`
        }
        this.seat.imgHandPoker.visible = true
    }
    // 发公共牌
    sendPublic(publicIndex, isRefresh) {
        let x = this.imgPoker.x
        let y = this.imgPoker.y + 175
        switch (publicIndex) {
            case 0:
                x -= 200
                break;
            case 1:
                x -= 100
                break;
            case 2:
                break;
            case 3:
                x += 100
                break;
            case 4:
                x += 200
                break;
            default:
                break;
        }
        if (isRefresh) {
            this.imgPoker.pos(x, y)
            this.sendPublicComplete()
        } else {
            Laya.Tween.to(this.imgPoker, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendPublicComplete))
        }
    }
    // 公牌发牌完成
    sendPublicComplete() {
        this.imgPoker.skin = `ui/pokers/${this.pokerData.card}.png`
    }
}