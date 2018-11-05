import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {

    }
    onClick() {
        let userId = 123456
        WebSocket.send({ method: 'JOIN_TABLE', userId }).then((data) => {
            if (data.status == 0) {
                WebSocket.globalData = { user: data.user, seatArr: data.seatArr }
                Laya.Scene.open('Game.scene')
            }
        })
    }
}