//#region --------------------------------------- IMPORTS AND INITS

import * as fs from 'fs'
const configFile = fs.readFileSync('public/gameConfig.dsl', 'utf-8')

//#endregion

/**
 * Parses an external DSL config file to assemble game condition.
 *
 * The expected DSL syntax includes:
 * - `weather-random: true/false` - Whether the weather is random or predefined
 * - `winning-plant-num: <number>` - Number of plants required to win
 * - `winning-plant-growth: <number>` - Growth level required to win
 * - `day <n>:` where `n` specifies the day
 * - `weather: <condition>` specifies the weather for a day
 * - `end-day`, `end-rules`, and `end-file` mark segments of the DSL
 *
 * @param input - The DSL configuration string to parse
 * @returns An object representing the parsed game world presets
 */
export function parseDSL(input: string) {
    //#region ----------------------------------- ASSEMBLY

    const lines: string[] = input.split('\n')

    interface presetCollection {
        weatherRandom: boolean // Determines if weather is randomly assigned
        startingWeather: string // The initial weather condition
        winningPlantNum: number // Number of plants to win the game
        winningPlantGrowth: number // The required growth level of plants to win
        days: string[] // Array holding game state for specific days
    }

    const worldPresets: presetCollection = {
        weatherRandom: false,
        startingWeather: 'sunny',
        winningPlantNum: 3,
        winningPlantGrowth: 3,
        days: [],
    }

    // Local variables for storing the current day and weather
    let day: number = 0
    let weather: string = ''
    let date: string[] = []

    //#endregion

    // Iterate through each line in the DSL input
    for (const line of lines) {
        if (line != '') {
            const words = line.split(' ')
            switch (words[0]) {
                case 'rules:':
                    // console.log('STARTING RULES SECTION:')
                    break

                // ------------------------------ WIN CONDITIONING

                case 'weather-random:':
                    // console.log(`WEATHER RANDOM?: ${words[1]}`)
                    // COMMAND FOR RANDOM OR SET WEATHER
                    worldPresets.weatherRandom = words[1] == 'true' ? true : false
                    break
                case 'winning-plant-num:':
                    // console.log(`NUMBER OF WINNING PLANTS TO BEAT GAME: ${words[1]}`)
                    worldPresets.winningPlantNum = Number(words[1])
                    // COMMAND TO CHANGE WIN CONDITION
                    break
                case 'winning-plant-growth:':
                    // console.log(`WINNING PLANT GROWTH LEVEL: ${words[1]}`)
                    worldPresets.winningPlantGrowth = Number(words[1])
                    // COMMAND TO CHANGE WIN CONDITION
                    break

                // ------------------------------ DAY SPECIFICS

                case 'day':
                    // console.log('NEW DAY')
                    // "(1):"
                    // date = [1,:]
                    date = words[1].split(':')
                    // console.log(`DAY IS: ${date[0]}`)
                    day = Number(date[0])
                    break
                case 'weather:':
                    // console.log(`SETTING WEATHER ON DAY ${day}`)
                    weather = words[1]
                    // console.log(`WEATHER SET TO: ${weather}`)
                    worldPresets.days[day] = weather
                    break

                // ------------------------------ END CASES

                case 'end-day':
                    console.log(`RUNNING COMMAND TO SET DAY ${day}'S WEATHER TO ${weather}`)
                    break
                case 'end-rules':
                    console.log('RULES DONE')
                    break
                case 'end-file':
                    break

                // ------------------------------ ERROR CASE

                default:
                // console.error('Bad formatting of the .dsl file.')
            }
        }
    }

    return worldPresets
}

// The parsed world presets object, representing the game configuration.
export const worldPresets = parseDSL(configFile)
