import { Vector } from "../utils/Vector"
import { GridObj } from "./GridObj"
import { GameManager } from "../managers/GameManager"
import { MoveComp, initializePlayerState} from "../utils/PlayerComponents"
import { State, StateMachine } from "../utils/StateMachine"


export class Player extends GridObj {
    direction: Vector
    speed: number
    moveComp: MoveComp
    sm: StateMachine
    states: State[]

    constructor(gameManager: GameManager, position: Vector) {
        super(gameManager, position, 'player')
        this.direction = new Vector(0, 0)

        this.speed = 0.4
        this.moveComp = new MoveComp(this)

        this.setOrigin(0)

        this.states = initializePlayerState(this)
        this.setUpSM()
        this.sm.changeState('idle')
    }

    playAnimation(animation: string, callback: Function) {
        this.play(animation)
        this.once(
            'animationcomplete',
            () => {
                callback && callback()
            },
            this.scene,
        )
    }

    update(time: number, delta:number) {
        this.sm.update(time, delta)
    }

    setUpSM() {
        this.sm = new StateMachine(this)
        for (let i of this.states) {
            this.sm.addState(i)
        }
    }
}
