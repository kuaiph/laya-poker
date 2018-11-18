import WebSocket from '../util/WebSocket'

/**
 * 弃牌，betPoint==0
 */
export default class Abandon extends Laya.Script {
    onEnable() {
        this.user = WebSocket.globalData.user
        this.seatMap = WebSocket.globalData.round.seatMap
    }
    onClick() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 0 })
    }
}