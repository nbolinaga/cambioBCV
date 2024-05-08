import express from 'express';
import request from 'request';
import { load } from 'cheerio';
import fs from 'fs';

const app = express();

// Middleware to verify the presence and value of the X-RapidAPI-Proxy-Secret header
const rapidAPIMiddleware = (req, res, next) => {
  const rapidAPIProxySecret = req.headers['x-rapidapi-proxy-secret'];
  if (!rapidAPIProxySecret || rapidAPIProxySecret !== process.env.RAPIDAPI_PROXY_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Function to check if the data in JSON file is from today
const isDataFromToday = (dateString) => {
  const today = new Date().toISOString().slice(0, 10);
  return dateString === today;
};

const jsonFilePath = 'data.json';

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Proxy-Secret');
  next();
});

app.get('/historico', function (req, res) {
  if (fs.existsSync(jsonFilePath)) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    res.json(jsonData.historico || []);
  } else {
    res.json([]);
  }
});

app.get('/', rapidAPIMiddleware, function (req, res) {
  if (fs.existsSync(jsonFilePath)) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    if (isDataFromToday(jsonData.date)) {
      return res.json(jsonData.data);
    }
  }

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
      const yuan = $('div#yuan strong').text().trim();
      const lira = $('div#lira strong').text().trim();
      const rublo = $('div#rublo strong').text().trim();
      const fecha = $('div#titulo1').siblings().eq(6).text().trim();

      let obj = {
        "date": new Date().toISOString().slice(0, 10),
        "data": {
          "fecha": fecha,
          "dolar": dolar,
          "euro": euro,
          "yuan": yuan,
          "lira": lira,
          "rublo": rublo
        },
        "historico": [
          // Save the data in historical array withput erasing the previous data
          ...(fs.existsSync(jsonFilePath) ? JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')).historico : []),
          {
            "fecha": fecha,
            "dolar": dolar,
            "euro": euro,
            "yuan": yuan,
            "lira": lira,
            "rublo": rublo
          }
        ]
      };

      fs.writeFileSync(jsonFilePath, JSON.stringify(obj), 'utf8');

      res.json(obj.data);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});