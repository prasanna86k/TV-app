/* =========================================================
   WEATHER DASHBOARD
   API: Open-Meteo
   Location: Doha, Qatar
   ========================================================= */


// ---------------------------------------------------------
// FIXED LOCATION
// ---------------------------------------------------------

const WEATHER_LOCATION = {
    name: "DOHA, QATAR",
    latitude: 25.2854,
    longitude: 51.5310
};


// ---------------------------------------------------------
// OPEN-METEO API
// ---------------------------------------------------------

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${WEATHER_LOCATION.latitude}` +
    `&longitude=${WEATHER_LOCATION.longitude}` +
    "&current=" +
    "temperature_2m," +
    "relative_humidity_2m," +
    "apparent_temperature," +
    "weather_code," +
    "wind_speed_10m" +
    "&hourly=" +
    "temperature_2m," +
    "apparent_temperature," +
    "relative_humidity_2m," +
    "precipitation_probability," +
    "weather_code," +
    "wind_speed_10m" +
    "&timezone=Asia%2FQatar" +
    "&forecast_days=2";


// ---------------------------------------------------------
// WEATHER CODE
// ---------------------------------------------------------

function getWeatherInfo(code, isDay = true) {

    if (code === 0) {
        return {
            icon: isDay ? "☀" : "☾",
            description: "Clear sky"
        };
    }

    if (code === 1) {
        return {
            icon: isDay ? "🌤" : "☾",
            description: "Mainly clear"
        };
    }

    if (code === 2) {
        return {
            icon: "⛅",
            description: "Partly cloudy"
        };
    }

    if (code === 3) {
        return {
            icon: "☁",
            description: "Overcast"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            icon: "🌫",
            description: "Fog"
        };
    }

    if ([51, 53, 55].includes(code)) {
        return {
            icon: "🌦",
            description: "Drizzle"
        };
    }

    if ([61, 63, 65].includes(code)) {
        return {
            icon: "🌧",
            description: "Rain"
        };
    }

    if ([66, 67].includes(code)) {
        return {
            icon: "🌧",
            description: "Freezing rain"
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            icon: "❄",
            description: "Snow"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            icon: "🌦",
            description: "Rain showers"
        };
    }

    if ([85, 86].includes(code)) {
        return {
            icon: "🌨",
            description: "Snow showers"
        };
    }

    if ([95].includes(code)) {
        return {
            icon: "⛈",
            description: "Thunderstorm"
        };
    }

    if ([96, 99].includes(code)) {
        return {
            icon: "⛈",
            description: "Thunderstorm with hail"
        };
    }

    return {
        icon: "☁",
        description: "Unknown"
    };
}


// ---------------------------------------------------------
// FORMAT HOUR
// ---------------------------------------------------------

function formatHour(timeString) {

    const date = new Date(timeString);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true
    });
}


// ---------------------------------------------------------
// LOAD WEATHER
// ---------------------------------------------------------

async function loadWeather() {

    try {

        const response = await fetch(WEATHER_API);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();

        updateCurrentWeather(data);

        updateHourlyWeather(data);

    } catch (error) {

        console.error("Weather error:", error);

        document.getElementById("hourlyForecast").innerHTML =
            `<div class="weather-error">
                Unable to load weather
            </div>`;
    }
}


// ---------------------------------------------------------
// CURRENT WEATHER
// ---------------------------------------------------------

function updateCurrentWeather(data) {

    const current = data.current;

    const weatherInfo =
        getWeatherInfo(current.weather_code, true);


    // Location

    document.getElementById("weatherLocation")
        .textContent = WEATHER_LOCATION.name;


    // Temperature

    document.getElementById("weatherTemperature")
        .textContent =
        Math.round(current.temperature_2m);


    // Description

    document.getElementById("weatherDescription")
        .textContent =
        weatherInfo.description;


    // Icon

    document.getElementById("weatherIcon")
        .textContent =
        weatherInfo.icon;


    // Feels like

    document.getElementById("weatherFeelsLike")
        .textContent =
        Math.round(current.apparent_temperature) + "°";


    // Humidity

    document.getElementById("weatherHumidity")
        .textContent =
        Math.round(current.relative_humidity_2m) + "%";


    // Wind

    document.getElementById("weatherWind")
        .textContent =
        Math.round(current.wind_speed_10m) + " km/h";
}


// ---------------------------------------------------------
// HOURLY WEATHER
// ---------------------------------------------------------

function updateHourlyWeather(data) {

    const hourly = data.hourly;

    const container =
        document.getElementById("hourlyForecast");


    container.innerHTML = "";


    // Find current hour

    const now = new Date();

    let startIndex = 0;


    for (let i = 0; i < hourly.time.length; i++) {

        const forecastTime =
            new Date(hourly.time[i]);

        if (forecastTime >= now) {

            startIndex = i;
            break;

        }

    }


    // Display next 6 hours

    const hoursToShow = 6;


    for (
        let i = startIndex;
        i < startIndex + hoursToShow;
        i++
    ) {

        if (i >= hourly.time.length) {
            break;
        }


        const time =
            hourly.time[i];


        const temperature =
            Math.round(
                hourly.temperature_2m[i]
            );


        const rainProbability =
            Math.round(
                hourly.precipitation_probability[i]
            );


        const weatherCode =
            hourly.weather_code[i];


        const weatherInfo =
            getWeatherInfo(weatherCode);


        const item =
            document.createElement("div");


        item.className = "hourly-item";


        if (i === startIndex) {
            item.classList.add("current");
        }


        item.innerHTML = `

            <div class="hourly-time">
                ${i === startIndex ? "NOW" : formatHour(time)}
            </div>

            <div class="hourly-icon">
                ${weatherInfo.icon}
            </div>

            <div class="hourly-temperature">
                ${temperature}°
            </div>

            <div class="hourly-rain">
                💧 ${rainProbability}%
            </div>

        `;


        container.appendChild(item);

    }

}


// ---------------------------------------------------------
// INITIAL LOAD
// ---------------------------------------------------------

loadWeather();


// ---------------------------------------------------------
// REFRESH EVERY 15 MINUTES
// ---------------------------------------------------------

setInterval(
    loadWeather,
    15 * 60 * 1000
);