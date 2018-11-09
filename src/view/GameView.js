import WebSocket from '../util/WebSocket'
import Poker from '../sprite/Poker'
import Dealer from '../sprite/Dealer'
import Seat from '../sprite/Seat'
import Blind from '../sprite/Blind'

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
        // 获取UI元素
        const imgAbandon = this.imgAbandon                      // 弃牌按钮
        const imgRise = this.imgRise                            // 加注按钮
        const imgFollow = this.imgFollow                        // 跟注按钮
        const vsliderPoint = this.vsliderPoint                  // 点数推杆
        
        // 创建发牌器
        if (this.round.dealer) {
            this.round.dealer.reset()
        }
        this.round.dealer = new Dealer()
        // 创建空座位
        for (let i = 0; i < 9; i++) {
            // 获取界面元素
            const imgSeat = this.getChildByName(`seat${i}`)
            const textPoint = this.getChildByName(`point${i}`)
            const box = this.getChildByName(`box${i}`)
            // 创建座位对象，并更新全局座位图，最后全局状态持久化
            const seat = new Seat(Object.assign(this.round.seatMap[imgSeat.name], { imgSeat, textPoint, box, imgAbandon, imgRise, imgFollow, vsliderPoint }))
            seat.init()
            this.round.seatMap[imgSeat.name] = seat
        }
        // 创建盲注，且移动，最后全局状态持久化
        const blind = new Blind({ imgChipBig: this.imgChipBig, imgChipSmall: this.imgChipSmall, textChipBig: this.textChipBig, textChipSmall: this.textChipSmall, chipSeatIdArr: this.round.chipSeatIdArr, seatMap: this.round.seatMap })
        blind.move()
        this.round.blind = blind
    }
    // 鼠标点击事件
    onMouseDown() {
        this.clickCount ? this.clickCount++ : this.clickCount = 1
        this.clickCount > 6 ? this.clickCount = 0 : null
        // 每局游戏新开始，并且就坐人数大于2
        if (this.round.dealer.pokerSentIndex == 0 && this.round.isBegin && this.clickCount > 5) {
            // 请求服务器发牌
            WebSocket.send({ method: 'SEND_CARD', user: this.user }).then((data) => {
                // 初始化真实牌组
                for (let dataPoker of data.pokers) {
                    let poker = {}
                    const imgPoker = this.getChildByName(dataPoker.pokerId)
                    // 手牌
                    if (dataPoker.seatId) {
                        const imgSeat = this.round.seatMap[dataPoker.seatId].imgSeat
                        poker = new Poker({ imgPoker, imgSeat, dataPoker, isPublic: false })
                    }
                    // 公牌
                    else {
                        poker = new Poker({ imgPoker, dataPoker, isPublic: true })
                    }
                    // 发牌手增加牌
                    this.round.dealer.addPoker(poker)
                }
                // 初始化剩余牌组
                for (let i = data.pokers.length; i < 23; i++) {
                    this.round.dealer.addRestPoker(new Poker({ imgPoker: this.getChildByName(`poker${i}`) }))
                }
                this.round.dealer.sendPoker()
            })
        }
        // 发放公共牌
        this.round.dealer.showPublicPoker()
        // 新一局
        if (this.round.dealer.pokerSentIndex > 0 && this.round.dealer.pokerSentIndex == this.round.dealer.pokers.length) {
            WebSocket.send({ method: 'ROUND_BEGIN', user: this.user })
        }
    }
}