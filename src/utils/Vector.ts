// 2D vector utility class to be used in object and player positioning

export class Vector {
    x: number
    y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    //#region ----------------------------------- ARITHMETIC

    // returns A new vector representing the sum of this vector and the other vector
    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    // returns A new vector representing the difference between this vector and the other vector
    minus(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    // returns A new vector scaled by the given coefficient
    mult(coefficient: number): Vector {
        const x = this.x * coefficient
        const y = this.y * coefficient
        return new Vector(x, y)
    }

    // returns `true` if both vectors have the same x and y values, `false` otherwise
    equal(other: Vector): boolean {
        return this.x == other.x && this.y == other.y
    }

    //#endregion

    //#region ----------------------------------- HELPERS

    // returns A new vector with the same x and y values as this vector
    copy(): Vector {
        return new Vector(this.x, this.y)
    }

    // returns A string representing the vector
    stringify(): string {
        return `${this.x}:${this.y}`
    }

    //#endregion
}