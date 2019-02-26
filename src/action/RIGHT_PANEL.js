/**
 * 响应右侧面板显示
 * @param {*} globalData
 * @param {*} res
 */
export default function rightPanel(globalData, res) {
    let listRecord = globalData.gameView.listRecord     // 历史记录列表
    let listRecordArr = []
    if (!res.err) {
        for (let step of res.listStep) {
            listRecordArr.push({
                m_image0: { skin: step.headurl },
                m_label0: { text: step.userId },
                m_label1: { text: step.action },
                m_label2: { text: step.point },

                // m_image1: { skin: step.handPokerArr[0] },
                // m_image2: { skin: step.handPokerArr[1] },

                // m_image3: { skin: step.publicPokerArr[0] },
                // m_image4: { skin: step.publicPokerArr[1] },
                // m_image5: { skin: step.publicPokerArr[2] },
                // m_image6: { skin: step.publicPokerArr[3] },
                // m_image7: { skin: step.publicPokerArr[4] }
            })
        }
        listRecord.array = listRecordArr
    }
}