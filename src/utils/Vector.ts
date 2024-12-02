export class Vector {
    x: number
    y: number
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    minus(other:Vector) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    copy() {
        return new Vector(this.x, this.y)
    }

    stringify() {
        return this.x.toString() + ':' + this.y.toString()
    }

    mult(coefficient:number) {
        const x = this.x * coefficient
        const y = this.y * coefficient
        return new Vector(x, y)
    }

    equal(other:Vector) {
        return this.x == other.x && this.y == other.y
    }
}
