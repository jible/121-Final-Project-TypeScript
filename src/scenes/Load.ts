import { globalConstants } from "../utils/globalConsts"
import Phaser from "phaser"

export class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        this.load.spritesheet('grass-spritesheet', 'assets/spritesheets/grassSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 0,
        })
        this.load.spritesheet('player', 'assets/spritesheets/playerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 0,
        })
        this.load.spritesheet('marigold', 'assets/spritesheets/flowerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 0,
            endFrame: 2,
        })
        this.load.spritesheet('lily', 'assets/spritesheets/flowerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 3,
            endFrame: 5,
        })
        this.load.spritesheet('sunflower', './assets/spritesheets/flowerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 6,
            endFrame: 8,
        })
        this.load.spritesheet('daisy', './assets/spritesheets/flowerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 9,
            endFrame: 11,
        })
        this.load.spritesheet('tulip', './assets/spritesheets/flowerSpritesheet.png', {
            frameWidth: 8,
            frameHeight: 8, 
            startFrame: 12,
            endFrame: 14,
        })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', globalConstants.testColor)

        this.scene.start('menuScene')

        function getFrames(frameNum: number[], sheetKey:string) {
            return frameNum.map(num => ({ key: sheetKey, frame: num }))
        }

        this.anims.create({
            key: 'player-dance',
            frames: this.anims.generateFrameNames('player', {
                start: 16,
                end: 19,
            }),
            frameRate: 5,
            repeat: -1,
        })

        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNames('player', {
                start: 0,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        })

        const walkFrameNum = [8, 9, 10, 11, 16, 17, 18, 19]

        this.anims.create({
            key: 'player-walk',
            frames: getFrames(walkFrameNum, 'player'),
            frameRate: 10,
            repeat: 0,
        })

        this.anims.create({
            key: 'player-reap',
            frames: this.anims.generateFrameNames('player', {
                start: 32,
                end: 35,
            }),
            frameRate: 10,
            repeat: 0,
        })

        this.anims.create({
            key: 'player-sow',
            frames: this.anims.generateFrameNames('player', {
                start: 24,
                end: 27,
            }),
            frameRate: 10,
            repeat: 0,
        })
    }
}
