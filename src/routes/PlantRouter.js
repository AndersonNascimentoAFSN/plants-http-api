const express = require('express');

const router = express.Router();

const PlantController = require('../controllers/PlantController');

router.post('/', PlantController.create);

module.exports = router;