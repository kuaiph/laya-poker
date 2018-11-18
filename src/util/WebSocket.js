/**
 * 网络长连接类
 */
export default class WebSocket {
    constructor(startScene) {
        this.startScene = startScene                        // 启动界面        
        WebSocket.socket = new Laya.Socket()                // 实例Socket
        WebSocket.socket.endian = Laya.Byte.LITTLE_ENDIAN   // 采用小端
        // WebSocket.instance = this                           // 单例
        // WebSocket.globalData = { user: {}, round: {} }      // 全局数据对象
    }
    // 与服务端建立长连接
    connect() {
        // ws://192.168.3.224:5000/socket/poker
        WebSocket.socket.connectByUrl('ws://192.168.1.6:5000/socket/poker')
        // WebSocket.socket.connectByUrl('ws://192.168.3.105:5000/socket/poker')
        // WebSocket.socket.connectByUrl('ws://localhost:5000/socket/poker')
    }
    // 初始化连接
    init() {
        this.connect()
        WebSocket.socket.on(Laya.Event.OPEN, this, (e) => {
            this.login()
            console.log('连接建立')
        })
        WebSocket.socket.on(Laya.Event.CLOSE, this, (e) => {
            console.log('连接关闭')
        })
        WebSocket.socket.on(Laya.Event.ERROR, this, (e) => {
            console.error('连接出错')
            setTimeout(() => {
                console.log('尝试重新建立长连接')
                this.connect()
            }, 1000)
        })
        // 封装发送数据方法
        WebSocket.send = (req) => {
            // try {
                return new Promise((resolve, reject) => {
                    // console.log(1)
                    WebSocket.socket.send(JSON.stringify(req))
                    // console.log(2)
                    // 返回数据
                    WebSocket.socket.on(Laya.Event.MESSAGE, this, (res) => {
                        res = JSON.parse(res)
                        if (req.method == res.method) {
                            resolve(res)
                        }
                    })
                })
            // } catch (error) {
            //     console.error(error)
            //     setTimeout(() => {
            //         console.log('尝试重新建立长连接')
            //         this.connect()
            //         // console.log(`重试发送：${data}`)
            //         // WebSocket.send(data)
            //     }, 500)
            // }
        }
        WebSocket.socket.on(Laya.Event.MESSAGE, this, (res) => {
            res = JSON.parse(res)
            let round = WebSocket.globalData ? WebSocket.globalData.round : null
            let user = WebSocket.globalData ? WebSocket.globalData.user : null
            let gameView = WebSocket.globalData ? WebSocket.globalData.gameView : null
            switch (res.method) {
                case 'ROUND_BEGIN':
                    // 根据返回数据更新局信息，然后重置游戏界面
                    if (!WebSocket.globalData) {
                        WebSocket.globalData = { user: res.user, round: res.round }
                        Laya.Scene.open(this.startScene)
                    } else {
                        WebSocket.globalData.round = Object.assign(WebSocket.globalData.round, res.round)
                        gameView.reset()
                    }
                    break;
                case 'SIT_DOWN':
                    if (!res.err) {
                        // 根据返回数据更新座位图，然后显示每个座位
                        for (let seatId in res.seatMap) {
                            round.seatMap[seatId] = Object.assign(round.seatMap[seatId], res.seatMap[seatId])
                            round.seatMap[seatId].sitdown()
                        }
                    }
                    break;
                case 'NEXT_SPEAK':
                    let phase = res.phase
                    round.phasePoint = res.phasePoint
                    round.roundPoint = res.roundPoint
                    let sendPokerArr = res.sendPokerArr
                    let chipSeatIdArr = res.chipSeatIdArr
                    let seatMap = res.seatMap

                    // 根据返回数据判断是否需要发新牌
                    if (sendPokerArr) {
                        round.chipSeatIdArr = chipSeatIdArr
                        // 发手牌
                        if (phase == 0) {
                            gameView.sendPoker(sendPokerArr)
                        }
                        // 3张公牌
                        else if (phase == 1) {
                            gameView.sendPublicPoker(sendPokerArr)
                        }
                        // 4张公牌 
                        else if (phase == 2) {
                            gameView.sendPublicPoker(sendPokerArr)
                        }
                        // 5张公牌
                        else if (phase == 3) {
                            gameView.sendPublicPoker(sendPokerArr)
                        }
                    }
                    // 根据返回数据更新座位图，然后显示操作台
                    for (let seatId in seatMap) {
                        round.seatMap[seatId] = Object.assign(round.seatMap[seatId], seatMap[seatId])
                        // 只有一个座位说话
                        if (round.seatMap[seatId].isSpeak) {
                            // 显示倒计时
                            round.seatMap[seatId].countDown()
                            // 如果是自己显示操作台，否则隐藏
                            if (round.seatMap[seatId].userId == user.userId) {
                                gameView.control.speak(round.seatMap[seatId])
                            } else {
                                gameView.control.silent()
                            }
                        }
                        // 隐藏倒计时
                        else {
                            round.seatMap[seatId].closeCountDown()
                        }
                        // 投注更新
                        if (round.seatMap[seatId].betPoint) {
                            round.seatMap[seatId].bet()
                        } else {
                            round.seatMap[seatId].hideBet()
                        }
                    }
                    // 更新阶段累计点数和底池累计点数
                    gameView.updatePoint()
                    break
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
    // 玩家登录
    login() {
        const queryParams = this.getQueryParams()
        let userId = queryParams.userId || 123456
        let headurl = `person${Math.floor(Math.random() * 5)}.jpg`
        let point = 200
        WebSocket.send({ method: 'ROUND_BEGIN', user: { userId, point, headurl } })
    }
    // 获取URL参数
    getQueryParams() {
        const params = {}
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => { params[key] = value })
        return params
    }
}