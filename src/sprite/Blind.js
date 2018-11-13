/**
 * 盲注类
 */
export default class Blind {
    constructor(inparam) {
        // UI元素
        this.imgChipBig = inparam.imgChipBig
        this.imgChipSmall = inparam.imgChipSmall
        this.textChipBig = inparam.textChipBig
        this.textChipSmall = inparam.textChipSmall
        // 数据信息
        this.seatMap = inparam.seatMap
    }

    // 移动
    move(chipSeatIdArr) {
        this.imgChipBig.visible = true
        this.textChipBig.visible = true
        this.imgChipSmall.visible = true
        this.textChipSmall.visible = true
        // 大盲顺时针移动
        this.imgChipBig.x = this.seatMap[chipSeatIdArr[0]].imgSeat.x + 10
        this.imgChipBig.y = this.seatMap[chipSeatIdArr[0]].imgSeat.y - 30
        this.textChipBig.x = this.imgChipBig.x - 10
        this.textChipBig.y = this.imgChipBig.y - 15
        // 小盲顺时针移动
        this.imgChipSmall.x = this.seatMap[chipSeatIdArr[1]].imgSeat.x + 10
        this.imgChipSmall.y = this.seatMap[chipSeatIdArr[1]].imgSeat.y - 30
        this.textChipSmall.x = this.imgChipSmall.x - 10
        this.textChipSmall.y = this.imgChipSmall.y - 15
    }

}