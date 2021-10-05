const express = require('express');

const router = express.Router();

const PlantController = require('../controllers/PlantController');

router.post('/plant', PlantController.create);

router.get('/plants', PlantController.findAll);

module.exports = router;