export class Clock {
    hour:number
    day:number
    constructor(day: number = 0, hour: number = 0){
        this.day = day
        this.hour = hour
    }

    tick(hour: number = 1, day: number = 0){
        this.hour += hour
        if (this.hour >= 24) {
            this.day += Math.floor(this.hour / 24)
            this.hour %= 24
        }
        this.day += day
    }
}