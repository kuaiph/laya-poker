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
        this.pokerX = this.imgPoker.x
        this.pokerY = this.imgPoker.y
        // this.reset()
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
        this.isMe = this.seat.boxSeat.name == 'seat0' ? true : false
        let x = this.seat.boxSeat.x
        if (this.isMe) {
            if (!this.user.firstSent) {
                x += 90
                this.user.firstSent = true
            } else {
                x += 190
            }
        }
        Laya.Tween.to(this.imgPoker, { x, y: this.seat.boxSeat.y + 35 }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete))
    }
    // 手牌发牌完成
    sendComplete() {
        if (!this.isMe) {
            this.imgPoker.visible = false
        } else {
            this.imgPoker.skin = `ui/pokers/${this.dataPoker.card}.png`
        }
        this.seat.imgHandPoker.visible = true
    }
    // 发公共牌
    sendPublic(publicIndex) {
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
        Laya.Tween.to(this.imgPoker, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendPublicComplete))
    }
    // 公牌发牌完成
    sendPublicComplete() {
        this.imgPoker.skin = `ui/pokers/${this.dataPoker.card}.png`
    }
}