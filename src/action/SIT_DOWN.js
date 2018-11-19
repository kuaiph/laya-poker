/**
 * 玩家坐下响应
 * @param {*} globalData
 * @param {*} res 
 */
export default function sitDown(globalData, res) {
    let round = globalData.round
    if (!res.err) {
        // 根据返回数据更新座位图，然后显示每个座位
        for (let seatId in res.seatMap) {
            round.seatMap[seatId] = Object.assign(round.seatMap[seatId], res.seatMap[seatId])
            round.seatMap[seatId].sitdown()
        }
    }
}