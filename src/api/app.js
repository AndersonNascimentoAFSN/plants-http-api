require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const router = require('../routes');

app.use('/plant', router.PlantRouter);

module.exports = app;