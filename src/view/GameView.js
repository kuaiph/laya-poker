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
        GameView.instance = this
        this.seatCount = 9                          // 座位数量    
        this.seats = []                             // 座位数组            
        this.pokers = []                            // 扑克牌数组
        this.pokerSentIndex = 0                     // 已发牌索引
        this.pokerHandCount = this.seatCount * 2    // 手牌数量
        this.pokerCount = this.pokerHandCount + 5   // 所有牌数量
    }
    onEnable() {
        // 初始化
        this.init()
        // 启动游戏，发牌
        this.gameStart()
    }
    onClosed() {
        WebSocket.socket.close()
    }
    // 初始化
    init() {
        // 初始化桌位
        for (let i = 0; i < this.seatCount; i++) {
            this.seats.push(this.getChildByName(`seat${i}`))
        }
        // 初始化牌组
        for (let i = 0; i < this.pokerCount; i++) {
            let poker = {}
            // 手牌
            if (i < this.pokerHandCount) {
                poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`), seatImg: this.seats[i % this.seatCount] })
            }
            // 公牌
            else {
                poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`) })
            }
            this.pokers.push(poker)
        }
        // 加载鼠标点击事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
    }
    // 游戏启动
    gameStart() {
        // 每人发两张牌
        WebSocket.send({ method: 'SEND_CARD', count: this.pokers.length }).then((data) => {
            Laya.timer.loop(300, this, this.onSendPoker, [data.pokers])  // 每300毫循环一次
        })
        // Laya.timer.frameLoop(10, this, this.onLoop) // 每10帧循环一次
    }
    // 发牌
    onSendPoker(args) {
        if (this.pokers[this.pokerSentIndex].seatImg.y == 608) {
            this.pokers[this.pokerSentIndex].pokerImg.skin = `ui/${args[this.pokerSentIndex].card}.png`
        }
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

    // 鼠标点击事件
    onMouseDown() {
        if (this.pokerSentIndex >= this.pokerHandCount && this.pokerSentIndex < this.pokerCount) {
            Laya.timer.loop(300, this, this.onShowThreePoker)
        }
    }

    // 展开三张公牌
    onShowThreePoker() {
        this.pokers[this.pokerSentIndex].sendPublic(this.pokerSentIndex - this.pokerHandCount)
        this.pokerSentIndex++
        if (this.pokerSentIndex >= this.pokerHandCount + 3) {
            Laya.timer.clear(this, this.onShowThreePoker)
        }
    }
    // 展开四张公牌
    onShowFourPoker() {

    }
    // 展开五张公牌
    onShowFivePoker() {

    }
}