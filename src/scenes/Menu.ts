import { constructTextButton } from "../utils/buttonMaker";
import { globalConstants } from "../utils/globalConsts";
import { Localization } from "../utils/localization";
import en from "../locales/en.json" assert {type: 'json'};

export class Menu extends Phaser.Scene {
    localization: Localization;
    constructor() {
        super('menuScene')
    }
    create() {
        // running checks
        console.log('%cMENU SCENE :^)', globalConstants.testColor)
        // localization -- language switcher
        this.localization = new Localization(en);

        const saveSlotCount = 3;

        const LoadFileHeight = 2 * globalConstants.tileSize;
        const deleteFileHeight = 4 * globalConstants.tileSize;
        for (let i = 1; i <= saveSlotCount; i++){
            const x = i * (globalConstants.tileSize * 3) ;
            constructTextButton( this,x, LoadFileHeight , 10, 6,  (i).toString(), ()=>{
                this.loadSave(i)
            })
            constructTextButton( this, x, deleteFileHeight, 10 ,6,  "X", () => {
                this.deleteSave(i)
            })
        }

        constructTextButton(this, globalConstants.tileSize * 6, 50, 10, 3, this.localization.translate("english"), ()=>{
            this.localization.switchLanguage("en");
        })
        constructTextButton(this, globalConstants.tileSize * 6, 65, 10, 3, this.localization.translate("arabic"), ()=>{
            this.localization.switchLanguage("abr");
        })
        constructTextButton(this, globalConstants.tileSize * 6, 80, 10, 3, this.localization.translate("korean"), ()=>{
            this.localization.switchLanguage("kr");
        })
    }

    deleteSave(fileNum: number){
        const fileName = `${this.localization.translate("saveGame")}: ` + fileNum.toString()
        localStorage.removeItem(fileName);
    }

    loadSave(fileNum: number){
        const fileName = `${this.localization.translate("saveGame")}: ` + fileNum.toString()
        const file = localStorage.getItem(fileName)
        if ( !file ) {
            localStorage.setItem(fileName, JSON.stringify(globalConstants.defaultSaveData))
        }
        this.scene.start('playScene', {
            SAVE_NAME: fileName,
            LOCALIZATION: this.localization
        })
    }

}
