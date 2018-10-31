/**
 * 扑克类
 */
export default class Poker {
    constructor(inparam) {
        this.pokerImg = inparam.pokerImg
        this.seatImg = inparam.seatImg
        this.dataPoker = inparam.dataPoker
        this.isMe = false
        // this.reset()
    }
    // 重置
    reset() {
    }
    // 隐藏
    hide() {
        this.pokerImg.visible = false
    }
    // 发牌
    send(pokerSentIndex) {
        this.isMe = this.seatImg.name == 'seat0' ? true : false
        let x = this.seatImg.x
        if (this.isMe) {
            pokerSentIndex == 0 ? x += 50 : x += 100
        }
        Laya.Tween.to(this.pokerImg, { x, y: this.seatImg.y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete))
    }
    // 手牌发牌完成
    sendComplete() {
        if (!this.isMe) {
            this.pokerImg.visible = false
        } else {
            this.pokerImg.skin = `ui/${this.dataPoker.card}.png`
        }
    }
    // 发公共牌
    sendPublic(publicIndex) {
        let x = this.pokerImg.x
        let y = this.pokerImg.y + 80
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
        Laya.Tween.to(this.pokerImg, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendPublicComplete))
    }
    // 公牌发牌完成
    sendPublicComplete() {
        this.pokerImg.skin = `ui/${this.dataPoker.card}.png`
    }
}