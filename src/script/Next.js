import WebSocket from '../util/WebSocket'

/**
 * 游戏记录后一页翻页请求
 */
export default class Next extends Laya.Script {
    onEnable() {
    }
    onClick() {
        // 后一页请求
        let pageIndex = WebSocket.globalData.user.pageIndex = WebSocket.globalData.user.pageIndex + 1
        WebSocket.send({ method: 'RIGHT_PANEL', pageIndex })
    }
}