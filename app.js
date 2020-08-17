const express = require("express");
const app = express();
const axios = require("axios");

const config = require('./config.json');

console.clear();

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
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${content[0]}&lon=${content[1]}&appid=${config.weatherAPIKey}&units=metric&lang=de`;
            console.log(url);
            axios({
                url: url,
                responseType: 'json'
            }).then(data => {
                console.log(data.data);
                res.status(200).send(data.data);
            });
        }
    }
});

app.listen(8080, () => {
    console.log(`[INFO] SmartMirror listening on port 8080`);
});