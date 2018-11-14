import WebSocket from '../util/WebSocket'

/**
 * 加注，betPoint>=大盲
 */
export default class Rise extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 10 })
    }
}