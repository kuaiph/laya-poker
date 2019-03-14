/**
 * 玩家入局
 * @param {*} globalData
 * @param {*} res 
 * @param {*} startScene 
 */
export default function roundIn(globalData, res) {
    let startScene = globalData.startScene
    let user = globalData.user
    let round = globalData.round
    let room = globalData.room
    let gameView = globalData.gameView
    // 首次打开界面
    if (!user.userId) {
        user = Object.assign(user, res.user)
        round = Object.assign(round, res.round)
        room = Object.assign(room, res.room)
        round.seatMap = res.seatMap
        Laya.Scene.open(startScene)
    }
    // 被动更新界面
    else {
        Object.assign(round, res.round)
        // 局信息中的座位图属性，需要把每个座位展开赋值
        for (let seatId in res.seatMap) {
            round.seatMap[seatId] = Object.assign(round.seatMap[seatId], res.seatMap[seatId])
        }
        // 界面重置
        gameView.reset()
    }
}