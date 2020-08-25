const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");

//JSON.parse(fs.readFileSync('./config.json', 'utf8'))
const config = require("./config.json");

console.clear();

process.env.GOOGLE_API_KEY = config.GoogleAPIKeys.GeolocationAPI;

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(`public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/data/index.html`);
});

app.post('/request', async (req, res) => {
    const method = req.body.method;
    const response = req.body.response;
    const content = req.body.content;
    
    if(method == "api-call") {
        if(response == "weather") {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${content[0]}&lon=${content[1]}&appid=${config.WeatherAPIKey}&units=metric&lang=de`;
            const data = await axios({ url: url, responseType: 'json' });
            res.status(200).send(data.data)
        }
    }
});

app.get('/key', async (req, res) => {
    const requested = req.url.replace("/key?", "");
    let key = "unavailable";

    switch (requested) {
        case 'geolocation':
            key = config.GoogleAPIKeys.GeolocationAPI;
            break;

        case 'calendar':
            key = config.GoogleAPIKeys.CalendarAPI;
            break;
    }

    res.status(200).json({ key: key });
});

app.listen(80, () => {
    console.log(`[INFO] SmartMirror listening on port 8080`);
});