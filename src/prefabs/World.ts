//#region --------------------------------------- IMPORTS

// UTILITIES
import { Vector } from '../utils/Vector'
import { bitWiseHelper } from '../utils/BitHelpers'
import { Clock } from '../utils/Clock'
import { worldPresets } from '../utils/ParseDSL'

// ELSE
import { GameManager } from '../managers/GameManager'
import { Plant } from '../prefabs/Plants'

//#endregion

//#region --------------------------------------- TILE

export class Tile {
    gameManager: GameManager
    plant: Plant | null
    waterLvl: number
    sunLvl: number

    constructor(gameManager: GameManager, plant: Plant | null = null, waterLvl = 0, sunLvl = 0) {
        this.gameManager = gameManager
        this.plant = plant
        this.waterLvl = waterLvl
        this.sunLvl = sunLvl
    }

    // Encode the current state into a bitfield
    saveTile(): number {
        const species = this.plant ? this.plant.species : 0
        const growthLevel = this.plant ? this.plant.growthLevel : 0

        return this.encodeTileData(this.sunLvl, this.waterLvl, species, growthLevel)
    }

    // Restore state from a bitfield
    loadTile(memento: number, position: Vector): void {
        this.cleanTile()
        const decoded = this.decodeTileData(memento)
        this.sunLvl = decoded[bitWiseHelper.bitDetailsIndex.LIGHT_LEVEL]
        this.waterLvl = decoded[bitWiseHelper.bitDetailsIndex.WATER_LEVEL]

        // Map back to your plant system if necessary
        if (decoded[bitWiseHelper.bitDetailsIndex.SPECIES] > 0) {
            this.plant = this.gameManager.plantManager.addPlant(
                position,
                decoded[bitWiseHelper.bitDetailsIndex.SPECIES],
                decoded[bitWiseHelper.bitDetailsIndex.GROWTH_LEVEL],
            )
        }
    }

    // Clears the tile by removing any plants and resetting water and light levels to 0.
    cleanTile(): void {
        this.plant?.destroy()
        this.plant = null
        this.sunLvl = 0
        this.waterLvl = 0
    }

    // Encodes tile data (light, water, species, growth level) into a single bitfield.
    encodeTileData(
        lightLevel: number,
        waterLevel: number,
        species: number,
        growthLevel: number,
    ): number {
        let data = 0
        const tileData = [lightLevel, waterLevel, species, growthLevel]

        for (let i = 0; i < tileData.length; i++) {
            data |=
                (tileData[i] & bitWiseHelper.bitLayout[i].mask) << bitWiseHelper.bitLayout[i].shift
        }

        return data
    }

    // Decodes a bitfield into tile data (light, water, species, growth level).
    decodeTileData(data: number): number[] {
        const decoded = []
        for (let i = 0; i < bitWiseHelper.bitLayout.length; i++) {
            decoded.push(
                (data >> bitWiseHelper.bitLayout[i].shift) & bitWiseHelper.bitLayout[i].mask,
            )
        }
        return decoded
    }
}

//#endregion

//#region --------------------------------------- WORLD

export interface GridSize {
    height: number
    width: number
}

export class World {
    scene: Phaser.Scene
    gameManager: GameManager
    height: number
    width: number
    tileSize: number
    gridSize: GridSize
    grid: Tile[][]

    constructor(gameManager: GameManager, gridSize: GridSize, tileSize: number) {
        this.scene = gameManager.scene
        this.gameManager = gameManager
        // Dimension
        this.height = gridSize.height
        this.width = gridSize.width
        this.tileSize = tileSize
        this.gridSize = gridSize
        // Grid initialization
        this.grid = []

        // Render blank state, with a different (looking) tile at each grid
        for (let x = 0; x < this.gridSize.width; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.height; y++) {
                this.grid[x][y] = new Tile(this.gameManager)

                const index = this.#getRandomIndex()
                this.#renderTile(x, y, index)
            }
        }

        // Generate random weather immediately
        this.generateRandomWeather()
    }

    //#region ----------------------------------- WORLD INSTANCE AND STATE FUNCTIONS

    // Exports the world's current state as a byte array.
    exportWorldInstance(): Uint16Array {
        const bytesForTime = 2
        const bytesForPos = 1
        const requiredbytes = this.width * this.height + bytesForTime + bytesForPos

        const byteAr = new Uint16Array(requiredbytes)
        let visitedTiles = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                byteAr[visitedTiles] = this.grid[i][j].saveTile()
                visitedTiles++
            }
        }

        const playerPos = this.gameManager.player.position
        const currentTime = this.gameManager.time

        const posBytes = (playerPos.x << 8) | playerPos.y
        const timeBytes = (currentTime.hour << 8) | currentTime.day

        byteAr[visitedTiles + 1] = posBytes
        byteAr[visitedTiles + 2] = timeBytes
        return byteAr
    }

    // Restores the world's state from a byte array.
    loadWorldInstance(data: Uint16Array): void {
        this.gameManager.plantManager.plantCollection.clear()
        let visitedTiles = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.grid[i][j].loadTile(data[visitedTiles], new Vector(i, j))
                visitedTiles++
            }
        }
        const initialPlayerPos = new Vector(
            data[visitedTiles + 1] >> 8,
            data[visitedTiles + 1] & bitWiseHelper.calculateMask(8),
        )
        this.gameManager.player.teleport(initialPlayerPos)
        const initialTime = {
            hour: data[visitedTiles + 2] >> 8,
            day: data[visitedTiles + 2] & bitWiseHelper.calculateMask(8),
        }
        this.gameManager.time = new Clock(initialTime.day, initialTime.hour)
    }

    // Generates random weather effects and applies them to the tiles in the world.
    generateRandomWeather(): void {
        const currentDay = this.gameManager.time.day
        const weather = worldPresets.days[currentDay] || null

        // Define sunlight and water level adjustments based on weather
        for (let x = 0; x < this.gridSize.width; x++) {
            for (let y = 0; y < this.gridSize.height; y++) {
                const tile = this.getTile(new Vector(x, y))

                if (!tile) continue
                if (!weather) {
                    tile.sunLvl = Math.floor(Math.random() * 3)
                    tile.waterLvl += Math.floor(Math.random() * 3)
                } else {
                    switch (weather.trim()) {
                        case 'sunny':
                            tile.sunLvl = 2
                            tile.waterLvl += Math.floor(Math.random() * 3)
                            break
                        case 'rainy':
                            tile.sunLvl = Math.floor(Math.random() * 2)
                            tile.waterLvl += 5

                            break
                        default:
                            tile.sunLvl = Math.floor(Math.random() * 3)
                            tile.waterLvl += Math.floor(Math.random() * 3)
                            break
                    }
                }
                if (tile.waterLvl > 31) tile.waterLvl = 31
            }
        }
    }

    //#endregion

    //#region ----------------------------------- WORLD INTERACTION

    // Checks if a player or entity can enter the tile at the given position.
    checkEnterable(pos: Vector): boolean {
        const tile = this.getTile(pos)
        return tile != null
    }

    // Checks if the specified position is suitable for planting.
    checkPlantable(pos: Vector): boolean {
        const tile = this.getTile(pos)
        return !!tile && !tile.plant
    }

    // Adds a plant to the specified tile if it is plantable.
    addPlant(pos: Vector, obj: Plant): void {
        const tile = this.getTile(pos)
        tile && !tile.plant && (tile.plant = obj)
    }

    // Removes a plant from the specified tile.
    removePlant(pos: Vector): boolean {
        const tile = this.getTile(pos)

        if (tile && tile.plant) {
            tile.plant.destroy()
            tile.plant = null
            return true
        }

        return false
    }

    //#endregion

    //#region ----------------------------------- HELPER FUNCTIONS

    // Fetches a `Tile` object at the specified position.
    getTile(pos: { x: number; y: number }): Tile | null {
        return (this.grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null
    }

    // Create ensurance
    assert(condition: boolean, message?: string): asserts condition {
        if (!condition) {
            throw new Error(message || 'Assertion failed')
        }
    }

    // Generates a random tile index for a spritesheet.
    #getRandomIndex(key = 'grass-spritesheet'): number {
        const texture = this.scene.textures.get(key)

        this.assert(texture.key != '__MISSING')

        return Phaser.Math.Between(0, texture.frameTotal - 2)
    }

    // Renders a tile at the given position within the game world.
    #renderTile(x: number, y: number, index: number, key = 'grass-spritesheet'): void {
        const trueX = x * this.tileSize + this.tileSize / 2
        const trueY = y * this.tileSize + this.tileSize / 2

        const tileSprite = this.scene.add.sprite(trueX, trueY, key, index)

        tileSprite.setDisplaySize(this.tileSize, this.tileSize).setOrigin(0.5)
    }

    //#endregion
}

//#endregion
