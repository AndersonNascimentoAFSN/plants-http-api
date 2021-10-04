const mongoConnection = require('./connection');

const COLLECTION_NAME = 'plants';

const Countries = {
  Brazil: 8,
  other: 7,
};

const waterFrequency = (origin = 'other', needsSun, size) => {
  if (needsSun) return size * 0.77 + Countries[origin]; 

  return (size / 2) * 1.33 + Countries[origin];
};

const serializePlants = (plant) => ({
  breed: plant.breed,
  needsSun: plant.needsSun,
  origin: plant.origin,
  size: plant.size,
  specialCare: {
    waterFrequency: waterFrequency(plant.origin, plant.needsSun, plant.size),
    ...plant.specialCare,
  },
});

const create = async ({ breed, needsSun, origin, size, specialCare = '' }) => {
  const plantCollection = await mongoConnection.getConnection()
    .then((db) => db.collection(COLLECTION_NAME));

  const newPlant = serializePlants({ breed, needsSun, origin, size, specialCare });

  const { insertedId: _id } = await plantCollection.insertOne(newPlant);

  return { 
    _id,
    ...newPlant,
  };
};

module.exports = {
  create,
};