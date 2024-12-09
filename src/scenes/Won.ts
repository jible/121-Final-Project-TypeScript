//#region --------------------------------------- IMPORTS

// UTILITIES
import { globalConstants } from "../utils/GlobalConsts";
import { Localization } from "../utils/Localization";
import { constructTextButton } from "../utils/ButtonMaker";

// ELSE
import en from "../locales/en.json" assert {type: 'json'};
import Phaser from "phaser";

//#endregion

interface PlayInitData {
    LOCALIZATION: Localization;
}

export class Won extends Phaser.Scene{
    localization: Localization
    reset: Phaser.GameObjects.BitmapText
    PADDING: number = 6

    constructor() {
        super('wonScene');
    }

    init(data: PlayInitData) {
        this.localization = data.LOCALIZATION
    }

    create() {
        console.log('%cWON SCENE :^)', globalConstants.testColor);

        console.log(this.localization.getLanguage())
        this.reset = constructTextButton(this, globalConstants.tileSize * 4, globalConstants.tileSize * 3, 10, this.PADDING, this.localization.translate("reset"), () => location.reload(), undefined, this.localization.getLanguage()).content;
    }
}