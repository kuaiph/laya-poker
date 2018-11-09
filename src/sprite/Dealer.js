import WebSocket from '../util/WebSocket'
/**
 * 发牌手
 */
export default class Dealer {
    constructor(inparam) {
        this.pokers = []                                        // 扑克牌数组
        this.restPokers = []                                    // 剩余扑克牌组
        this.pokerSentIndex = 0                                 // 已发牌索引
        this.isSendPublic = false                               // 公牌发放开始
    }

    reset() {
        if (this.pokers) {
            for (let poker of this.pokers.concat()) {
                poker.reset()
            }

        }
        if (this.restPokers) {
            for (let poker of this.restPokers) {
                poker.reset()
            }
        }
    }

    addPoker(poker) {
        this.pokers.push(poker)
    }

    addRestPoker(poker) {
        this.restPokers.push(poker)
    }

    // 发牌
    sendPoker() {
        Laya.timer.loop(300, this, this.onSendPoker)
        // Laya.timer.frameLoop(10, this, this.onLoop) // 每10帧循环一次
    }
    // 展开公牌
    showPublicPoker() {
        if (this.isSendPublic) {
            Laya.timer.loop(300, this, this.onShowPublicPoker)
        }
    }

    // 发手牌
    onSendPoker() {
        this.pokers[this.pokerSentIndex].send(this.pokerSentIndex)
        this.pokerSentIndex++
        // 手牌发牌结束
        if (this.pokers[this.pokerSentIndex].isPublic) {
            // 隐藏剩余牌，为展开公牌做准备
            for (let i = 0; i < this.restPokers.length; i++) {
                this.restPokers[i].hide()
            }
            // 可以开始发公牌
            this.isSendPublic = true
            Laya.timer.clear(this, this.onSendPoker)
        }
    }

    // 展开三张公牌
    onShowPublicPoker() {
        this.isSendPublic = false
        this.pokers[this.pokerSentIndex].sendPublic(this.pokerSentIndex - (this.pokers.length - 5))
        this.pokerSentIndex++
        // 三张公牌结束
        if (this.pokerSentIndex >= this.pokers.length - 2) {
            Laya.timer.clear(this, this.onShowPublicPoker)
        }
        // 全部牌未结束
        if (this.pokerSentIndex < this.pokers.length) {
            this.isSendPublic = true
        }
    }
}