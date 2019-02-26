import WebSocket from '../util/WebSocket'

/**
 * 游戏记录
 */
export default class Records extends Laya.Script {
    onEnable() {
    }
    onClick() {
        let panelRight = WebSocket.globalData.gameView.panelRight // 右侧全部面板
        // 获取历史记录
        WebSocket.send({ method: 'RIGHT_PANEL' })
        panelRight.visible = true
    }
}