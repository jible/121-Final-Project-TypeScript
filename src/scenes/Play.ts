import { globalConstants } from "../utils/globalConsts"



export class Play extends Phaser.Scene {
    BUTTON_LAYER = 100
    TILE_SIZE = globalConstants.tileSize
    SAVE_NAME: String
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

        this.scene.get('uiScene').displayPlayUI()

        // Add grid and player to the scene
        this.gameManager = new GameManager(this, worldDimensions, this.TILE_SIZE, this.SAVE_NAME)
        this.cameras.main.centerOn(
            centerX - this.TILE_SIZE,
            centerY - this.TILE_SIZE * worldPadding - this.TILE_SIZE * 2,
        )
    }

    update(time, delta) {
        this.gameManager.update(time, delta)
    }

    constructButton(x, y, textSize, padding, text = 'default text', result) {
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

    save() {
        let saveNames = localStorage.getItem('saveNames').split('/')
        let saveFiles = localStorage.getItem('saveFiles').split('/')
        if (saveNames.find(element => element == this.SAVE_NAME)) {
            const key = saveNames.find(element => element == this.SAVE_NAME)
            const index = saveNames.indexOf(key)

            if (index > -1) {
                const newData = this.gameManager.exportGame()
                saveFiles[index] = newData
                localStorage.setItem('saveFiles', saveFiles.join('/'))
            }
        } else {
            console.log('there is no save file under that name')
            console.log(saveNames)
        }
    }

    undo() {
        // MUST follow D2 example
    }

    redo() {
        // MUST follow D2 example
    }
}
