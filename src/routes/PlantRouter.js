const express = require('express');

const router = express.Router();

const rescue = require('express-rescue');
const PlantController = require('../controllers/PlantController');

router.post('/plant', rescue(PlantController.create));

router.get('/plants', rescue(PlantController.findAll));

router.get('/plant/:id', rescue(PlantController.findById));

router.delete('/plant/:id', rescue(PlantController.remove));

router.put('/plant/:id', rescue(PlantController.update));

module.exports = router;