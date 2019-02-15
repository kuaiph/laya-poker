import WebSocket from '../util/WebSocket'

/**
 * 弃牌，betPoint==0
 */
export default class Abandon extends Laya.Script {
    onEnable() {
    }
    onClick() {
        // 隐藏控制台
        WebSocket.globalData.gameView.control.silent()
        // 弃牌请求
        WebSocket.send({ method: 'BET', betPoint: 0 })
    }
}