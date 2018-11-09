import WebSocket from '../util/WebSocket'

export default class Rise extends Laya.Script {
    onEnable() {
        this.user = WebSocket.globalData.user
        this.seatMap = WebSocket.globalData.round.seatMap
        this.boxPointCount = 0
    }
    onClick(){
        if (this.seatMap) {
            for (let seatId in this.seatMap) {
                let seat = this.seatMap[seatId]
                if (seat.userId == this.user.userId) {
                    // 投注点数增加
                    this.boxPoint = seat.box.getChildByName(`boxPoint`)
                    this.boxPoint.text = this.boxPointCount += 10
                    // 隐藏自己
                    this.owner.visible = false
                    // seat.pointVslider.max = 0
                    // seat.pointVslider.min = 200
                    // seat.pointVslider.value = 20
                    // 显示推杆
                    seat.vsliderPoint.showLabel = false
                    seat.vsliderPoint.visible = true
                    // 显示投注盒子
                    seat.box.visible = true
                    break
                }
            }
        }
        // WebSocket.send({ method: 'BET', user: WebSocket.globalData.user, seatId: this.owner.name, point: 200 })  
    }
    // onClick() {
              
    // }
}