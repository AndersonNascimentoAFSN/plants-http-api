const PlantService = require('../services/PlantService');

const create = async (req, res) => {
  const { breed, needsSun, origin, size, specialCare } = req.body;

  const newPlant = await PlantService.create({ breed, needsSun, origin, size, specialCare });

  if (newPlant.message) return res.status(newPlant.code).json({ message: newPlant.message });

  res.status(201).json(newPlant);
};

const findAll = async (_req, res) => {
  const plants = await PlantService.findAll();

  res.status(200).json(plants);
};

const findById = async (req, res) => {
  const { id } = req.params;

  const plant = await PlantService.findById(id);

  res.status(200).json(plant);
};

module.exports = {
  create,
  findAll,
  findById,
};
