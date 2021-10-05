const PlantModel = require('../models/PlantModel');
const PlantSchema = require('../schemas/PlantSchema');

const create = async ({ breed, needsSun, origin, size, specialCare = '' }) => {
  const { error } = PlantSchema.plantCreateValidate({ breed, needsSun, origin, size });

  if (error) return { code: 400, message: error.details[0].message };

  const newPlant = await PlantModel.create({ breed, needsSun, origin, size, specialCare });

  return newPlant;
};

const findAll = async () => {
  const plants = await PlantModel.findAll();

  return plants;
};

module.exports = {
  create,
  findAll,
};