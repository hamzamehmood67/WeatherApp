const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs")

const app = express();
app.set('view engine', 'ejs');

const weatherInfo = fs.readFileSync(`${__dirname}/weather.html`, 'utf-8');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const city = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ca56f2ea4677cb89626ce0b0617341e4&units=metric"
    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherObj = JSON.parse(data);
            const temp = Math.floor(weatherObj.main.temp);
            const descrip = weatherObj.weather[0].description;
            const main = weatherObj.weather[0].main;
            const icon = weatherObj.weather[0].icon;
            const humidity = weatherObj.main.humidity;
            const pressure = weatherObj.main.pressure;
            const wind = weatherObj.wind.speed;

            // const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            // const result = `<h3 style= "color:black;text-align:center;">Current temperature is  ${temp}&degC  <br>The weather condition is ${descrip} </h3>`;
            // res.write(`<h1 style="color:#45a049;text-align:center;">${city}`)
            // // <h1 style="color:blue;text-align:center;">This is a heading</h1>
            // res.write(result);
            // res.write(`<img  src=${imageUrl}>`)

            let output = weatherInfo.replace('{%CITY%}', city);
            output = output.replace('{%temp%}', temp);
            output = output.replace('{%main%}', main);
            output = output.replace('{%humidity%}', humidity);
            output = output.replace('{%pressure%}', pressure);
            output = output.replace('{%wind%}', wind);

            res.end(output)

        })
    })
})

app.listen("3000", function () {
    console.log("Server is listening at port 3000");
})