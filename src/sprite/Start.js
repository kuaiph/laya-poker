import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {

    }
    onClick() {
        let userId = Math.floor(Math.random() * 1000000)
        let point = 200
        let headurl = 'person.jpg'
        WebSocket.send({ method: 'ROUND_BEGIN', user: { userId, point, headurl } }).then((res) => {
            if (!res.err) {
                WebSocket.globalData = { user: res.user, round: res.round }
                Laya.Scene.open('Game.scene')
            }
        })
    }
}