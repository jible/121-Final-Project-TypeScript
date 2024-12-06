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
            this.constructButton( x, LoadFileHeight , 10, 6,  (i).toString(), ()=>{
                this.loadSave(i)
            })
            this.constructButton( x, deleteFileHeight, 10 ,6,  "X", () => {
                this.deleteSave(i)
            })
        }

        this.constructButton(globalConstants.tileSize * 6, 50, 10, 3, this.localization.translate("english"), ()=>{
            this.localization.switchLanguage("en");
        })
        this.constructButton(globalConstants.tileSize * 6, 65, 10, 3, this.localization.translate("arabic"), ()=>{
            this.localization.switchLanguage("abr");
        })
        this.constructButton(globalConstants.tileSize * 6, 80, 10, 3, this.localization.translate("korean"), ()=>{
            this.localization.switchLanguage("kr");
        })
    }

    deleteSave(fileNum: number){
        const fileName = "Slot:" + fileNum.toString()
        localStorage.removeItem(fileName);
    }

    loadSave(fileNum: number){
        const fileName = "Slot:" + fileNum.toString()
        let file = localStorage.getItem(fileName)
        if ( !file ) {
            localStorage.setItem(fileName, JSON.stringify(globalConstants.defaultSaveData))
        }
        this.scene.start('playScene', {
            SAVE_NAME: fileName,
            LOCALIZATION: this.localization
        })
    }

    constructButton(x: number, y: number, textSize: number, padding: number, text:string = 'default text', result: Function) {
        const content = this.add.text(x + padding / 2, y + padding / 2, text, {
            fontSize: `${textSize - 2}px`,
            lineSpacing: 0,
        })
        content.height = textSize
        const UIBox = this.add.rectangle(
            x,
            y,
            Math.ceil((content.width + padding) / globalConstants.tileSize) * globalConstants.tileSize,
            content.height + padding,
            0xff0000,
        )

        content.setOrigin(0).setZ(100).setDepth(1)
        UIBox.setOrigin(0)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

}

// check that condition is correct, stop program if it isn't
// ex: let test = 0; assert(test == 1); throw error
function assert(condition: boolean, message: string) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`)
    }
}
