/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameView from "./view/GameView"
import Abandon from "./script/Abandon"
import Follow from "./script/Follow"
import Rise from "./script/Rise"
import Seat from "./sprite/Seat"
import SitDialog from "./dialog/SitDialog"
import Users from "./script/Users"
import Settings from "./script/Settings"
import Records from "./script/Records"
import StartView from "./view/StartView"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("view/GameView.js",GameView);
		reg("script/Abandon.js",Abandon);
		reg("script/Follow.js",Follow);
		reg("script/Rise.js",Rise);
		reg("sprite/Seat.js",Seat);
		reg("dialog/SitDialog.js",SitDialog);
		reg("script/Users.js",Users);
		reg("script/Settings.js",Settings);
		reg("script/Records.js",Records);
		reg("view/StartView.js",StartView);
    }
}
GameConfig.width = 750;
GameConfig.height = 1334;
GameConfig.scaleMode ="exactfit";
GameConfig.screenMode = "vertical";
GameConfig.alignV = "middle";
GameConfig.alignH = "center";
GameConfig.startScene = "Game.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
