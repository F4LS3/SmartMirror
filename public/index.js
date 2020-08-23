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
        if (event.error == "no-speech") return;
        console.error(`[ERROR] Error while recognition: ${event.error}`);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onend = () => {
        recognition.start();
    };

    window.onload = async () => {
        const position = await geolocate();
        const json = await request('api-call', 'weather', [position.latitude, position.longitude]);

        setWeather(json);
        startTime();
        recognition.start();
    };

    function geolocate() {
        if ('geolocation' in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(position => {
                    resolve(position.coords);
                }, e => console.error(`[ERROR] Error while retriving geolocation: ${e}`), { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
            });
        } else {
            console.error(`[ERROR] The browser doesn't support geolocation!`);
        }
    }

    function request(method, response, content) {
        return new Promise(async (resolve, reject) => {
            const res = await fetch('/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    method: method,
                    response: response,
                    content: content
                })
            });

            resolve(res.json());
        });
    }
} catch (e) {
    console.error(e);
}