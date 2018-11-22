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
        let roundPoint = WebSocket.globalData.round.roundPoint
        let fixBetPoint0 = Math.floor(1 / 2 * roundPoint)
        let fixBetPoint1 = Math.floor(2 / 3 * roundPoint)
        let fixBetPoint2 = Math.floor(2 * roundPoint)
        if (this.owner.name == 'btnFixrise0') {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: fixBetPoint0 })
        } else if (this.owner.name == 'btnFixrise1') {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: fixBetPoint1 })
        } else {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: fixBetPoint2 })
        }
    }
}