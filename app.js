require('dotenv').config();

const express = require('express');
const http = require('http');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/api/logs', require('./api/logs'));

const port = process.env.PORT || 3000;
http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });