/**
 * 发牌手
 */
export default class Dealer {
    constructor(inparam) {
    }
    // 重置牌组
    reset() {
        this.pokerSentIndex = 0                                 // 已发牌索引
        this.pokerPublicSentIndex = 0                           // 公牌发牌索引
        for (let poker of this.pokers || []) {
            poker.reset()
        }
        for (let poker of this.restPokers || []) {
            poker.reset()
        }
        this.pokers = []                                        // 扑克牌数组
        this.restPokers = []                                    // 剩余扑克牌组
    }
    // 增加有用扑克
    addPoker(poker) {
        this.pokers.push(poker)
    }
    // 增加无用扑克
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
        Laya.timer.loop(300, this, this.onShowPublicPoker)
    }

    // 发手牌
    onSendPoker() {
        this.pokers[this.pokerSentIndex].send()
        this.pokerSentIndex++
        // 手牌发牌结束
        if (!this.pokers[this.pokerSentIndex]) {
            // 隐藏剩余牌，为展开公牌做准备
            for (let i = 0; i < this.restPokers.length; i++) {
                this.restPokers[i].hide()
            }
            Laya.timer.clear(this, this.onSendPoker)
        }
    }

    // 展开3/4/5公牌
    onShowPublicPoker() {
        this.pokers[this.pokerSentIndex].sendPublic(this.pokerPublicSentIndex)
        this.pokerPublicSentIndex++
        this.pokerSentIndex++
        // 公牌发牌结束
        if (!this.pokers[this.pokerSentIndex]) {
            Laya.timer.clear(this, this.onShowPublicPoker)
        }
    }
}