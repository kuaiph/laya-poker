import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {
    }
    onClick() {
        WebSocket.send({ method: 'SEAT_DOWN', user: WebSocket.globalData.user, seatId: this.owner.name }).then((data) => {
            if (data.status == 0) {
                // WebSocket.globalData.seats[this.owner.name.slice(4)].seatStatus = 1          // 设置就坐状态
                this.owner.skin = `ui/${data.seatInfo.imgUrl}`                               // 设置就坐图片
                if (data.seatNum) {
                    let num = data.seatNum.slice(4)
                    // WebSocket.globalData.seats[num].seatStatus = 0                           // 设置离开状态
                    WebSocket.globalData.seats[num].skin = 'ui/head.png'                     // 设置初始图片
                }
                // 服务器决定是否开始发牌
                WebSocket.globalData.isSendCard = data.isSendCard
            }
        })

    }
}