//#region --------------------------------------- IMPORTS

import { constructTextButton } from "../utils/ButtonMaker";
import { globalConstants } from "../utils/GlobalConsts";
import { Localization } from "../utils/Localization";

import en from "../locales/en.json" assert {type: 'json'};

//#endregion

// The `Menu` scene allows users to:
// Load or delete from save slots and switch the game language.
export class Menu extends Phaser.Scene {
    localization: Localization
    TEXT_SIZE: number = 10
    PADDING: number = 6

    constructor() {
        super('menuScene')
    }

    create() {
        // running checks
        console.log('%cMENU SCENE :^)', globalConstants.testColor)

        this.localization = new Localization(en);

        const saveSlotCount = 3;

        const loadFileHeight = 2 * globalConstants.tileSize;
        const deleteFileHeight = 4 * globalConstants.tileSize;

        for (let i = 1; i <= saveSlotCount; i++){
            const x = i * (globalConstants.tileSize * 3) ;
            constructTextButton( this,x, loadFileHeight , this.TEXT_SIZE, this.PADDING,  (i).toString(), ()=>{
                this.loadSave(i)
            })
            constructTextButton( this, x, deleteFileHeight, this.TEXT_SIZE ,this.PADDING,  "X", () => {
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

    //#region------------------------------------ SAVE FILE FUNCTIONS

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

    //#endregion
}
