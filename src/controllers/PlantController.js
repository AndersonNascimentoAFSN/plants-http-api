const rescue = require('express-rescue');
const PlantService = require('../services/PlantService');

// const create = async (req, res, next) => {
//   try {
//     const { breed, needsSun, origin, size, specialCare } = req.body;
  
//     const newPlant = await PlantService.create({ breed, needsSun, origin, size, specialCare });
  
//     if (newPlant.message) return res.status(newPlant.code).json({ message: newPlant.message });

//     res.status(201).json(newPlant);
//   } catch (err) {
//     next(err);
//   }
// };

const create = rescue(async (req, res) => {
  const { breed, needsSun, origin, size, specialCare } = req.body;

  const newPlant = await PlantService.create({ breed, needsSun, origin, size, specialCare });

  if (newPlant.message) return res.status(newPlant.code).json({ message: newPlant.message });

  res.status(201).json(newPlant);
});

const findAll = rescue(async (_req, res) => {
  const plants = await PlantService.findAll();

  res.status(200).json(plants);
});

const findById = rescue(async (req, res) => {
  const { id } = req.params;

  const plant = await PlantService.findById(id);

  res.status(200).json(plant);
});

const remove = rescue(async (req, res) => {
  const { id } = req.params;

  await PlantService.remove(id);

  res.status(204).end();
});

const update = rescue(async (req, res) => {
  const { id } = req.params;
  const { breed, size, needsSun, origin, specialCare } = req.body;

  const plantUpdated = await PlantService
    .update(id, { breed, size, needsSun, origin, specialCare });

  res.status(200).json(plantUpdated);
});

module.exports = {
  create,
  findAll,
  findById,
  remove,
  update,
};
