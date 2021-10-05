require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Method', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', '\'X-PINGOTHER\' \'Content-Type\', \'Authorization');

  app.use(cors());

  next();
});

// app.use(cors());

const router = require('../routes');

app.use('/plants', router.PlantRouter);

module.exports = app;