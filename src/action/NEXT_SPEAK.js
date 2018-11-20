/**
 * 下一步游戏进程
 * @param {*} globalData
 * @param {*} res 
 */
export default function nextSpeak(globalData, res) {
    let user = globalData.user
    let round = globalData.round
    let gameView = globalData.gameView
    
    let phase = res.phase
    let sendPokerArr = res.sendPokerArr
    let chipSeatIdArr = res.chipSeatIdArr
    let seatMap = res.seatMap

    round.phasePoint = res.phasePoint
    round.roundPoint = res.roundPoint

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
        // 提示更新
        round.seatMap[seatId].showTip()

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
}