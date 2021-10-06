const Joi = require('joi');

const plantCreateValidate = (plant) => Joi.object({
  breed: Joi.string().required(),
  size: Joi.number().required(),
  needsSun: Joi.boolean().required(),
  origin: Joi.string().required(),
  specialCare: Joi.object().required(),
}).validate(plant);

module.exports = {
  plantCreateValidate,
};