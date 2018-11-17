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
        if (this.owner.name == 'imgFixrise0') {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 4 })
        } else if (this.owner.name == 'imgFixrise1') {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 6 })
        } else {
            WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 12 })
        }
    }
}