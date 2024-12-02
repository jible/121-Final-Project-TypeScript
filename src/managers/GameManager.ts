import { globalConstants } from "../utils/globalConsts";
import { World } from "../prefabs/World.ts"
import { PlantManager} from "../managers/PlantManager.ts"
import { WinConManager} from "./WinManager.ts"
import { worldTimeLine} from "./TimeLineManager.ts"
import { Player} from "../prefabs/Player.ts"
import { Vector} from "../utils/Vector.ts"
import Phaser from "phaser";
import { Clock } from "../utils/clock.ts";


export class GameManager {
    tileSize = globalConstants.tileSize
    scene: Phaser.Scene
    time: Clock
    saveName: string
    world: World
    plantManager: PlantManager
    winManager: WinConManager
    player: Player
    timeLine: worldTimeLine
    worldUpdated: CustomEvent
    constructor(scene: Phaser.Scene, gridSize: Object, tileSize : number, saveName = 'Slot:1') {
        this.scene = scene
        this.time = new Clock()
        this.saveName = saveName;
        // Instantiate key modules
        this.world = new World(this, gridSize, tileSize)

        this.plantManager = new PlantManager(this.scene, this)
        this.winManager = new WinConManager(this)

        this.player = new Player(this, new Vector(0, 0))

        this.timeLine = new worldTimeLine(this)

        this.load()
        this.world.loadWorldInstance(this.timeLine.currentAction)

        this.worldUpdated = new CustomEvent('world-updated', {})
        document.addEventListener('world-updated', () => {
            this.gameStateUpdated()
        })
    }

    save(){
        localStorage.setItem(this.saveName, this.timeLine.exportState());
    }

    load(){
        const file = (localStorage.getItem(this.saveName));
        file && this.timeLine.loadGame(file)
    }

    gameStateUpdated() {
        //save the game state
        //add state to worldStates
        this.timeLine.addState()
    }

    update(time : number, delta: number) {
        this.player.update(time, delta)
    }

    tick(hour = 1, day = 0) {
        this.gameStateUpdated()
        // Update time
        this.time.tick(hour,day)

        this.plantManager.tick()

        // Trigger world/weather updates and plant mechanics
        this.world.generateRandomWeather()
        // Check win condition
        if (this.winManager.checkWinCondition()) {
            console.log('🔥 YOU WIN! 🔥')
        }
    }

    setPlayer(player : Player) {
        // Associate the player instance with GameManager
        this.player = player
    }
}
