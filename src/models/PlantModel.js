const mongoConnection = require('./connection');

const COLLECTION_NAME = 'plants';

const Countries = {
  brazil: 8,
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
    info: plant.specialCare,
  },
});

const create = async ({ breed, needsSun, origin, size, specialCare = '' }) => {
  const plantCollection = await mongoConnection.getConnection()
    .then((db) => db.collection(COLLECTION_NAME));

  const newPlant = serializePlants({ breed, needsSun, origin, size, specialCare });

  console.log({ breed, needsSun, origin, size, specialCare });

  const { insertedId: _id } = await plantCollection.insertOne(newPlant);

  return { 
    _id,
    ...newPlant,
  };
};

const findAll = async () => {
  const plantCollection = await mongoConnection.getConnection()
  .then((db) => db.collection(COLLECTION_NAME));

  const plants = await plantCollection.find().toArray();

  return plants;
};

module.exports = {
  create,
  findAll,
};