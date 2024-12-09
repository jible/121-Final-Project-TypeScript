//#region --------------------------------------- IMPORTS

import { worldPresets } from '../utils/ParseDSL'
import { GameManager } from './GameManager'

//#endregion

// When a plant is created, reaped, or had its growth level increased, it needs to be represented in this.totalPlants
export class WinConManager {
    // If three or more plants are level three growth or above, the game is won.
    static WINNING_PLANT_COUNT = worldPresets.winningPlantNum
    static WINNING_GROWTH_LEVEL = worldPresets.winningPlantGrowth
    GAME_MANAGER: GameManager
    constructor(gameManager: GameManager) {
        this.GAME_MANAGER = gameManager
    }

    // Returns true or false based on whether the game has been completed or not.
    checkWinCondition() {
        const ripePlants = Array.from(
            this.GAME_MANAGER.plantManager.plantCollection.values(),
        ).filter(plant => plant.growthLevel >= WinConManager.WINNING_GROWTH_LEVEL)
        console.log(ripePlants.length)
        return ripePlants.length >= WinConManager.WINNING_PLANT_COUNT
    }
    setWinGrowthLevel(growthLevel: number) {
        WinConManager.WINNING_GROWTH_LEVEL = growthLevel
    }
    setWinPlantCount(plantCount: number) {
        WinConManager.WINNING_PLANT_COUNT = plantCount
    }
}
