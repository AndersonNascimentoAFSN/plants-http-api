require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('../middlewares/errorMiddleware');
const routeNotFoundMiddleware = require('../middlewares/routeNotFoundMiddleware');

const app = express();

app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, X-PINGOTHER, Authorization');

  app.use(cors());

  next();
});

const router = require('../routes');

app.use(morgan('dev'));

app.use('/catalog', router.PlantRouter);

app.use(routeNotFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;