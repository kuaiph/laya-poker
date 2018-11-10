import WebSocket from '../util/WebSocket'

export default class Rise extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 10 })
    }
}