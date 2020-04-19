const express = require('express');
const http = require('http');

const { sendToSlack } = require('./_helpers/slack');

const app = express();

app.use(express.json());

app.post('/test-logs', (req, res, next) => {
  req.body.forEach((log) => {
    sendToSlack(log.data);
  });

  res.end();
});

const port = process.env.PORT || 3000;
const baseURL = `https://localhost:${port}`;

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${baseURL}`);
  });