import express from 'express';
import request from 'request';
import { load } from 'cheerio';
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function (req, res) {
  let url = 'https://www.bcv.org.ve';

  request({
    "rejectUnauthorized": false,
    "url": url,
    "method": 'GET'
  }, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = load(html);
      const dolar = $('div#dolar strong').text().trim();
      const euro = $('div#euro strong').text().trim();
      const date = $('div#titulo1').siblings().eq(6).text().trim();

      let obj = {
        "fecha": date,
        "dolar": dolar,
        "euro": euro
      };
      res.send(obj);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});