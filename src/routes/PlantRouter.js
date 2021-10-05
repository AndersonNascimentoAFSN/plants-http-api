const express = require('express');

const router = express.Router();

const PlantController = require('../controllers/PlantController');

router.post('/', PlantController.create);

router.get('/', PlantController.findAll);

module.exports = router;