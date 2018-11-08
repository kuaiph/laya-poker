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
        // ws://192.168.3.224:5000/socket/poker
        // WebSocket.socket.connectByUrl('ws://192.168.3.105:5000/socket/poker')
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
            let round = WebSocket.globalData ? WebSocket.globalData.round : false
            switch (res.method) {
                // case 'JOIN_TABLE':
                //     break;
                case 'ROUND_BEGIN':
                    if (!res.err && WebSocket.globalData) {
                        WebSocket.globalData.round = res.round
                        WebSocket.globalData.gameView.reset()
                    }
                    break;
                case 'SIT_DOWN':
                    if (!res.err) {
                        // 根据返回座位图数据显示
                        for (let key in res.seatMap) {
                            round.seatMap[key] = Object.assign(round.seatMap[key], res.seatMap[key])
                            round.seatMap[key].seatImg.skin = `ui/${round.seatMap[key].headurl}`
                        }
                        // 服务器决定是否开始发牌
                        round.isBegin = res.isBegin
                    }
                    break;
                case 'CLOSE':
                    if (!res.err) {
                        // 根据返回座位图显示
                        // for (let key in res.seatMap) {
                        //     round.seatMap[key] = Object.assign(round.seatMap[key], res.seatMap[key])
                        //     round.seatMap[key].seatImg.skin = `ui/${round.seatMap[key].headurl}`
                        // }
                    }
                    break;
                default:
                    break;
            }
        })
    }
}