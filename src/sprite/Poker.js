/**
 * 扑克类
 */
export default class Poker {
    constructor(inparam) {
        // UI元素
        this.imgPoker = inparam.imgPoker
        this.seat = inparam.seat
        // 数据信息
        this.dataPoker = inparam.dataPoker
        this.isPublic = inparam.isPublic
        this.isMe = false
        this.user = inparam.user
        // this.reset()
    }
    // 重置
    reset() {
        this.imgPoker.x = 160
        this.imgPoker.y = 297
        this.imgPoker.skin = 'ui/poker.png'
        this.imgPoker.visible = true
    }
    // 隐藏
    hide() {
        this.imgPoker.visible = false
    }
    // 发牌
    send() {
        this.isMe = this.seat.boxSeat.name == 'seat0' ? true : false
        let x = this.seat.boxSeat.x
        if (this.isMe) {
            if (!this.user.firstSent) {
                x += 50
                this.user.firstSent = true
            } else {
                x += 107
            }
        }
        Laya.Tween.to(this.imgPoker, { x, y: this.seat.boxSeat.y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete))
    }
    // 手牌发牌完成
    sendComplete() {
        if (!this.isMe) {
            this.imgPoker.visible = false
        } else {
            this.imgPoker.skin = `ui/${this.dataPoker.card}.png`
        }
        this.seat.imgHandPoker.visible = true
    }
    // 发公共牌
    sendPublic(publicIndex) {
        let x = this.imgPoker.x
        let y = this.imgPoker.y + 100
        switch (publicIndex) {
            case 0:
                x -= 110
                break;
            case 1:
                x -= 55
                break;
            case 2:
                break;
            case 3:
                x += 55
                break;
            case 4:
                x += 110
                break;
            default:
                break;
        }
        Laya.Tween.to(this.imgPoker, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendPublicComplete))
    }
    // 公牌发牌完成
    sendPublicComplete() {
        this.imgPoker.skin = `ui/${this.dataPoker.card}.png`
    }
}