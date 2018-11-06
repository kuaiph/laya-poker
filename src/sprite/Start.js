import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {

    }
    onClick() {
        let userId = 123456
        WebSocket.send({ method: 'JOIN_TABLE', userId }).then((res) => {
            if (!res.err) {
                WebSocket.globalData = { round: { user: res.user, seatMap: res.seatMap, chipIndex: res.chipIndex } }
                Laya.Scene.open('Game.scene')
            }
        })
    }
}