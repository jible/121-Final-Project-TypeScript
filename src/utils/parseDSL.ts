type Rules = {
    weatherRandom: boolean;
    startingWeather: string;
    winningPlantNum: number;
    winningPlantGrowth: number;
};

type DayConfig = {
    day: number;
    weather: string;
};

type ParsedScenario = {
    rules: Rules;
    days: DayConfig[];
};

export class DSLParser {
    private lines: string[]; // Stores the DSL, split into lines
    private currentLine: number; // Tracks position in the lines

    constructor(dsl: string) {
        this.lines = dsl.split("\n").map(line => line.trim()); // Remove excess whitespace
        this.currentLine = 0; // Start at the first line
    }

    // Main function to parse the DSL
    public parse(): ParsedScenario {
        const parsed: ParsedScenario = {
            rules: {} as Rules, // Initialized empty rules object
            days: [], // Array for daily configurations
        };

        while (this.currentLine < this.lines.length) {
            const line = this.getCurrentLine();

            if (line.startsWith("rules:")) {
                parsed.rules = this.parseRules();
            } else if (line.startsWith("day")) {
                const dayConfig = this.parseDay();
                if (dayConfig) {
                    parsed.days.push(dayConfig);
                }
            } else {
                this.currentLine++;
            }
        }

        return parsed;
    }

    // Parse the "rules" block
    private parseRules(): Rules {
        const rules: Partial<Rules> = {}; // Temporary object for filling rules
        this.currentLine++; // Skip the "rules:" line

        while (this.currentLine < this.lines.length) {
            const line = this.getCurrentLine();
            if (line.startsWith("end-rules")) {
                this.currentLine++; // Move past "end-rules"
                break;
            }

            const [key, value] = line.split(":").map(part => part.trim());
            switch (key) {
                case "weather-random":
                    rules.weatherRandom = value === "true";
                    break;
                case "starting-weather":
                    rules.startingWeather = value;
                    break;
                case "winning-plant-num":
                    rules.winningPlantNum = parseInt(value, 10);
                    break;
                case "winning-plant-growth":
                    rules.winningPlantGrowth = parseInt(value, 10);
                    break;
                default:
                    throw new Error(`Unknown rule key: ${key}`);
            }

            this.currentLine++;
        }

        return rules as Rules;
    }

    // Parse a "day X" block
    private parseDay(): DayConfig | null {
        const line = this.getCurrentLine();
        const dayMatch = line.match(/^day (\d+):$/); // Match lines like "day 1:"
        if (!dayMatch) {
            return null; // If the format is wrong, ignore it
        }

        const dayNumber = parseInt(dayMatch[1], 10);
        const dayConfig: Partial<DayConfig> = { day: dayNumber };

        this.currentLine++; // Move past "day X:"

        while (this.currentLine < this.lines.length) {
            const current = this.getCurrentLine();
            if (current.startsWith("end-day")) {
                this.currentLine++; // Move past "end-day"
                break;
            }

            const [key, value] = current.split(":").map(part => part.trim());
            if (key === "weather") {
                dayConfig.weather = value;
            } else {
                throw new Error(`Unknown day key: ${key}`);
            }

            this.currentLine++;
        }

        return dayConfig as DayConfig;
    }

    // Utility function to get the current line in the DSL
    private getCurrentLine(): string {
        return this.lines[this.currentLine];
    }
}