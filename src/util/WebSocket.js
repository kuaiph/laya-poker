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
                //     break;
                case 'ROUND_BEGIN':
                    if (!res.err && WebSocket.globalData) {
                        WebSocket.globalData.round = res.round
                        WebSocket.globalData.gameView.reset()           //新一局开始游戏  
                    }
                    break;
                case 'SIT_DOWN':
                    if (!res.err) {
                        // 旧座位设置初始图片
                        let oldSeatData = WebSocket.globalData.round.seatMap[res.oldSeatId]
                        if (oldSeatData) {
                            oldSeatData.userId = 0
                            oldSeatData.point = 0
                            oldSeatData.headurl = 'head.png'
                            oldSeatData.seatImg.skin = 'ui/head.png'
                            oldSeatData.pointText.visible = false       // 隐藏老的金额
                        }
                        // 新座位设置就坐图片
                        let seatData = WebSocket.globalData.round.seatMap[res.seat.seatId]
                        seatData.seatImg.skin = `ui/${res.seat.headurl}`
                        seatData.pointText.text = res.seat.point        // 设置新座位金额
                        seatData.pointText.visible = true               // 显示新座位金额
                        Object.assign(seatData, res.seat)
                        // 服务器决定是否开始发牌
                        WebSocket.globalData.round.isBegin = res.isBegin
                    }
                    break;
                case 'CLOSE':
                    if (!res.err) {
                        WebSocket.globalData.round.seatMap[res.user.seatId].skin = `ui/head.png`
                    }
                    break;
                default:
                    break;
            }
        })
    }
}