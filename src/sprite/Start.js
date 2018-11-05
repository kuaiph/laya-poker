import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {

    }
    onClick() {
        let userId = 123456
        WebSocket.send({ method: 'JOIN_TABLE', userId }).then((res) => {
            if (!res.err) {
                WebSocket.globalData = { user: res.user, seatMap: res.seatMap }
                Laya.Scene.open('Game.scene')
            }
        })
    }
}