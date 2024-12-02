import * as fs from 'fs'
const configFile = fs.readFileSync('public/gameConfig.dsl', 'utf-8')

export function parseDSL(input: string) {
    const lines = input.split('\n')
    interface presetCollection {
        weatherRandom: boolean
        startingWeather: string
        winningPlantNum: number
        winningPlantGrowth: number
        days: string[]
    }
    const worldPresets: presetCollection = {
        weatherRandom: false,
        startingWeather: 'sunny',
        winningPlantNum: 3,
        winningPlantGrowth: 3,
        days: [],
    }

    let day: number = 0
    let weather: string = ''
    let date: string[] = []
    for (const line of lines) {
        if (line != '') {
            const words = line.split(' ')
            switch (words[0]) {
                case 'rules:':
                    console.log('STARTING RULES SECTION:')
                    break
                case 'weather-random:':
                    console.log(`WEATHER RANDOM?: ${words[1]}`)
                    // COMMAND FOR RANDOM OR SET WEATHER
                    worldPresets.weatherRandom = words[1] == 'true' ? true : false
                    break
                case 'winning-plant-num:':
                    console.log(`NUMBER OF WINNING PLANTS TO BEAT GAME: ${words[1]}`)
                    worldPresets.winningPlantNum = Number(words[1])
                    // COMMAND TO CHANGE WIN CONDITION
                    break
                case 'winning-plant-growth:':
                    console.log(`WINNING PLANT GROWTH LEVEL: ${words[1]}`)
                    worldPresets.winningPlantGrowth = Number(words[1])
                    // COMMAND TO CHANGE WIN CONDITION
                    break
                case 'day':
                    console.log('NEW DAY')
                    // "(1):"
                    // date = [1,:]
                    date = words[1].split(':')
                    console.log(`DAY IS: ${date[0]}`)
                    day = Number(date[0])
                    break
                case 'weather:':
                    console.log(`SETTING WEATHER ON DAY ${day}`)
                    weather = words[1]
                    console.log(`WEATHER SET TO: ${weather}`)
                    worldPresets.days[day] = weather
                    break
                case 'end-day':
                    console.log(`RUNNING COMMAND TO SET DAY ${day}'S WEATHER TO ${weather}`)
                    break
                case 'end-rules':
                    console.log('RULES DONE')
                    break
                case 'end-file':
                    break
                default:
                    console.error('Bad formatting of the .dsl file.')
            }
        }
    }

    return worldPresets
}

export const worldPresets = parseDSL(configFile)
