const mongoConnection = require('./connection');
const { serializePlants } = require('../utils/plantsModelUtils');

const COLLECTION_NAME = 'plants';

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