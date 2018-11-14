import WebSocket from '../util/WebSocket'

/**
 * 弃牌，betPoint==0
 */
export default class Abandon extends Laya.Script {
    onEnable() {
        this.user = WebSocket.globalData.user
        this.seatMap = WebSocket.globalData.round.seatMap
    }
    onClick() {
        WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, betPoint: 0 })
        // if (this.seatMap) {
        //     for (let seatId in this.seatMap) {
        //         let seat = this.seatMap[seatId]
        //         if (seat.userId == this.user.userId) {
        //             this.boxPoint = seat.box.getChildByName(`boxPoint`)
        //             seat.box.visible = false
        //             break
        //         }
        //     }
        // }
    }
}