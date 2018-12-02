import WebSocket from '../util/WebSocket'

/**
 * 所有玩家
 */
export default class Users extends Laya.Script {
    onEnable() {
    }
    onClick() {
        let listUser = WebSocket.globalData.gameView.listUser
        let data = []
        for (let i = 0; i < 20; i++) {
            data.push({
                m_label0: { text: `label0-${i}` },
                m_label1: { text: `label1-${i}` },
                m_label2: { text: `label2-${i}` }
            })
        }
        listUser.vScrollBarSkin = ""
        listUser.array = data
        listUser.visible = true
    }
}