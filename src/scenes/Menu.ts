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
    title: any
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

        const loadFileHeight = 6 * globalConstants.tileSize;
        const deleteFileHeight = 8 * globalConstants.tileSize;
        const egnlishSelectHeight = 11 * globalConstants.tileSize;
        const arabicSelectHeight = 14 * globalConstants.tileSize;
        const japaneseSelectHeight = 17 * globalConstants.tileSize;

        //title
        this.title = constructTextButton(this, globalConstants.tileSize * 4, globalConstants.tileSize * 3, 10, this.PADDING, this.localization.translate("menu.title"), () => {});

        for (let i = 1; i <= saveSlotCount; i++){
            const x = i * (globalConstants.tileSize * 3) ;
            constructTextButton( this,x, loadFileHeight , this.TEXT_SIZE, this.PADDING, (i).toString(), ()=>{
                this.loadSave(i)
            })
            constructTextButton( this, x, deleteFileHeight, this.TEXT_SIZE ,this.PADDING, "X", () => {
                this.deleteSave(i)
            })
        }

        constructTextButton(this, globalConstants.tileSize * 6, egnlishSelectHeight, 10, this.PADDING, this.localization.translate("english"), ()=>{
            this.updateLanguage("en");
        }, undefined, 'english')
        constructTextButton(this, globalConstants.tileSize * 6, arabicSelectHeight, 10, this.PADDING, this.localization.translate("arabic"), ()=>{
            this.updateLanguage("abr");
        }, undefined, 'arabic')
        constructTextButton(this, globalConstants.tileSize * 6, japaneseSelectHeight, 10, this.PADDING, this.localization.translate("japanese"), ()=>{
            this.updateLanguage("jp");
        }, undefined, 'japanese')
    }

    updateLanguage(language: string){
        this.localization.switchLanguage(language);
        this.title.content.setText(this.localization.translate("menu.title"));
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
