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
        
        this.load.spritesheet('reapEffect', './assets/spritesheets/reapSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: -1,
        })
        this.load.spritesheet('upgradeEffect', './assets/spritesheets/upgradeSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: -1,
        })
        this.load.spritesheet('waterEffect', './assets/spritesheets/waterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: -1,
        })
        this.load.spritesheet('sowEffect', './assets/spritesheets/sowSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: -1,
        })

        // load fonts
        this.load.bitmapFont('pixelated', './assets/fonts/pixelated.png', 'assets/fonts/pixelated.xml');
        // ex usage: this.add.bitmapText(100, 100, 'myFont', 'Hello Phaser!', 32);
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
                end: 39,
            }),
            frameRate: 10,
            repeat: 0,
        })

        this.anims.create({
            key: 'player-sow',
            frames: this.anims.generateFrameNames('player', {
                start: 24,
                end: 31,
            }),
            frameRate: 10,
            repeat: 0,
        })

        this.anims.create({
            key: 'reap-effect',
            frames: this.anims.generateFrameNames('reapEffect', {
                start: 24,
                end: 27,
            }),
            frameRate: 20,
            repeat: 0,
        })

        this.anims.create({
            key: 'sow-effect',
            frames: this.anims.generateFrameNames('sowEffect', {
                start: 24,
                end: 27,
            }),
            frameRate: 20,
            repeat: 0,
        })

        this.anims.create({
            key: 'upgrade-effect',
            frames: this.anims.generateFrameNames('upgradeEffect', {
                start: 24,
                end: 27,
            }),
            frameRate: 20,
            repeat: 0,
        })

        this.anims.create({
            key: 'water-spritesheet',
            frames: this.anims.generateFrameNames('waterEffect', {
                start: 0,
                end: -1,
            }),
            frameRate: 20,
            repeat: 0,
        })
    }
}
