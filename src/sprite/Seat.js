export default class Start extends Laya.Script{
    onEnable(){
    }
    onClick(){
        // console.log(this)
        console.log(this.owner.name)
        this.owner.skin = 'ui/person.png'
    }
}