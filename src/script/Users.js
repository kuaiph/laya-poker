import WebSocket from '../util/WebSocket'

/**
 * 所有玩家
 */
export default class Users extends Laya.Script {
    onEnable() {
        
    }
    onClick() {
        let panelLeft = WebSocket.globalData.gameView.panelLeft // 左侧全部面板
        // 获取历史入局玩家列表
        WebSocket.send({ method: 'LEFT_PANEL' })
        panelLeft.visible = true
    }
}