import WebSocket from '../util/WebSocket'

/**
 * 跟注，betPoint==-1
 */
export default class Follow extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: -1 })
    }
}