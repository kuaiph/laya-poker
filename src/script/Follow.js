import WebSocket from '../util/WebSocket'

/**
 * 跟注，betPoint==-1
 */
export default class Follow extends Laya.Script {
    onEnable() {
    }
    onClick() {
        // 隐藏控制台
        WebSocket.globalData.gameView.control.silent()
        // 跟注请求
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: -1 })
    }
}