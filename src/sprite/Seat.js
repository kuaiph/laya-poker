import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'SIT_DOWN', user: WebSocket.globalData.user, seatId: this.owner.name, point: 200 })
    }
}