const http = require("http");
const fs = require("fs");

const homeFile = fs.readFileSync("home.html" , "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp.toFixed());
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min.toFixed());
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max.toFixed());
    temperature = temperature.replace("{%feelslike%}", orgVal.main.feels_like.toFixed());
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url == "/"){
        var requests = require('requests');
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Rajkot&units=metric&appid=8724e47f2035f3832b343666139c4c91"
        )
            .on('data',  (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
           })
            .on('end',  (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
            });
    }
});
server.listen(8000, "127.0.0.1");
