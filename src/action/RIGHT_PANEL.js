/**
 * 响应右侧面板显示
 * @param {*} globalData
 * @param {*} res
 */
export default function rightPanel(globalData, res) {
    let listRecord = globalData.gameView.listRecord     // 历史记录列表
    let textPage = globalData.gameView.textPage         // 分页文字
    let listRecordArr = []
    if (!res.err) {
        for (let step of res.listStep) {
            listRecordArr.push({
                m_image0: { skin: `ui/${step.headurl}` },
                m_label0: { text: step.userId },
                m_label1: { text: step.action },
                m_label2: { text: step.point },

                m_image1: { skin: `ui/review/${step.handPokerArr[0].card}.png` },
                m_image2: { skin: `ui/review/${step.handPokerArr[1].card}.png` },

                m_image3: { skin: `ui/review/${step.publicPokerArr[0].card}.png` },
                m_image4: { skin: `ui/review/${step.publicPokerArr[1].card}.png` },
                m_image5: { skin: `ui/review/${step.publicPokerArr[2].card}.png` },
                m_image6: { skin: `ui/review/${step.publicPokerArr[3].card}.png` },
                m_image7: { skin: `ui/review/${step.publicPokerArr[4].card}.png` }
            })
        }
        listRecord.array = listRecordArr
        textPage.text = res.textPage
        globalData.user.pageIndex = res.pageIndex
    }
}