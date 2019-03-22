/**
 * 玩家坐下响应
 * @param {*} globalData
 * @param {*} res 
 */
export default function sitDown(globalData, res) {
    let round = globalData.round
    if (!res.err) {
        if (!res.seatMap) {
            globalData.gameView.dialogSit.close()
        } else {
            setTimeout(() => {
                globalData.gameView.dialogSit.close()
                // 显示切换视图提示框
                // let dialogTip = new Laya.Dialog()
                // dialogTip.addChild(new Laya.Image('ui/btn_rise.png'))
                // dialogTip.show()
                // 根据返回数据更新座位图，然后显示每个座位
                for (let seatId in res.seatMap) {
                    round.seatMap[seatId] = Object.assign(round.seatMap[seatId], res.seatMap[seatId])
                    round.seatMap[seatId].sitdown()
                }
            }, 500)
        }
    }
}