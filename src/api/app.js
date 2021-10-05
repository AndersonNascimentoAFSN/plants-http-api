require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, X-PINGOTHER, Authorization');
  // '\'X-PINGOTHER\' \'Content-Type\', \'Authorization\', \'XMLHttpRequest\'');

  app.use(cors());

  next();
});

// app.use(cors());

const router = require('../routes');

app.use('/plants', router.PlantRouter);

module.exports = app;