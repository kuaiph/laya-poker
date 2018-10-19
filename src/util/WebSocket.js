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
    }
}