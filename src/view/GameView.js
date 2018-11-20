import WebSocket from '../util/WebSocket'
import Poker from '../sprite/Poker'
import Dealer from '../sprite/Dealer'
import Seat from '../sprite/Seat'
// import Blind from '../sprite/Blind'
import Control from '../sprite/Control'

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
        // 获取全局状态信息
        this.user = WebSocket.globalData.user                   // 当前玩家
        this.round = WebSocket.globalData.round                 // 当前局状态
        this.textPhasePoint.text = 0                            // 阶段分数
        this.textRoundPoint.text = '底池：0'                     // 底池分数
        // 获取UI元素
        const imgAbandon = this.imgAbandon                      // 弃牌按钮
        const imgRise = this.imgRise                            // 加注按钮
        const imgFollow = this.imgFollow                        // 跟注按钮
        const vsliderPoint = this.vsliderPoint                  // 点数推杆
        const imgFixrise0 = this.imgFixrise0                    // 定制加注按钮0
        const imgFixrise1 = this.imgFixrise1                    // 定制加注按钮1
        const imgFixrise2 = this.imgFixrise2                    // 定制加注按钮2

        // 创建发牌器
        if (this.round.dealer) {
            this.round.dealer.reset()
        }
        this.round.dealer = new Dealer()
        // 创建空座位
        for (let i = 0; i < 9; i++) {
            // 获取界面元素
            const boxSeat = this.getChildByName(`seat${i}`)
            const maskSeat = this[`mask${i}`]
            // const maskSeat = boxSeat.getChildByName(`mask${i}`)            
            // 创建座位对象，最后全局状态持久化
            this.round.seatMap[boxSeat.name] = new Seat(Object.assign(this.round.seatMap[boxSeat.name], { boxSeat, maskSeat }))
        }
        // 创建控制台
        this.control = new Control({ imgAbandon, imgRise, imgFollow, vsliderPoint, imgFixrise0, imgFixrise1, imgFixrise2, round: this.round })
        // 创建盲注，最后全局状态持久化
        // this.round.blind = new Blind({ textChipBig: this.textChipBig, textChipSmall: this.textChipSmall, seatMap: this.round.seatMap })
    }

    // 发手牌
    sendPoker(pokerArr, seatCount) {
        // this.round.blind.move(this.round.chipSeatIdArr)
        for (let dataPoker of pokerArr) {
            const imgPoker = this.getChildByName(dataPoker.pokerId)
            const seat = this.round.seatMap[dataPoker.seatId]
            let poker = new Poker({ imgPoker, seat, dataPoker, isPublic: false, user: this.user })
            // 发牌手增加牌
            this.round.dealer.addPoker(poker)
        }
        // 初始化剩余牌组
        for (let i = pokerArr.length + 5; i < 23; i++) {
            this.round.dealer.addRestPoker(new Poker({ imgPoker: this.getChildByName(`poker${i}`) }))
        }
        this.round.dealer.sendPoker()
    }

    // 发公共牌
    sendPublicPoker(pokerArr) {
        for (let dataPoker of pokerArr) {
            const imgPoker = this.getChildByName(dataPoker.pokerId)
            let poker = new Poker({ imgPoker, dataPoker, isPublic: true })
            // 发牌手增加牌
            this.round.dealer.addPoker(poker)
        }
        this.round.dealer.showPublicPoker()
    }

    // 更新阶段累计点数和底池累计点数
    updatePoint() {
        this.textPhasePoint.text = this.round.phasePoint                // 阶段分数
        this.textRoundPoint.text = `底池：${this.round.roundPoint}`      // 底池分数
    }
}