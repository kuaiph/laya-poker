import GameConfig from "./GameConfig"

class LayaApp {
    constructor() {
        // // 初始化引擎
        // const WebGL = laya.webgl.WebGL
        // Laya.init(370, 658, WebGL)
        // //设置版本控制类型为使用文件名映射的方式
        // Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION
        // //加载版本信息文件
        // Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.beginLoad))

        //根据IDE设置初始化引擎
        if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
        else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        // 设置stage属性
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOSCALE
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO
        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOBORDER
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER
        Laya.stage.alignW = Laya.Stage.ALIGN_CENTER
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE
        // Laya.stage.bgColor = "#ffffff"
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
        if (GameConfig.stat) Laya.Stat.show();
        Laya.alertGlobalError = true;

        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    onVersionLoaded() {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    }
    onConfigLoaded() {
        //加载IDE指定的场景
        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        // beginLoad()
    }
    // // 加载资源
    // beginLoad() {
    //     // 加载图集
    //     Laya.loader.load("res/atlas/ui.atlas", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS)
    //     // 长连接服务器
    //     LayaApp.socket = new Laya.Socket()
    //     LayaApp.socket.endian = Laya.Byte.LITTLE_ENDIAN//采用小端
    //     LayaApp.socket.connectByUrl('ws://localhost:5000/socket/poker')
    //     LayaApp.socket.on(Laya.Event.OPEN, this, (e) => {
    //         console.log('连接建立')
    //     })
    //     LayaApp.socket.on(Laya.Event.MESSAGE, this, (msg) => {
    //         console.log(`数据接收 ${msg}`)
    //     })
    //     LayaApp.socket.on(Laya.Event.CLOSE, this, (e) => {
    //         console.log('连接关闭')
    //     })
    //     LayaApp.socket.on(Laya.Event.ERROR, this, (e) => {
    //         console.error('连接出错')
    //     })
    //     // 播放背景音乐
    //     // Laya.SoundManager.playMusic("res/sounds/bgm.mp3", 0, null)
    // }
    // // 加载完成回调
    // onLoaded() {
    //     // 启动游戏界面
    //     LayaApp.gameView = new GameView()
    //     Laya.stage.addChild(LayaApp.gameView)
    //     // LayaApp.gameStartView = new GameStartView()
    //     // Laya.stage.addChild(LayaApp.gameStartView)
    // }
}

// 实例化游戏应用
new LayaApp()

