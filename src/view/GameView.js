import WebSocket from '../util/WebSocket'
import Poker from '../sprite/Poker'

/**
 * 游戏主界面类
 * 载入扑克桌
 */
export default class GameView extends Laya.Scene {
    constructor() {
        super()
        //设置单例的引用方式，方便其他类引用
        WebSocket.globalData.gameView = this
    }
    onEnable() {
        this.init()
    }
    onClosed() {
        WebSocket.socket.close()
    }
    // 初始化
    init() {
        this.reset()
        // 加载鼠标点击事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
    }
    // 重置
    reset() {
        // 所有扑克恢复
        if (this.pokers) {
            for (let poker of this.pokers) {
                poker.reset()
            }
        }
        this.user = WebSocket.globalData.user               // 当前玩家
        this.round = WebSocket.globalData.round             // 当前局状态
        this.pokers = []                                    // 扑克牌数组
        this.pokerSentIndex = 0                             // 已发牌索引
        this.isSendPublic = false                           // 公牌发放开始
        // 遍历所有空座位
        for (let i = 0; i < 9; i++) {
            // 获取界面元素
            const seat = this.getChildByName(`seat${i}`)
            const point = this.getChildByName(`point${i}`)
            // 显示头像
            const seatData = this.round.seatMap[seat.name]
            seat.skin = `ui/${seatData.headurl}`
            seatData.seatImg = seat
            seatData.pointText = point
            seatData.sendCount = 0
            // 显示筹码
            if (seatData.userId != 0) {
                point.text = seatData.point
                point.visible = true
            }
            else {
                point.visible = false
            }
        }
        // 大小盲移动
        this.chipMove(this.round.chipSeatIdArr)
    }
    // 鼠标点击事件
    onMouseDown() {
        this.clickCount ? this.clickCount++ : this.clickCount = 1
        this.clickCount > 6 ? this.clickCount = 0 : null
        // 每局游戏新开始，并且就坐人数大于2
        if (this.pokerSentIndex == 0 && this.round.isBegin && this.clickCount > 5) {
            // 初始化牌组
            WebSocket.send({ method: 'SEND_CARD', user: this.user }).then((data) => {
                for (let dataPoker of data.pokers) {
                    let poker = {}
                    const pokerImg = this.getChildByName(dataPoker.pokerId)
                    // 手牌
                    if (dataPoker.seatId) {
                        const seatImg = this.round.seatMap[dataPoker.seatId].seatImg
                        poker = new Poker({ pokerImg, seatImg, dataPoker, isPublic: false })
                    }
                    // 公牌
                    else {
                        poker = new Poker({ pokerImg, dataPoker, isPublic: true })
                    }
                    this.pokers.push(poker)
                }
                // 发手牌
                Laya.timer.loop(300, this, this.onSendPoker)  // 每300毫循环一次
                // Laya.timer.frameLoop(10, this, this.onLoop) // 每10帧循环一次
            })
        }
        // 发放公共牌
        if (this.isSendPublic) {
            Laya.timer.loop(300, this, this.onShowPublicPoker)
        }
        // 新一局
        if (this.pokerSentIndex > 0 && this.pokerSentIndex == this.pokers.length) {
            WebSocket.send({ method: 'ROUND_BEGIN', user: this.user })
        }
    }

    // 发手牌
    onSendPoker() {
        this.pokers[this.pokerSentIndex].send(this.pokerSentIndex)
        this.pokerSentIndex++
        // 手牌发牌结束
        if (this.pokers[this.pokerSentIndex].isPublic) {
            // 隐藏剩余牌，为展开公牌做准备
            for (let i = this.pokerSentIndex + 5; i < 23; i++) {
                this.getChildByName(`poker${i}`).visible = false
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

    // 大小盲移动
    chipMove(chipSeatIdArr) {
        if (chipSeatIdArr) {
            // 大盲顺时针移动
            this.chip2.x = this.round.seatMap[chipSeatIdArr[0]].seatImg.x + 10
            this.chip2.y = this.round.seatMap[chipSeatIdArr[0]].seatImg.y - 30
            this.chipText2.x = this.chip2.x - 10
            this.chipText2.y = this.chip2.y - 15
            // 小盲顺时针移动
            this.chip1.x = this.round.seatMap[chipSeatIdArr[1]].seatImg.x + 10
            this.chip1.y = this.round.seatMap[chipSeatIdArr[1]].seatImg.y - 30
            this.chipText1.x = this.chip1.x - 10
            this.chipText1.y = this.chip1.y - 15
        }
    }
}