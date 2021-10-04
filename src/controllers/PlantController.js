const PlantService = require('../services/PlantService');

const create = async (req, res) => {
  const { breed, needsSun, origin, size, specialCare } = req.body;

  const newPlant = await PlantService.create({ breed, needsSun, origin, size, specialCare });

  if (newPlant.message) return res.status(newPlant.code).json({ message: newPlant.message });

  res.status(200).json(newPlant);
};

module.exports = {
  create,
};
