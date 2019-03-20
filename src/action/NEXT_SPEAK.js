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
    let pokerType = res.pokerType
    let seatMap = res.seatMap
    let isPhaseEnd = res.isPhaseEnd
    let isRoundEnd = res.isRoundEnd

    round.phasePoint = res.phasePoint
    round.roundPoint = res.roundPoint
    // 根据返回数据判断是否需要发新牌
    if (sendPokerArr) {
        round.chipSeatIdArr = chipSeatIdArr
        // 发手牌
        if (phase == 0) {
            round.isBegin = true
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
        // 座位更新
        round.seatMap[seatId].update(user.userId, pokerType)
        // 非阶段结束，说话的座位显示倒计时
        if (!isPhaseEnd && round.seatMap[seatId].isSpeak) {
            round.seatMap[seatId].countDown()
            // 如果是自己显示操作台，否则隐藏
            if (round.seatMap[seatId].userId == user.userId) {
                gameView.control.speak(round.seatMap[seatId])
            } else {
                gameView.control.silent()
            }
        }
        // 阶段结束执行收集动画
        if (isPhaseEnd == 'collect') {
            setTimeout(() => {
                round.seatMap[seatId].phaseEnd()
            }, 850)
        }
        // 单局结束执行结束动画
        if (isRoundEnd) {
            round.seatMap[seatId].roundEnd()
            setTimeout(() => {
                gameView.reset()
            }, 850)
        }
    }
    // 更新阶段累计点数和底池累计点数
    gameView.updatePoint()
}