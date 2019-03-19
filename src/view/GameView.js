import WebSocket from '../util/WebSocket'
import Poker from '../sprite/Poker'
import Dealer from '../sprite/Dealer'
import Seat from '../sprite/Seat'
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
        // 获取全局状态信息
        this.user = WebSocket.globalData.user                   // 当前玩家
        this.round = WebSocket.globalData.round                 // 当前局状态
        // 获取UI元素
        const btnAbandon = this.btnAbandon                      // 弃牌按钮
        const btnRise = this.btnRise                            // 加注按钮
        const btnFollow = this.btnFollow                        // 跟注按钮
        const vsliderPoint = this.vsliderPoint                  // 点数推杆
        const imgBetnum = this.imgBetnum                        // 推杆显示点数背景
        const textBetnum = this.textBetnum                      // 推杆显示点数
        const btnFixrise0 = this.btnFixrise0                    // 定制加注按钮0
        const btnFixrise1 = this.btnFixrise1                    // 定制加注按钮1
        const btnFixrise2 = this.btnFixrise2                    // 定制加注按钮2
        const textRoundPoint = this.textRoundPoint              // 底池点数        
        const boxPokerType = this.boxPokerType                  // 牌型

        // 创建控制台
        this.control = new Control({ btnAbandon, btnRise, btnFollow, vsliderPoint, imgBetnum, textBetnum, btnFixrise0, btnFixrise1, btnFixrise2, round: this.round })
        // 创建发牌器
        this.round.dealer = new Dealer()
        // 创建座位
        for (let i = 0; i < 9; i++) {
            // 获取界面元素
            const boxSeat = this.getChildByName(`seat${i}`)
            const maskSeat = this[`mask${i}`]
            const boxBet = this.getChildByName(`boxBet${i}`)
            const imgChip = this.getChildByName(`imgChip${i}`)
            // const maskSeat = boxSeat.getChildByName(`mask${i}`)
            // 创建座位对象，最后全局状态持久化
            this.round.seatMap[boxSeat.name] = new Seat(Object.assign(this.round.seatMap[boxSeat.name], { boxSeat, maskSeat, boxBet, imgChip, textRoundPoint, boxPokerType }))
        }
        // 重置/刷新界面信息
        if (!this.round.isBegin) {
            this.reset()
        } else {
            this.refresh()
        }

        // 注册点击事件
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
    }
    // 初始重置
    reset() {
        // 状态信息初始
        WebSocket.globalData.user.isFirstSent = false           // 记录是否是自己的首张牌，用于区分两张牌的X坐标
        // UI数据初始
        this.textPhasePoint.text = 0                            // 阶段分数
        this.textRoundPoint.text = '底池：0'                     // 底池分数
        // 座位初始
        for (let i = 0; i < 9; i++) {
            this.round.seatMap[`seat${i}`].reset()
        }
        // 发牌手初始
        this.round.dealer.reset()
    }
    // 刷新载入
    refresh() {
        // UI数据刷新
        this.textPhasePoint.text = this.round.phasePointMap[this.round.phase]   // 阶段分数
        this.textRoundPoint.text = `底池：${this.round.roundPoint}`              // 底池分数
        // 座位刷新
        for (let i = 0; i < 9; i++) {
            this.round.seatMap[`seat${i}`].refresh()
        }
        // 公牌刷新
        this.sendPublicPoker(this.round.publicPokerArr, true)
    }
    // 发手牌
    sendPoker(pokerArr, seatCount) {
        for (let pokerData of pokerArr) {
            const imgPoker = this.getChildByName(pokerData.pokerId)
            const seat = this.round.seatMap[pokerData.seatId]
            let poker = new Poker({ imgPoker, pokerData, seat, user: this.user })
            // 发牌手增加牌
            this.round.dealer.addPoker(poker)
        }
        // 初始化剩余牌组(排除手牌和公牌后的牌)
        for (let i = pokerArr.length + 5; i < 23; i++) {
            this.round.dealer.addRestPoker(new Poker({ imgPoker: this.getChildByName(`poker${i}`) }))
        }
        this.round.dealer.sendPoker()
    }
    // 发公共牌
    sendPublicPoker(pokerArr, isRefresh) {
        for (let pokerData of pokerArr) {
            const imgPoker = this.getChildByName(pokerData.pokerId)
            let poker = new Poker({ imgPoker, pokerData })
            // 发牌手增加牌
            this.round.dealer.addPoker(poker)
        }
        this.round.dealer.showPublicPoker(isRefresh)
    }
    // 更新阶段累计点数和底池累计点数
    updatePoint() {
        this.textPhasePoint.text = this.round.phasePoint                // 阶段分数
        this.textRoundPoint.text = `底池：${this.round.roundPoint}`      // 底池分数
    }
    // 鼠标点击响应
    onMouseDown(e) {
        // 关闭玩家列表
        if (e.stageX > this.listUser.width) {
            this.panelLeft.visible = false
        }
        // 关闭游戏记录列表
        if (e.stageX < this.width - this.panelRight.width) {
            this.panelRight.visible = false
        }
    }
}