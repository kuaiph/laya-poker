/**
 * 网络长连接类
 */
export default class WebSocket {
    constructor() {
        WebSocket.instance = this
        // 长连接服务器
        WebSocket.socket = new Laya.Socket()
        WebSocket.socket.endian = Laya.Byte.LITTLE_ENDIAN//采用小端
    }
    init() {
        // ws://192.168.3.224:4000/socket/poker
        WebSocket.socket.connectByUrl('ws://localhost:5000/socket/poker')
        WebSocket.socket.on(Laya.Event.OPEN, this, (e) => {
            console.log('连接建立')
        })
        WebSocket.socket.on(Laya.Event.CLOSE, this, (e) => {
            console.log('连接关闭')
        })
        WebSocket.socket.on(Laya.Event.ERROR, this, (e) => {
            console.error('连接出错')
        })
        // 封装发送数据方法
        WebSocket.send = (req) => {
            // try {
            return new Promise((resolve, reject) => {
                WebSocket.socket.send(JSON.stringify(req))
                // 返回数据
                WebSocket.socket.on(Laya.Event.MESSAGE, this, (res) => {
                    res = JSON.parse(res)
                    if (req.method == res.method) {
                        resolve(res)
                    }
                })
            })
            // } catch (error) {
            //     setTimeout(() => {
            //         console.log(`重试发送：${data}`)
            //         WebSocket.send(data)
            //     }, 500)
            // }
        }
        WebSocket.socket.on(Laya.Event.MESSAGE, this, (res) => {
            res = JSON.parse(res)
            switch (res.method) {
                // case 'JOIN_TABLE':
                //     if (!res.err) {
                //         for (let seat of res.seatArr) {
                //             WebSocket.globalData.seats[seat.seatId].skin = `ui/${seat.headurl}`  // 设置就坐图片
                //         }
                //     }
                //     break;
                case 'SIT_DOWN':
                    if (!res.err) {
                        WebSocket.globalData.seats[res.seatId.slice(4)].skin = `ui/${res.seat.headurl}` // 设置就坐图片
                        res.oldSeatId ? WebSocket.globalData.seats[res.oldSeatId.slice(4)].skin = 'ui/head.png' : null  // 设置初始图片
                        // 服务器决定是否开始发牌
                        WebSocket.globalData.isBegin = res.isBegin
                    }
                    break;
                case 'CLOSE':
                    if (!res.err) {
                        WebSocket.globalData.seats[res.user.seatId.slice(4)].skin = `ui/head.png`                // 设置就坐图片   
                    }
                    break;
                default:
                    break;
            }
        })
    }
}