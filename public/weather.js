const temperatureElement = document.querySelector("#temp");
const cityElement = document.querySelector("#city");
const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");

let weatherData = {};

function setWeather(data) {
    weatherData = data;

    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    cityElement.textContent = data.name;
    dateElement.textContent = getDate();
    timeElement.textContent = msToTime(Date.now());
}

function addWidget() {
    if(!isNight()) {
    }
}