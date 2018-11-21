import WebSocket from '../util/WebSocket'

export default class Start extends Laya.Script {
    onEnable() {
        // Laya.loader.load("CountDown.part", Laya.Handler.create(this, this.onAssetsLoaded), null, Laya.Loader.JSON);
    }
    onClick() {
        let userId = Math.floor(Math.random() * 1000000)
        let point = 200
        let headurl = `person${Math.floor(Math.random() * 5)}.jpg`
        WebSocket.send({ method: 'ROUND_BEGIN', user: { userId, point, headurl } })
    }

    // onAssetsLoaded(settings) {
    //     let p = new Laya.Particle2D(settings)
    //     // p.emitter.start()
    //     // p.play()
    //     let minX = this.owner.x
    //     let minY = this.owner.y
    //     let maxX = this.owner.x + this.owner.width 
    //     let maxY = this.owner.y + this.owner.height

    //     let lt = [minX,minY]
    //     let lb = [minX,maxY]
    //     let rt = [maxX,minY]
    //     let rb = [maxX,maxY]

    //     // console.log(lt,lb,rt,rb)

    //     p.x = minX
    //     p.y = minY

    //     let c1 = 0
    //     let c2 = 0
    //     let c3 = 0
    //     let c4 = 0
    //     setInterval(()=>{
    //         if(p.x < maxX && p.y == minY){
    //             p.x += 1
    //             c1++
    //         }
    //         if(p.x == maxX && p.y < maxY){
    //             p.y += 1
    //             c2++
    //         }
    //         if(p.x > minX && p.y == maxY){
    //             p.x -= 1
    //             c3++
    //         }
    //         if(p.x == minX && p.y > minY){
    //             p.y -= 1
    //             c4++
    //         }
    //         if(p.x == minX && p.y == minY){
    //             console.log(c1,c2,c3,c4)
    //         }
    //     },10)
    //     Laya.stage.addChild(p)     
    // }
}