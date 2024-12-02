import { Vector } from "../utils/Vector.ts";
import { GameManager } from "../managers/GameManager";
import { Plant } from "../prefabs/Plants.ts";
import { bitWiseHelper } from "../utils/BitHelpers.ts";
import { Clock } from "../utils/clock.ts"
import { worldPresets } from "../utils/parseDSL.ts";
export class Tile {
    gameManager: GameManager
    plant: Plant|null
    waterLvl : number
    sunLvl : number
    constructor(gameManager : GameManager, plant:Plant|null = null, waterLvl = 0, sunLvl = 0) {
        this.gameManager = gameManager

        this.plant = plant
        this.waterLvl = waterLvl
        this.sunLvl = sunLvl
    }

    // Encode the current state into a bitfield
    saveTile() {
        const species = this.plant ? this.plant.species : 0
        const growthLevel = this.plant ? this.plant.growthLevel : 0

        return this.encodeTileData(this.sunLvl, this.waterLvl, species, growthLevel)
    }

    cleanTile() {
        this.plant && this.plant.destroy()
        this.plant = null
        this.sunLvl = 0
        this.waterLvl = 0
    }

    // Restore state from a bitfield
    loadTile(memento:number, position : Vector, scene:Phaser.Scene) {
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

    encodeTileData(lightLevel:number, waterLevel:number, species:number, growthLevel:number):  number{
        let data = 0
        const tileData = [lightLevel, waterLevel, species, growthLevel]
        for (let i = 0; i < tileData.length; i++) {
            data |= (tileData[i] & bitWiseHelper.bitLayout[i].mask) << bitWiseHelper.bitLayout[i].shift
        }
        return data
    }

    decodeTileData(data: number):  number[]{
        let decoded = []
        for (let i = 0; i < bitWiseHelper.bitLayout.length; i++) {
            decoded.push((data >> bitWiseHelper.bitLayout[i].shift) & bitWiseHelper.bitLayout[i].mask)
        }
        return decoded
    }
}
interface GridSize{
    height: number,
    width: number
}
export class World {
    scene : Phaser.Scene
    gameManager : GameManager
    height : number
    width: number
    tileSize : number
    gridSize :GridSize
    grid : Tile[][]
    constructor(gameManager: GameManager, gridSize :GridSize , tileSize : number) {
        this.scene = gameManager.scene

        this.gameManager = gameManager
        this.height = gridSize.height
        this.width = gridSize.width
        this.tileSize = tileSize

        this.gridSize = gridSize
        this.grid = []

        // render blank state
        for (let x = 0; x < this.gridSize.width; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.height; y++) {
                this.grid[x][y] = new Tile(this.gameManager)

                const index = this.#getRandomIndex()
                this.#renderTile(x, y, index)
            }
        }
        this.generateRandomWeather()
    }

    exportWorldInstance() {
        const bytesForTime = 2
        const bytesForPos = 1
        let requiredbytes = this.width * this.height + bytesForTime + bytesForPos

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

        const extraBytes = [posBytes, timeBytes]
        byteAr[visitedTiles + 1] = posBytes
        byteAr[visitedTiles + 2] = timeBytes
        return byteAr
    }

    loadWorldInstance(data : Uint16Array) {
        let visitedTiles = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.grid[i][j].loadTile(data[visitedTiles], new Vector(i, j), this.scene)
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
        this.gameManager.time = new Clock(initialTime.day,initialTime.hour)
    }

    checkEnterable(pos : Vector) {
        const tile = this.getTile(pos)
        return tile != null
    }

    checkPlantable(pos : Vector) {
        const tile = this.getTile(pos)
        return tile && !tile.plant
    }

    addPlant(pos : Vector, obj : Plant) {
        const tile = this.getTile(pos)
        tile && !tile.plant && (tile.plant = obj)
    }

    removePlant(pos : Vector) {
        const tile = this.getTile(pos)

        if (tile && tile.plant) {
            tile.plant.destroy()
            tile.plant = null
            return true
        }
    }

    generateRandomWeather() {

        const currentDay = this.gameManager.time.day
        const weather = worldPresets.days[currentDay]
        if (weather == "sunny"){
            console.log("making it a sunny day")
            for (let x = 0; x < this.gridSize.width; x++) {
                for (let y = 0; y < this.gridSize.height; y++) {
                    const tile = this.getTile(new Vector(x, y))
                    //water level can be stored up, sun level cannot per F0.d
                    tile.waterLvl = tile.waterLvl + Math.floor(Math.random() * 3)
                    tile.sunLvl = 3
                }
            }
            return
        } else if ( weather == "rainy"){

            for (let x = 0; x < this.gridSize.width; x++) {
                for (let y = 0; y < this.gridSize.height; y++) {
                    const tile = this.getTile(new Vector(x, y))
                    //water level can be stored up, sun level cannot per F0.d
                    tile.waterLvl = tile.waterLvl + 5
                    tile.sunLvl = Math.floor(Math.random() * 2)
                }
            }
            console.log("making it a rainyday")
            return
        } else if ( worldPresets.weatherRandom){
            for (let x = 0; x < this.gridSize.width; x++) {
                for (let y = 0; y < this.gridSize.height; y++) {
                    const tile = this.getTile(new Vector(x, y))
                    //water level can be stored up, sun level cannot per F0.d
                    tile.waterLvl = tile.waterLvl + Math.floor(Math.random() * 3)
                    tile.sunLvl = Math.floor(Math.random() * 3)
                }
            }
        } else {
            for (let x = 0; x < this.gridSize.width; x++) {
                for (let y = 0; y < this.gridSize.height; y++) {
                    const tile = this.getTile(new Vector(x, y))
                    //water level can be stored up, sun level cannot per F0.d
                    tile.waterLvl = 5
                    tile.sunLvl = 2
                }
            }
        }
        
    }

    getTile(pos: {x: number, y: number}): any | null {
        const grid = this.grid
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null
    }

    assert(condition: boolean, message?: string): asserts condition {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    #getRandomIndex(key = 'grass-spritesheet') {
        const texture = this.scene.textures.get(key)

        this.assert(texture.key != '__MISSING')

        return Phaser.Math.Between(0, texture.frameTotal - 2)
    }

    #renderTile(x : number, y : number, index:number, key = 'grass-spritesheet') {
        const trueX = x * this.tileSize + this.tileSize / 2
        const trueY = y * this.tileSize + this.tileSize / 2

        const tileSprite = this.scene.add.sprite(trueX, trueY, key, index)
        tileSprite.setDisplaySize(this.tileSize, this.tileSize).setOrigin(0.5)
    }
}
