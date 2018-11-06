import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'SIT_DOWN', user: WebSocket.globalData.round.user, seatId: this.owner.name, point: 200 })
        // .then((data) => {
        //     if (data.status == 0) {
        //         // WebSocket.globalData.seats[this.owner.name].seatStatus = 1          // 设置就坐状态
        //         this.owner.skin = `ui/${data.seat.headurl}`                               // 设置就坐图片
        //         if (data.seatNum) {
        //             let num = data.seatNum.slice(4)
        //             // WebSocket.globalData.seats[num].seatStatus = 0                           // 设置离开状态
        //             WebSocket.globalData.seats[num].skin = 'ui/head.png'                     // 设置初始图片
        //         }
        //         // 服务器决定是否开始发牌
        //         WebSocket.globalData.isBegin = data.isBegin
        //     }
        // })
    }
}