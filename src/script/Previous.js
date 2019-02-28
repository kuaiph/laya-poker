import WebSocket from '../util/WebSocket'

/**
 * 游戏记录前一页翻页请求
 */
export default class Previous extends Laya.Script {
    onEnable() {
    }
    onClick() {
        // 前一页请求
        let pageIndex = WebSocket.globalData.user.pageIndex = WebSocket.globalData.user.pageIndex - 1
        WebSocket.send({ method: 'RIGHT_PANEL', pageIndex })
    }
}