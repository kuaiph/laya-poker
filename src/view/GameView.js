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
        this.pokers = []
        this.seats = []
        this.pokerSentIndex = 0
        this.seatCount = 9
    }
    onEnable() {
        // 初始化
        this.init()
        // 启动游戏，发牌
        this.gameStart()
    }
    // 初始化
    init() {
        // 居中显示
        this.centerX = 0
        this.centerY = 0
        // 初始化桌位
        for (let i = 0; i < this.seatCount; i++) {
            // console.log(this.getChildByName(`seat${i}`))
            this.seats.push(this.getChildByName(`seat${i}`))
        }
        // 初始化牌组
        for (let i = 0; i < this.seatCount * 2; i++) {
            // console.log(this.getChildByName(`poker${i}`))
            let poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`), seatImg: this.seats[i % this.seatCount] })
            this.pokers.push(poker)
        }
        // 初始化公牌
        for (let i = this.seatCount * 2; i < this.seatCount * 2 + 5; i++) {
            // console.log(this.getChildByName(`poker${i}`))
            let poker = new Poker({ pokerImg: this.getChildByName(`poker${i}`) })
            this.pokers.push(poker)
        }
        // 加载鼠标点击事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
    }
    // 游戏启动
    gameStart() {
        // 每人发两张牌
        Laya.timer.loop(300, this, this.onSendPoker)  // 每300毫循环一次
        // LayaApp.socket.send(JSON.stringify({ method: 'SEND_CARD', count: 18 }))
        // Laya.timer.frameLoop(10, this, this.onLoop) // 每10帧循环一次
    }
    // 发牌
    onSendPoker() {
        if (this.pokers[this.pokerSentIndex].seatImg.y == 608) {
            this.pokers[this.pokerSentIndex].pokerImg.skin = 'ui/1C.png'
        }
        this.pokers[this.pokerSentIndex].send(this.pokerSentIndex)
        this.pokerSentIndex++
        // 发牌结束
        if (this.pokerSentIndex == 18) {
            // 隐藏剩余牌，为展开公牌做准备
            // for (let i = this.pokerSentIndex + 1; i <= 22; i++) {
            //     this.pokers[i].hide()
            // }
            Laya.timer.clear(this, this.onSendPoker)
        }
    }

    // 鼠标点击事件
    onMouseDown() {
        if (this.pokerSentIndex >= 18 && this.pokerSentIndex <= 22) {
            Laya.timer.loop(300, this, this.onShowThreePoker)
        }
    }

    // 展开三张公牌
    onShowThreePoker() {
        this.pokers[this.pokerSentIndex].sendPublic(this.pokerSentIndex - 18)
        this.pokerSentIndex++
        if (this.pokerSentIndex > 20) {
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