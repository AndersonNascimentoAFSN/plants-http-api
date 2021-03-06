const { ObjectId } = require('mongodb');
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

const findById = async (id) => {
  if (!ObjectId.isValid(id)) return false;

  const plantCollection = await mongoConnection.getConnection()
    .then((db) => db.collection(COLLECTION_NAME));

  const plant = await plantCollection.findOne({ _id: ObjectId(id) });

  return plant;
};

const remove = async (id) => {
  if (!ObjectId.isValid(id)) return false;

  const plantCollection = await mongoConnection.getConnection()
    .then((db) => db.collection(COLLECTION_NAME));

  await plantCollection.findOneAndDelete({ _id: ObjectId(id) });
};

const update = async (id, newPlant) => {
  if (!ObjectId.isValid(id)) return false;

  const plantCollection = await mongoConnection.getConnection()
    .then((db) => db.collection(COLLECTION_NAME));

  const plantUpdated = await plantCollection.findOneAndUpdate(
    { _id: ObjectId(id) },
    { $set: newPlant },
    // { returnOriginal: false },
    { returnDocument: 'after' },
  );

  const plantSerialized = serializePlants(plantUpdated.value);

  return plantSerialized;
};

module.exports = {
  create,
  findAll,
  findById,
  remove,
  update,
};