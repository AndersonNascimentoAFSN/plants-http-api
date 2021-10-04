const Joi = require('joi');

const plantCreateValidate = (plant) => Joi.object({
  breed: Joi.string().required(),
  needsSun: Joi.boolean().required(),
  origin: Joi.string().required(),
  size: Joi.number().required(),
}).validate(plant);

module.exports = {
  plantCreateValidate,
};