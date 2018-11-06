import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {

    }
    onClick() {
        let userId = 223456
        WebSocket.send({ method: 'ROUND_BEGIN', userId }).then((res) => {
            if (!res.err) {
                WebSocket.globalData = { round: res.round, isBegin: false }
                Laya.Scene.open('Game.scene')
            }
        })
    }
}