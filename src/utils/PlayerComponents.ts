//#region --------------------------------------- IMPORTS

// UTILITIES
import { Vector } from './Vector'
import { InputHandler } from './InputHandler'
import { keys } from './GlobalConsts'
import { State } from './StateMachine'

// PREFABS
import { World } from '../prefabs/World'
import { Player } from '../prefabs/Player'

// ELSE
import { GameManager } from '../managers/GameManager'
import Phaser from 'phaser'

//#endregion

//#region --------------------------------------- FUNCTIONS

export function initializePlayerState(player: Player) {
    const stateArray: State[] = [
        {
            name: 'idle',
            enter() {
                //play idle anim
                player.play('player-idle')
            },
            exit() {},
            update() {
                function readInput(direction: Vector) {
                    player.direction = direction
                    player.sm.changeState('walk')
                }

                if ((keys.cursors && keys.cursors.left.isDown) || InputHandler.left) {
                    readInput(new Vector(-1, 0))
                } else if ((keys.cursors && keys.cursors.down.isDown) || InputHandler.down) {
                    readInput(new Vector(0, 1))
                } else if ((keys.cursors && keys.cursors.up.isDown) || InputHandler.up) {
                    readInput(new Vector(0, -1))
                } else if ((keys.cursors && keys.cursors.right.isDown) || InputHandler.right) {
                    readInput(new Vector(1, 0))
                } else if ((keys.space && keys.space.isDown) || InputHandler.reap) {
                    player.sm.changeState('reap')
                } else if ((keys.eKey && keys.eKey.isDown) || InputHandler.sow) {
                    player.sm.changeState('sow')
                } else if (
                    (keys.gKey && Phaser.Input.Keyboard.JustDown(keys.gKey)) ||
                    InputHandler.dance
                ) {
                    player.sm.changeState('dance')
                }
            },
        },
        {
            name: 'walk',
            enter() {
                // Start walk animation and movement
                player.play('player-walk')
                player.moveComp.startMoving(() => {
                    document.dispatchEvent(player.gameManager.worldUpdated)
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update(time: number, delta: number) {
                // Update movement component
                player.moveComp.update(time, delta)
            },
        },
        {
            name: 'reap',
            enter() {
                // Play 'reap' animation and remove plant
                player.playAnimation('player-reap', () => {
                    if (player.gameManager.plantManager.removePlant(player.position)) {
                        document.dispatchEvent(player.gameManager.worldUpdated)
                    }
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update() {},
        },
        {
            name: 'sow',
            enter() {
                // Play 'sow' animation and plant a seed
                player.playAnimation('player-sow', () => {
                    if (player.gameManager.plantManager.addPlant(player.position)) {
                        document.dispatchEvent(player.gameManager.worldUpdated)
                    }
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update() {},
        },
        {
            name: 'dance',
            enter() {
                // Play 'dance' animation
                player.playAnimation('player-dance', () => {})
            },
            exit() {},
            update() {
                if (keys.gKey && !keys.gKey.isDown && !InputHandler.dance) {
                    player.sm.changeState('idle')
                }
            },
        },
    ]

    return stateArray
}

//#endregion

//#region --------------------------------------- CLASSES

// Base class for player components
export class Componenet {
    parent: Player

    constructor(parent: Player) {
        this.parent = parent
    }
}

// Handles player movement
export class MoveComp extends Componenet {
    targetGridPosition: Vector
    startGridPosition: Vector
    trueTargetPosition: Vector
    speedVector: Vector
    callback: (() => void) | null
    walking: boolean
    gameManager: GameManager
    world: World

    constructor(parent: Player) {
        super(parent)
        this.targetGridPosition =
            this.startGridPosition =
            this.trueTargetPosition =
                new Vector(0, 0)
        this.callback = null
        this.gameManager = parent.gameManager
        this.world = this.gameManager.world
        this.walking = false
    }

    // Updates the movement component during the game loop.
    update(time: number, delta: number): void {
        this.moveRoutine(time, delta)
    }

    // Starts moving the player toward a target position.
    startMoving(callback: () => void): void {
        this.callback = callback
        this.speedVector = this.parent.direction.mult(this.parent.speed)
        this.startGridPosition = this.parent.position.copy()
        this.targetGridPosition = this.parent.position.add(this.parent.direction)
        this.trueTargetPosition.x = this.targetGridPosition.x * this.gameManager.tileSize
        this.trueTargetPosition.y = this.targetGridPosition.y * this.gameManager.tileSize

        if (!this.world.checkEnterable(this.targetGridPosition)) {
            this.parent.sm.changeState('idle')
            return
        }
    }

    // Handles movement logic, snapping position to grid when necessary.
    moveRoutine(time: number, delta: number): void {
        // Handle the X-axis
        this.parent.x += (this.speedVector.x * delta) / 5
        if (
            (this.parent.x > this.trueTargetPosition.x && this.parent.direction.x > 0) ||
            (this.parent.x < this.trueTargetPosition.x && this.parent.direction.x < 0)
        ) {
            // Snap X position to target
            this.parent.x = this.trueTargetPosition.x
            this.parent.position.x = this.targetGridPosition.x
        }

        // Handle the Y-axis
        this.parent.y += (this.speedVector.y * delta) / 5
        if (
            (this.parent.y > this.trueTargetPosition.y && this.parent.direction.y > 0) ||
            (this.parent.y < this.trueTargetPosition.y && this.parent.direction.y < 0)
        ) {
            // Snap Y position to target
            this.parent.y = this.trueTargetPosition.y
            this.parent.position.y = this.targetGridPosition.y
        }

        // Check if fully arrived at the final position
        if (
            this.parent.x === this.trueTargetPosition.x &&
            this.parent.y === this.trueTargetPosition.y
        ) {
            // Finalize movement
            this.parent.position = this.targetGridPosition.copy()
            if (this.callback) {
                this.callback() // Execute callback
            }
            this.walking = false // Mark movement as complete
            return
        }
    }
}

//#endregion
