import { GameManager } from "../managers/GameManager";
import { globalConstants } from "../utils/globalConsts";
import { UI } from "./UI";
import { Localization } from "../utils/localization";

interface PlayInitData {
    SAVE_NAME: string;
    LOCALIZATION: Localization;
}

export class Play extends Phaser.Scene {
    BUTTON_LAYER = 100
    TILE_SIZE = globalConstants.tileSize
    SAVE_NAME: string
    gameManager: GameManager
    localization: Localization
    constructor() {
        super('playScene');
    }

    init(data: PlayInitData) {
        this.BUTTON_LAYER = 100;
        this.TILE_SIZE = globalConstants.tileSize;

        this.SAVE_NAME = data.SAVE_NAME
        this.localization = data.LOCALIZATION
    }

    create() {
        // Initialize the world and player
        console.log('%cPLAY SCENE :^)', globalConstants.testColor);
        console.log(this.localization.translate("gameplay.play_scene"));
        console.log(`SAVE NAME = ${this.SAVE_NAME}`);

        const uiScene = this.scene.get('uiScene');
        if (uiScene instanceof UI) {
            uiScene.displayPlayUI();
        }

        // Initialize game manager and camera
        this.gameManager = new GameManager(
            this,
            globalConstants.worldDimensions,
            this.TILE_SIZE,
            this.SAVE_NAME
        );
        this.cameras.main.centerOn(
            globalConstants.centerX - this.TILE_SIZE,
            globalConstants.centerY - this.TILE_SIZE * globalConstants.worldPadding - this.TILE_SIZE * 2
        );
    }

    update(time: number, delta: number) {
        this.gameManager.update(time, delta);
    }
}