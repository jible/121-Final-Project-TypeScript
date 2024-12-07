//#region --------------------------------------- IMPORTS

// UTILITIES
import { Vector } from "../utils/Vector"
import { MoveComp, initializePlayerState} from "../utils/PlayerComponents"
import { State, StateMachine } from "../utils/StateMachine"

// ELSE
import { GridObj } from "./GridObj"
import { GameManager } from "../managers/GameManager"

//#endregion

export class Player extends GridObj {
    direction: Vector
    speed: number
    moveComp: MoveComp
    sm: StateMachine
    states: State[]

    constructor(gameManager: GameManager, position: Vector) {
        super(gameManager, position, 'player')
        // Player display and functioning
        this.direction = new Vector(0, 0)
        this.speed = 0.4
        this.moveComp = new MoveComp(this)
        this.setOrigin(0)
        // Initialized state and state machine
        this.states = initializePlayerState(this)
        this.#setUpSM()
        this.sm.changeState('idle')
    }

    // Plays an animation for the player and executes a callback when the animation completes.
    playAnimation(animation: string, callback: Function): void {
        this.play(animation)
        // Attach an event listener for the animation's completion.
        this.once(
            'animationcomplete',
            () => {
                callback && callback()
            },
            this.scene,
        )
    }

    // Updates the player's state with each game tick.
    update(time: number, delta:number): void {
        this.sm.update(time, delta)
    }

    // Sets up the player's state machine and adds all available states.
    #setUpSM(): void {
        this.sm = new StateMachine(this)
        for (const state of this.states) {
            this.sm.addState(state)
        }
    }
}
