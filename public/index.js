try {
    const hotword = "hey spiegel";
    const perttyHotword = "Hey Spiegel";

    const speechInputText = document.querySelector(".speech-input-text");
    const speechOutputText = document.querySelector(".speech-output-text");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    const recognition = new SpeechRecognition();
    const grammerList = new SpeechGrammarList();

    grammerList.addFromString('#JSGF V1.0;', 1);
    recognition.grammers = grammerList;
    recognition.lang = 'de-DE';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        if (transcript.toLowerCase().indexOf(hotword) != -1) {
            const prettyTranscript = transcript.replace("hey Spiegel", perttyHotword);
            speechInputText.textContent += prettyTranscript;
        }
    };

    recognition.onerror = (event) => {
        speechOutputText.textContent = "Das habe ich leider nicht verstanden!";
        console.error(`[ERROR] Error while recognition: ${event.error}`);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onend = () => {
        recognition.start();
    };

    window.onload = async () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                fetch('/request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        method: 'api-call',
                        response: 'weather',
                        content: [position.coords.latitude, position.coords.longitude]
                    })
                }).then(res => res.json()).then(json => {
                    setWeather(json);
                });
            }, e => {
                console.error(`[ERROR] Error while retriving geolocation: ${e}`);
            }, { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });

        } else {
            console.error(`[ERROR] The browser doesn't support geolocation!`);
        }

        recognition.start();
    };
} catch (e) {
    console.error(e);
}

const temperatureElement = document.querySelector("#temp");
const statusElement = document.querySelector("#status");
const cityElement = document.querySelector("#city");
const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");

function setWeather(data) {
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    statusElement.textContent = data.weather.description;
    cityElement.textContent = data.name;
    dateElement.textContent = getDate();
    timeElement.textContent = msToTime(Date.now());
}

function msToTime(ms) {
    var date = new Date(ms);

    var hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();

    return `${hours}:${minutes}`;
}

function getDate() {
    var date = new Date();

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    date = `${getDay(date.getDay())} ${dd}.${mm}.${yyyy}`;
    return date;
}

function getDay(num) {
    let day;
    switch (num) {
        case 2:
            day = "Tue";
            break;

        case 3:
            day = "Wed";
            break;

        case 4:
            day = "Thu";
            break;

        case 5:
            day = "Fri";
            break;
        
        case 6:
            day = "Sat";
            break;

        case 7:
            day = "Sun";
            break;

        default:
            day = "Mon";
            break;
    }

    return day;
}