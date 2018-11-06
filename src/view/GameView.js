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
        if (this.pokers) {
            for (let poker of this.pokers) {
                poker.reset()
            }
        }
        this.seatCount = 9                          // 座位数量
        this.seats = []                             // 座位数组     
        this.pokers = []                            // 扑克牌数组
        this.pokerSentIndex = 0                     // 已发牌索引
        this.pokerHandCount = this.seatCount * 2    // 手牌数量
        this.pokerCount = this.pokerHandCount + 5   // 所有牌数量

        // 遍历所有空座位
        for (let i = 0; i < 9; i++) {
            // 获取界面元素
            let seat = this.getChildByName(`seat${i}`)
            let point = this.getChildByName(`point${i}`)            
            // 显示头像
            let seatData = WebSocket.globalData.round.seatMap[seat.name]
            seat.skin = `ui/${seatData.headurl}`
            seatData.seatImg = seat
            seatData.pointText = point
            // 显示筹码
            if (seatData.userId != 0) {
                point.text = seatData.point
                point.visible = true
            }
            else {
                point.visible = false
            }
            this.seats.push(seat)
        }
        // 大小盲移动
        this.chipMove(WebSocket.globalData.round.chipIndex)
    }

    // 鼠标点击事件
    onMouseDown() {
        // 每局游戏新开始，并且就坐人数大于2
        if (this.pokerSentIndex == 0 && WebSocket.globalData.isBegin) {
            // 初始化牌组
            WebSocket.send({ method: 'SEND_CARD', count: this.pokerCount }).then((data) => {
                for (let i = 0; i < data.pokers.length; i++) {
                    let poker = {}
                    // 手牌
                    if (i < this.pokerHandCount) {
                        poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`), seatImg: this.seats[i % this.seatCount], dataPoker: data.pokers[i] })
                    }
                    // 公牌
                    else {
                        poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`), dataPoker: data.pokers[i] })
                    }
                    this.pokers.push(poker)
                }
                // 发手牌
                Laya.timer.loop(300, this, this.onSendPoker)  // 每300毫循环一次
                // Laya.timer.frameLoop(10, this, this.onLoop) // 每10帧循环一次
            })
        }
        // 发放公共牌
        if (this.pokerSentIndex >= this.pokerHandCount && this.pokerSentIndex < this.pokerCount) {
            Laya.timer.loop(300, this, this.onShowPublicPoker)
        }
        if (this.pokerSentIndex == 23) {
            WebSocket.send({ method: 'ROUND_BEGIN' })
        }
    }

    // 发牌
    onSendPoker() {
        this.pokers[this.pokerSentIndex].send(this.pokerSentIndex)
        this.pokerSentIndex++
        // 手牌发牌结束
        if (this.pokerSentIndex == this.pokerHandCount) {
            // 隐藏剩余牌，为展开公牌做准备
            // for (let i = this.pokerSentIndex + 1; i <= 22; i++) {
            //     this.pokers[i].hide()
            // }
            Laya.timer.clear(this, this.onSendPoker)
        }
    }

    // 展开三张公牌
    onShowPublicPoker() {
        this.pokers[this.pokerSentIndex].sendPublic(this.pokerSentIndex - this.pokerHandCount)
        this.pokerSentIndex++
        // 发牌行为结束
        if (this.pokerSentIndex >= this.pokerHandCount + 3) {
            Laya.timer.clear(this, this.onShowPublicPoker)
        }
    }

    // 大小盲移动
    chipMove(chipIndex) {
        // 大盲顺时针移动
        if (this.seats[chipIndex]) {
            this.chip2.x = this.seats[chipIndex].x + 10
            this.chip2.y = this.seats[chipIndex].y - 30
            this.chipText2.x = this.chip2.x - 10
            this.chipText2.y = this.chip2.y - 15
        }
        // 小盲顺时针移动
        let chipIndex2 = chipIndex - 1 < 0 ? 8 : chipIndex - 1
        if (this.seats[chipIndex2]) {
            this.chip1.x = this.seats[chipIndex2].x + 10
            this.chip1.y = this.seats[chipIndex2].y - 30
            this.chipText1.x = this.chip1.x - 10
            this.chipText1.y = this.chip1.y - 15
        }
    }
}