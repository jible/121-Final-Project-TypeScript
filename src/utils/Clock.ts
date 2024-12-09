// Represents a simple clock system to track in-game days and hours.
export class Clock {
    hour: number
    day: number
    
    constructor(day: number = 0, hour: number = 0){
        this.day = day
        this.hour = hour
    }

    // Advances the clock by the specified number of hours and days.
    tick(hour: number = 1, day: number = 0): void {
        this.hour += hour;

        // Roll over to the next day if hours exceed or equal 24
        if (this.hour >= 24) {
            this.day += Math.floor(this.hour / 24)
            this.hour %= 24
        }

        this.day += day;
    }
}
