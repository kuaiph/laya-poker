/**
 * 扑克类
 */
class Poker {
    constructor(inparam) {
        this.pokerImg = inparam.pokerImg
        this.seatImg = inparam.seatImg
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
        let x = this.seatImg.x
        let isMe = this.seatImg.y == 608 ? true : false
        if (isMe) {
            pokerSentIndex == 0 ? x += 50 : x += 100
        }
        Laya.Tween.to(this.pokerImg, { x, y: this.seatImg.y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete, [isMe]))
    }
    // 发牌完成
    sendComplete(isMe) {
        if (!isMe) {
            this.pokerImg.visible = false
        }
    }
    // 发公共牌
    sendPublic(publicIndex) {
        let x = this.pokerImg.x
        let y = this.pokerImg.y + 80
        switch (publicIndex) {
            case 0:
                x -= 120
                break;
            case 1:
                x -= 60
                break;
            case 2:
                break;
            case 3:
                x += 60
                break;
            case 4:
                x += 120
                break;
            default:
                break;
        }
        Laya.Tween.to(this.pokerImg, { x, y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendPublicComplete))
    }
    sendPublicComplete() {

    }
}