import fs from 'fs'
//file system - fs. Read from and write from files
import path from 'path'
//Show us the file path
import dotenv from 'dotenv'
//Allows us to read environment files
dotenv.config()
const DATA_DIR = path.join(import.meta.dirname, 'data')
//import.eta.dirname gives the current filename, combines it with data folder

if (!fs.existsSync(DATA_DIR)) {
    //! Returns true if exists
    fs.mkdirSync(DATA_DIR)
}

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv')
// make files into DATA_DIR

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.CITY || 'London'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        const nowUTC = new Date().toISOString()
        // timestamp
        data._last_updated_utc = nowUTC
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2))
        const header = 'timestamp,city,temperature,description\n'
        if (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, header)
        } else {
            const firstLine = fs.readFileSync(LOG_FILE, 'utf-8').split('\n')[0]
            if (firstLine != 'timestamp,city,temperature,description') {
                fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE, 'utf-8'))
            }
        }
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}`
        fs.appendFileSync(LOG_FILE, logEntry)

        console.log(`Weather data updated for ${city} at ${nowUTC}`);
    } catch (err) {
        console.log(`Error fetching weather: ${err}`);
    }

}

if (import.meta.url === `file://${[process.argv[1]]}`) {
    fetchWeather()
}
