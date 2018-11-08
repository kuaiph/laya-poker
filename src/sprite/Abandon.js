import WebSocket from '../util/WebSocket'

export default class Abandon extends Laya.Script {
    onEnable() {
        this.user = WebSocket.globalData.user
        this.seatMap = WebSocket.globalData.round.seatMap
    }
    onClick() {
        if (this.seatMap) {
            for (let seatId in this.seatMap) {
                let seat = this.seatMap[seatId]
                if (seat.userId == this.user.userId) {
                    this.boxPoint = seat.box.getChildByName(`boxPoint`)
                    seat.box.visible = false
                    break
                }
            }
        }
        // WebSocket.send({ method: 'ABANDON', user: WebSocket.globalData.user, seatId: this.owner.name, point: 200 })
    }
}