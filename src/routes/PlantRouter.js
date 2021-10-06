const express = require('express');

const router = express.Router();

const PlantController = require('../controllers/PlantController');

router.post('/plant', PlantController.create);

router.get('/plants', PlantController.findAll);

router.get('/plant/:id', PlantController.findById);

router.delete('/plant/:id', PlantController.remove);

router.put('/plant/:id', PlantController.update);

module.exports = router;