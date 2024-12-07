// Interface representing the structure of a state in the state machine.
export interface State {
    name: string
    enter(): void
    exit(): void
    update(time: number, delta: number): void
}

// State Machine class for managing state transitions and updates.
export class StateMachine {
    emptyState: string
    parent: Object
    states: { [key: string]: State };
    currentState: State | null
    stateNames: string[]

    constructor(parent: Object) {
        this.emptyState = ''
        this.parent = parent
        this.states = {}
        this.currentState = null
        this.stateNames = []
    }

    //#region ----------------------------------- HELPERS

    // Adds a new state to the state machine.
    addState(state: State): void {
        this.stateNames.push(state.name)
        this.states[state.name] = state
    }

    // Changes the current state of the state machine.
    // Transitions the state machine to a new state by calling the `exit` method on the old state.
    // Transitions the state machine to a new state by calling the `enter` method on the new state.
    changeState(key: string): void {
        const newState = this.states[key]
        if (!newState) {
            return
        }
        if (newState === this.currentState) {
            return
        }
        if (this.currentState) {
            this.currentState.exit()
        }
        this.currentState = newState
        this.currentState.enter()
    }

    // If the current state exists, its `update` method is called.
    update(time: number, delta: number): void {
        this.currentState && this.currentState.update(time, delta)
    }

    //#endregion
}
