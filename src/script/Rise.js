import WebSocket from '../util/WebSocket'

/**
 * 加注，betPoint>=大盲
 */
export default class Rise extends Laya.Script {
    constructor() {
        super()
    }
    onEnable() {
    }
    onClick() {
        // 隐藏控制台
        WebSocket.globalData.gameView.control.silent()
        // 根据对应固定加注按钮进行加注请求
        let roundPoint = WebSocket.globalData.round.roundPoint
        let fixBetPoint0 = Math.floor(1 / 2 * roundPoint)
        let fixBetPoint1 = Math.floor(2 / 3 * roundPoint)
        let fixBetPoint2 = Math.floor(2 * roundPoint)
        if (this.owner.name == 'btnFixrise0') {
            WebSocket.send({ method: 'BET', betPoint: fixBetPoint0 })
        } else if (this.owner.name == 'btnFixrise1') {
            WebSocket.send({ method: 'BET', betPoint: fixBetPoint1 })
        } else {
            WebSocket.send({ method: 'BET', betPoint: fixBetPoint2 })
        }
    }
}