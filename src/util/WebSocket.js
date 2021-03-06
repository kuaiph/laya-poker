import util from './util.js'
import roundIn from '../action/ROUND_IN.js'
import sitDown from '../action/SIT_DOWN.js'
import nextSpeak from '../action/NEXT_SPEAK.js'
import close from '../action/CLOSE.js'
import leftPanel from '../action/LEFT_PANEL.js'
import rightPanel from '../action/RIGHT_PANEL.js'
/**
 * 网络长连接类
 * globalData:{startScene,gameView,user,round}
 */
export default class WebSocket {
    constructor(startScene) {
        // WebSocket.instance = this                                              // 单例
        WebSocket.socket = new Laya.Socket()                                      // 实例Socket
        WebSocket.socket.endian = Laya.Byte.LITTLE_ENDIAN                         // 采用小端
        WebSocket.globalData = { user: {}, room: {}, round: {}, startScene }      // 全局数据对象
    }
    // 与服务端建立长连接
    connect() {
        // ws://192.168.3.224:5000/socket/poker
        // WebSocket.socket.connectByUrl('ws://192.168.1.6:5000/socket/poker')
        // WebSocket.socket.connectByUrl('ws://192.168.3.162:5000/socket/poker')
        WebSocket.socket.connectByUrl('ws://localhost:5000/socket/poker')
    }
    // 玩家登录
    login() {
        WebSocket.send({
            method: 'ROUND_IN', user: { userId: util.getQueryParams().userId || 123456, headurl: `person${Math.floor(Math.random() * 5)}.jpg`, point: 200 }
        })
    }
    // 网络初始化
    init() {
        this.connect()
        this.actionMap = {
            'ROUND_IN': roundIn,
            'SIT_DOWN': sitDown,
            'NEXT_SPEAK': nextSpeak,
            'CLOSE': close,
            'LEFT_PANEL': leftPanel,
            'RIGHT_PANEL': rightPanel
        }
        WebSocket.socket.on(Laya.Event.OPEN, this, (e) => {
            this.login()
            console.warn('连接建立')
        })
        WebSocket.socket.on(Laya.Event.CLOSE, this, (e) => {
            console.warn('连接关闭')
            // TODO 跳转登录界面
        })
        WebSocket.socket.on(Laya.Event.ERROR, this, (e) => {
            console.error('连接出错')
            setTimeout(() => {
                console.error('间隔1s尝试重新建立长连接')
                this.connect()
            }, 1000)
        })
        // 数据响应自动映射ACTION
        WebSocket.socket.on(Laya.Event.MESSAGE, this, (res) => {
            res = JSON.parse(res)
            // console.log(res.seatMap)
            this.actionMap[res.method](WebSocket.globalData, res)
        })
        // 封装发送数据方法
        WebSocket.send = (req) => {
            req.user = req.user || WebSocket.globalData.user
            WebSocket.socket.send(JSON.stringify(req))
        }
    }
}