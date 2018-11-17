/**
 * 扑克类
 */
export default class Poker {
    constructor(inparam) {
        // UI元素
        this.imgPoker = inparam.imgPoker
        this.imgSeat = inparam.imgSeat
        // 数据信息
        this.dataPoker = inparam.dataPoker
        this.isPublic = inparam.isPublic        
        this.isMe = false
        // this.reset()
    }
    // 重置
    reset() {
        this.imgPoker.x = 160
        this.imgPoker.y = 297
        this.imgPoker.skin='ui/poker.png'
        this.imgPoker.visible = true
    }
    // 隐藏
    hide() {
        this.imgPoker.visible = false
    }
    // 发牌
    send(pokerSentIndex) {
        this.isMe = this.imgSeat.name == 'seat0' ? true : false
        let x = this.imgSeat.x
        if (this.isMe) {
            pokerSentIndex == 0 ? x += 50 : x += 107
        }
        Laya.Tween.to(this.imgPoker, { x, y: this.imgSeat.y }, 500, Laya.Ease.strongOut, Laya.Handler.create(this, this.sendComplete))
    }
    // 手牌发牌完成
    sendComplete() {
        if (!this.isMe) {
            this.imgPoker.visible = false
        } else {
            this.imgPoker.skin = `ui/${this.dataPoker.card}.png`
        }
    }
    // 发公共牌
    sendPublic(publicIndex) {
        let x = this.imgPoker.x
        let y = this.imgPoker.y + 80
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