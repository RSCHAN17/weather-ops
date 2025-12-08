async function loadWeather() {
    try {
        console.log('check 1');
        const res = await fetch('/api/weather')
        console.log('check 2');
        const weather = await res.json()
        console.log('check 3');

        document.getElementById('weather').innerHTML = `<h2>${weather.name}</h2>
        <p>Temperature: ${weather.main.temp}"C</p>
        <p>Condition: ${weather.weather[0].description}°C</p>`
    } catch (err) {
        document.getElementById('weather').innerHTML = `<p>Failed to load weather data</p>`
        console.log(err);
    }
}

async function loadChart() {
    try {
        const res = await fetch('/api/weather-log')
        const { timestamps, temps } = await res.json()

        const trace = {
            x: timestamps,
            y: temps,
            type: 'scatter',
            node: 'line-markers',
            line: {
                color: 'purple'
            }

        }

        const layout = {
            title: 'Temperature Over Time',
            xaxis: { title: 'Data', tupe: 'data' },
            yaxis: { title: 'Temperature (°C)' },
            legend: { orientation: 'h', x: 0, y: 1.1 }
        }

        Plotly.newPlot('chart', [trace], layout)
    } catch (err) {
        console.log('Failed to load chart', err);
    }
}

loadWeather()
loadChart()