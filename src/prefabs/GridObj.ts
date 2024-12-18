//#region --------------------------------------- IMPORTS

// UTILITIES
import { Vector } from "../utils/Vector"
import { globalConstants } from "../utils/GlobalConsts";

// MANAGERS
import { GameManager } from "../managers/GameManager"

// ELSE
import { World } from "./World"

import Phaser from "phaser"

//#endregion

export class GridObj extends Phaser.GameObjects.Sprite {
    gameManager:GameManager
    world:World
    position:Vector
    tileSize:number
    
    constructor(gameManager: GameManager, position: Vector, texture: string) {
        const trueX = position.x * gameManager.tileSize
        const trueY = position.y * gameManager.tileSize
        super(gameManager.scene, trueX, trueY, texture)

        this.gameManager = gameManager
        this.world = gameManager.world
        this.scene = gameManager.scene
        this.position = position.copy()
        this.scene.add.existing(this)
        this.setOrigin(0)
        this.tileSize = globalConstants.tileSize
    }

    // Moves object to tile target (player)
    teleport(target: Vector) {
        if (!this.world.checkEnterable(target)) {
            return false
        }
        this.position = target
        this.x = this.position.x * this.tileSize
        this.y = this.position.y * this.tileSize
        return true
    }
}