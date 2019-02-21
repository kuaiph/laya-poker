/**
 * 响应左侧面板显示
 * @param {*} globalData
 * @param {*} res
 */
export default function leftPanel(globalData, res) {
    let listUser = globalData.gameView.listUser         // 历史入局玩家列表
    let listWatcher = globalData.gameView.listWatcher   // 历史观战玩家列表
    console.log(res.listWatcher)
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
        listUser.vScrollBarSkin = ""
        listWatcher.vScrollBarSkin = ""
        listUser.array = listUserArr
        listWatcher.array = listWatcherArr
    }
}