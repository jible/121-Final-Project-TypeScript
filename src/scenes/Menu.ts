import { constructTextButton } from "../utils/buttonMaker";
import { globalConstants } from "../utils/globalConsts";

export class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }
    create() {
        // running checks
        console.log('%cMENU SCENE :^)', globalConstants.testColor)

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
    }


    deleteSave(fileNum: number){
        const fileName = "Slot:" + fileNum.toString()
        localStorage.removeItem(fileName);
    }

    loadSave(fileNum: number){
        const fileName = "Slot:" + fileNum.toString()
        const file = localStorage.getItem(fileName)
        if ( !file ) {
            localStorage.setItem(fileName, JSON.stringify(globalConstants.defaultSaveData))
        }
        this.scene.start('playScene', {
            SAVE_NAME: fileName
        })
    }

}
