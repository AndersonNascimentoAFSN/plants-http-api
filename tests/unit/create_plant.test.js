const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../src/models/connection');

const PlantModel = require('../../src/models/PlantModel');

describe('Testando a função `create` do model PlantModel', () => {
  let connectionMock;

  const payloadPlant = {
    breed: 'Orquidea',
    size: 99,
    needsSun: true,
    origin: 'Brazil',
  };

  const COLLECTION_NAME = 'plants';

  before(async () => {
    const DBServer = new MongoMemoryServer();
    const URLMock = await DBServer.getUri();
    const DB_NAME = 'Plant_Catalog';

    connectionMock = await MongoClient.connect(URLMock, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((conn) => conn.db(DB_NAME));

    sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe('quando uma planta é inserida com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await PlantModel.create(payloadPlant);

      expect(response).to.be.a('object');
    });

    it('o objeto possui a key "_id da nova planta inserida', async () => {
      const response = await PlantModel.create(payloadPlant);

      expect(response).to.have.a.property('_id');
    });

    it('deve existir uma planta com a breed e size cadastrada', async () => {
      await PlantModel.create(payloadPlant);

      const createdPlant = await connectionMock.collection(COLLECTION_NAME)
        .findOne({ breed: payloadPlant.breed });

      expect(createdPlant).to.deep.include(payloadPlant);
    });
  });
});