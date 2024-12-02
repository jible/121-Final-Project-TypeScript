export interface State {
    name:string
    enter(): void
    exit(): void
    update(ime : number , delta: number): void
}

export class StateMachine {
    emptyState = ''
    parent:Object
    states: { [key: string]: State };
    currentState: State | null
    stateNames: string[]

    constructor(parent: Object) {
        this.parent = parent
        this.states = {}
        this.currentState = null
        this.stateNames = []
    }

    addState(state: State) {
        this.stateNames.push(state.name)
        this.states[state.name] = state
    }

    changeState(key: string) {
        const newState = this.states[key]
        if (!newState) {
            return
        }
        if (newState === this.currentState) {
            return
        }
        if (this.currentState) {
            // don't exit a state that doesn't exist!
            this.currentState.exit()
        }
        this.currentState = newState
        this.currentState.enter()
    }

    update(time : number , delta: number) {
        this.currentState && this.currentState.update(time, delta)
    }
}
