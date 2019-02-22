/**
 * 响应左侧面板显示
 * @param {*} globalData
 * @param {*} res
 */
export default function leftPanel(globalData, res) {
    let listUser = globalData.gameView.listUser                                   // 历史入局玩家列表
    let listWatcher = globalData.gameView.listWatcher                             // 历史观战玩家列表
    let textRoomId = globalData.gameView.textRoomId                               // 房间ID
    let textRoomName = globalData.gameView.textRoomName                           // 房间名称
    intervalRoomCountDown(globalData.room, globalData.gameView.textRoomCountDown) // 开启倒计时

    if (!res.err) {
        let listUserArr = []
        let listWatcherArr = []
        for (let user of res.listUser) {
            listUserArr.push({
                m_label0: { text: user.userId },
                m_label1: { text: user.seatPoint },
                m_label2: { text: user.point }
            })
        }
        for (let userArr of res.listWatcher) {
            listWatcherArr.push({
                m_label0: { text: userArr[0].userId },
                m_label1: { text: userArr[1].userId },
                m_label2: { text: userArr[2].userId },
                m_img0: { skin: userArr[0].headurl },
                m_img1: { skin: userArr[1].headurl },
                m_img2: { skin: userArr[2].headurl },
            })
        }
        textRoomId.text = `#${globalData.room.roomId}`
        textRoomName.text = globalData.room.roomName
        listUser.vScrollBarSkin = ""
        listWatcher.vScrollBarSkin = ""
        listUser.array = listUserArr
        listWatcher.array = listWatcherArr
    }
}

// 房间倒计时一次
function roomCountDown(room, textRoomCountDown) {
    let endTime = room.endTime                         // 结束秒数
    let currTime = Math.floor((Date.now() / 1000))     // 当前秒数
    let diffTime = endTime - currTime                  // 秒数差值
    let h = Math.floor(diffTime / 3600)
    let m = Math.floor((diffTime / 60 % 60))
    let s = Math.floor((diffTime % 60))
    // 获取单局剩余时间
    textRoomCountDown.text = `0${h}:${m}:${s}`
    // 倒计时结束
    if (diffTime <= 0) {
        textRoomCountDown.text = '00:00:00'
        clearInterval(room.intervalRoomCountDown)
    }
}
// 房间倒计时开启
function intervalRoomCountDown(room, textRoomCountDown) {
    if (!room.intervalRoomCountDown) {
        roomCountDown(room, textRoomCountDown)
        room.intervalRoomCountDown = setInterval(() => {
            roomCountDown(room, textRoomCountDown)
        }, 1000)
    }
}