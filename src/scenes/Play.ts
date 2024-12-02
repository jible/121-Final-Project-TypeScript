import { GameManager } from "../managers/GameManager"
import { globalConstants } from "../utils/globalConsts"
import { UI } from "./UI"


export class Play extends Phaser.Scene {
    BUTTON_LAYER = 100
    TILE_SIZE = globalConstants.tileSize
    SAVE_NAME: string
    gameManager: GameManager
    constructor() {
        super('playScene')
    }

    init(data: any) {
        this.BUTTON_LAYER = 100
        this.TILE_SIZE = globalConstants.tileSize

        this.SAVE_NAME = data.SAVE_NAME
    }

    create() {
        // Initialize the world and player
        console.log('%cPLAY SCENE :^)', globalConstants.testColor)
        console.log(`SAVE NAME = ${this.SAVE_NAME}`)

        const uiScene = this.scene.get('uiScene')
        uiScene instanceof UI && uiScene.displayPlayUI()

        // Add grid and player to the scene
        this.gameManager = new GameManager(this, globalConstants.worldDimensions, this.TILE_SIZE, this.SAVE_NAME)
        this.cameras.main.centerOn(
            globalConstants.centerX - this.TILE_SIZE,
            globalConstants.centerY - this.TILE_SIZE * globalConstants.worldPadding - this.TILE_SIZE * 2,
        )
    }

    update(time: number, delta:number) {
        this.gameManager.update(time, delta)
    }

    constructButton(x:number, y:number, textSize:number, padding:number, text:string = 'default text', result:Function) {
        const content = this.add.text(x + padding / 2, y + padding / 2, text, {
            fontSize: `${textSize - 2}px`,
            lineSpacing: 0,
        })
        content.height = textSize
        const UIBox = this.add.rectangle(
            x,
            y,
            Math.ceil((content.width + padding) / this.TILE_SIZE) * this.TILE_SIZE,
            content.height + padding,
            0xff0000,
        )

        content
            .setOrigin(0)
            .setZ(this.BUTTON_LAYER + 1)
            .setDepth(this.BUTTON_LAYER + 1)
        UIBox.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }
}
