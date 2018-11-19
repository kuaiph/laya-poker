/**
 * 玩家开始一局
 * @param {*} globalData
 * @param {*} res 
 * @param {*} startScene 
 */
export default function roundBegin(globalData, res) {
    let user = globalData.user
    let round = globalData.round
    let gameView = globalData.gameView
    let startScene = globalData.startScene

    if (!user.userId) {
        user = Object.assign(user, res.user)
        round = Object.assign(round, res.round)
        Laya.Scene.open(startScene)
    } else {
        round = Object.assign(round, res.round)
        gameView.reset()
    }
}