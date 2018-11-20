/**
 * 盲注类
 */
export default class Blind {
    constructor(inparam) {
        // UI元素
        this.textChipBig = inparam.textChipBig
        this.textChipSmall = inparam.textChipSmall
        // 数据信息
        this.seatMap = inparam.seatMap
    }

    // 移动
    move(chipSeatIdArr) {
        this.textChipBig.visible = true
        this.textChipSmall.visible = true
        // 大盲顺时针移动
        this.textChipBig.x = this.seatMap[chipSeatIdArr[0]].boxSeat.x + 10
        this.textChipBig.y = this.seatMap[chipSeatIdArr[0]].boxSeat.y - 30
        // this.textChipBig.x = this.imgChipBig.x - 10
        // this.textChipBig.y = this.imgChipBig.y - 15
        // 小盲顺时针移动
        this.textChipSmall.x = this.seatMap[chipSeatIdArr[1]].boxSeat.x + 10
        this.textChipSmall.y = this.seatMap[chipSeatIdArr[1]].boxSeat.y - 30
        // this.textChipSmall.x = this.imgChipSmall.x - 10
        // this.textChipSmall.y = this.imgChipSmall.y - 15
    }

}