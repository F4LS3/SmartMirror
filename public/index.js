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
    recognition.interimResults = false;
    //recognition.continuous = true;

    recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        if (transcript.toLowerCase().indexOf(hotword) != -1) {
            const prettyTranscript = transcript.replace("hey Spiegel", perttyHotword);
            speechInputText.textContent = prettyTranscript;

            fetch('/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    method: 'voice',
                    response: 'answer',
                    content: transcript.toLowerCase()
                })
            }).then(res => {
                return res.json();

            }).then(json => {
                console.log(json);
            });
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
                    console.log(json);
                    setWeather(json);
                });

                console.log([position.coords.latitude, position.coords.longitude]);
            }, e => {
                console.error(`[ERROR] Error while retriving geolocation: ${e}`);
            }, {maximumAge: 10000, timeout: 10000, enableHighAccuracy: true});

        } else {
            console.error(`[ERROR] The browser doesn't support geolocation!`);
        }

        recognition.start();
    };
} catch (e) {
    console.error(e);
}

function setWeather(data) {

}