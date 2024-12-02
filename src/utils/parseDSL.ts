export function parseDSL(
    input: string = `
rules:
weather-random: true
starting-weather: sunny
winning-plant-num: 3
winning-plant-growth: 4
end-rules
day 1:
weather: sunny
end-day
day 2:
weather: rainy
end-day
    `,
) {
    const lines = input.split('\n')

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
                    break
                case 'starting-weather:':
                    console.log(`STARTING WEATHER: ${words[1]}`)
                    // COMMAND TO SET WEATHER FOR A DAY, ON THE FIRST DAY
                    break
                case 'winning-plant-num:':
                    console.log(`NUMBER OF WINNING PLANTS TO BEAT GAME: ${words[1]}`)

                    // COMMAND TO CHANGE WIN CONDITION
                    break
                case 'winning-plant-growth:':
                    console.log(`WINNING PLANT GROWTH LEVEL: ${words[1]}`)
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
                    break
                case 'end-day':
                    console.log(`RUNNING COMMAND TO SET DAY ${day}'S WEATHER TO ${weather}`)
                    break
                case 'end-rules':
                    console.log('RULES DONE')
                    break
                default:
                    console.error('Bad formatting of the .dsl file.')
            }
        }
    }
}
