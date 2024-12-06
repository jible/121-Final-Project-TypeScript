//#region --------------------------------------- IMPORTS

import { globalConstants } from "../utils/GlobalConsts"
import Phaser from "phaser"

//#endregion

export class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // Load spritesheet helper function
        const loadSpritesheet = (
            key: string,
            path: string,
            frameWidth: number,
            frameHeight: number,
            startFrame: number = 0,
            endFrame: number = -1
        ): void => {
            this.load.spritesheet(key, path, {
                frameWidth,
                frameHeight,
                startFrame,
                endFrame,
            })
        }

        // Preload spritesheets for various assets
        loadSpritesheet('grass-spritesheet', 'assets/spritesheets/grassSpritesheet.png', 8, 8)
        loadSpritesheet('player', 'assets/spritesheets/playerSpritesheet.png', 8, 8)
        loadSpritesheet('marigold', 'assets/spritesheets/flowerSpritesheet.png', 8, 8, 0, 2)
        loadSpritesheet('lily', 'assets/spritesheets/flowerSpritesheet.png', 8, 8, 3, 5)
        loadSpritesheet('sunflower', 'assets/spritesheets/flowerSpritesheet.png', 8, 8, 6, 8)
        loadSpritesheet('daisy', 'assets/spritesheets/flowerSpritesheet.png', 8, 8, 9, 11)
        loadSpritesheet('tulip', 'assets/spritesheets/flowerSpritesheet.png', 8, 8, 12, 14)

        loadSpritesheet('reapEffect', './assets/spritesheets/reapSpritesheet.png', 16, 16)
        loadSpritesheet('upgradeEffect', './assets/spritesheets/upgradeSpritesheet.png', 16, 16)
        loadSpritesheet('waterEffect', './assets/spritesheets/waterSpritesheet.png', 16, 16)
        loadSpritesheet('sowEffect', './assets/spritesheets/sowSpritesheet.png', 16, 16)

        // load fonts
        this.load.bitmapFont('pixelated', './assets/fonts/pixelated.png', 'assets/fonts/pixelated.xml')
        // ex usage: this.add.bitmapText(100, 100, 'myFont', 'Hello Phaser!')
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', globalConstants.testColor)

        // Create animation helper function
        const createAnimation = (
            key: string,
            spriteKey: string,
            startFrame: number,
            endFrame: number,
            frameRate: number,
            repeat: number
        ): void => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNames(spriteKey, { start: startFrame, end: endFrame }),
                frameRate,
                repeat,
            });
        };

        // Define and create animations
        createAnimation('player-idle', 'player', 0, 3, 5, -1)
        createAnimation('player-walk', 'player', 8, 11, 10, 0)
        createAnimation('player-dance', 'player', 16, 19, 5, -1)
        createAnimation('player-reap', 'player', 32, 39, 10, 0)
        createAnimation('player-sow', 'player', 32, 39, 10, 0)
        createAnimation('reap-effect', 'reapEffect', 0, 20, 20, 0)
        createAnimation('sow-effect', 'sowEffect', 0, 5, 20, 0)
        createAnimation('upgrade-effect', 'upgradeEffect', 0, 8, 20, 0)
        createAnimation('water-spritesheet', 'waterEffect', 0, 13, 20, 0)

        this.scene.start('menuScene')
    }
}
