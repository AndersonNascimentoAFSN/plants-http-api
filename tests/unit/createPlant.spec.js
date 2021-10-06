const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../src/models/connection');

const PlantModel = require('../../src/models/PlantModel');

const PlantSchema = require('../../src/schemas/PlantSchema');

const PlantService = require('../../src/services/PlantService');

describe('Testando a função `create` do model PlantModel', () => {
  let connectionMock;

  const payloadPlant = {
    breed: 'Orquídea',
    size: 99,
    needsSun: true,
    origin: 'Brazil',
    specialCare: {
      other: 'temp',
    },
  };

  const COLLECTION_NAME = 'plants';

  before(async () => {
    // Aqui estão as mudanças importantes feitas para 7.0.0
    // https://nodkz.github.io/mongodb-memory-server/docs/guides/migrate7/#no-function-other-than-start-create-ensureinstance-will-be-starting-anything

    // const DBServer = new MongoMemoryServer();
    // const URLMock = await DBServer.getUri();

    const DBServer = await MongoMemoryServer.create();
    const URLMock = DBServer.getUri();
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

    it('o objeto possui a key `_id` da nova planta inserida', async () => {
      const response = await PlantModel.create(payloadPlant);

      expect(response).to.have.a.property('_id');
    });

    it('o objeto deve possuir as keys `breed, size, needsSun, origin e specialCare`', async () => {
      const response = await PlantModel.create(payloadPlant);

      expect(response).to.include.all.keys('breed', 'size', 'needsSun', 'origin', 'specialCare');
    });

    it('a key specialCare é um objeto e possui a key `waterFrequency`', async () => {
      const response = await PlantModel.create(payloadPlant);

      const { specialCare } = response;

      expect(specialCare).to.have.a.property('waterFrequency');
    });

    it('a key waterFrequency é um `number`', async () => {
      const response = await PlantModel.create(payloadPlant);

      const { specialCare: { waterFrequency } } = response;

      expect(waterFrequency).to.have.a('number');
    });

    it('o valor da key waterFrequency é `84.23`', async () => {
      const response = await PlantModel.create(payloadPlant);

      const { specialCare: { waterFrequency } } = response;

      expect(waterFrequency).to.equal(84.23);
    });

    it('deve existir uma planta com a breed e size cadastrada', async () => {
      await PlantModel.create(payloadPlant);

      const createdPlant = await connectionMock.collection(COLLECTION_NAME)
        .findOne({ breed: payloadPlant.breed });

      expect(createdPlant).to.deep.include({ breed: payloadPlant.breed, size: payloadPlant.size });
    });
  });
});

describe('Testando a função `create` do service PlantService', () => {
  const ID_EXAMPLE = '615dcd493d85e459bee00621';

  const payloadPlant = {
    breed: 'Orquídea',
    size: 99,
    needsSun: true,
    origin: 'Brazil',
    specialCare: {
      other: 'temp',
      waterFrequency: 84.23,
    },
  };

  before(() => {
    sinon.stub(PlantModel, 'create')
      .resolves({
        _id: ID_EXAMPLE,
        breed: payloadPlant.breed,
        size: payloadPlant.size,
        needsSun: payloadPlant.needsSun,
        origin: payloadPlant.origin,
        specialCare: payloadPlant.specialCare,
      });
  });

  after(() => {
    PlantModel.create.restore();
  });

  describe('quando uma planta é inserida com sucesso', () => {
    it('retorna um objeto', async () => {
      const response = await PlantService.create(payloadPlant);

      expect(response).to.be.a('object');
    });

    it('o objeto possui a key `_id` da nova planta inserida', async () => {
      const response = await PlantService.create(payloadPlant);

      expect(response).to.have.a.property('_id');
    });

    it('o objeto deve possuir as keys `breed, size, needsSun, origin e specialCare`', async () => {
      const response = await PlantService.create(payloadPlant);

      expect(response).to.include.all.keys('breed', 'size', 'needsSun', 'origin', 'specialCare');
    });

    it('a key specialCare é um objeto e possui a key `waterFrequency`', async () => {
      const response = await PlantService.create(payloadPlant);

      const { specialCare } = response;

      expect(specialCare).to.have.a.property('waterFrequency');
    });

    it('a key waterFrequency é um `number`', async () => {
      const response = await PlantService.create(payloadPlant);

      const { specialCare: { waterFrequency } } = response;

      expect(waterFrequency).to.have.a('number');
    });

    it('o valor da key waterFrequency é `84.23`', async () => {
      const response = await PlantService.create(payloadPlant);

      const { specialCare: { waterFrequency } } = response;

      expect(waterFrequency).to.equal(84.23);
    });
  });

  describe('quando uma planta não é inserida', () => {
    describe('a propriedade `breed`', () => {
      describe('não foi informada no payload', () => {
        const payloadPlant = {
          size: 99,
          needsSun: true,
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedades `message` é a string `"\"breed\" is required"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"breed\" is required");
        });
      });
 
      describe('não é uma string', () => {
        const payloadPlant = {
          breed: 123,
          size: 99,
          needsSun: true,
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedades `message` é a string `"\"breed\" must be a string"', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"breed\" must be a string");
        });

      });
     
    });

    describe('a propriedade `size`', () => {
      describe('não foi informada no payload', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          needsSun: true,
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"size\" is required"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"size\" is required");
        });
      });

      describe('não é um número', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 'string',
          needsSun: true,
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"size\" must be a number"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"size\" must be a number");
        });

      });
    });

    describe('a propriedade `needsSun`', () => {
      describe('não foi informada no payload', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"needsSun\" is required"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"needsSun\" is required");
        });
      });

      describe('não é um booleano', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          needsSun: 'string',
          origin: 'Brazil',
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"needsSun\" must be a boolean"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"needsSun\" must be a boolean");
        });

      });
    });

    describe('a propriedade `origin`', () => {
      describe('não foi informada no payload', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          needsSun: true,
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"origin\" is required"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"origin\" is required");
        });
      });

      describe('não é uma string', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          needsSun: true,
          origin: 10,
          specialCare: {
            other: 'temp',
            waterFrequency: 84.23,
          },
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"origin\" must be a string"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"origin\" must be a string");
        });

      });
    });

    describe('a propriedade `specialCare`', () => {
      describe('não foi informada no payload', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          needsSun: true,
          origin: "brasil",
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"specialCare\" is required"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"specialCare\" is required");
        });
      });

      describe('não é um objeto', () => {
        const payloadPlant = {
          breed: 'Orquídea',
          size: 99,
          needsSun: true,
          origin: 'brazil',
          specialCare: "temp: 10",
        };

        it('retorna um objeto', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.be.an('object');
        });
  
        it('o objeto possui as propriedades `code e message`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          expect(response).to.include.all.keys('code', 'message');
        });
  
        it('a propriedade `message` é a string `"\"specialCare\" must be of type object"`', async () => {
          const response = await PlantService.create(payloadPlant);
  
          const { message } = response;
  
          expect(message).to.be.a('string').to.equal("\"specialCare\" must be of type object");
        });

      });
    });
  });
});

describe('Testando a função `create` do controller PlantController', () => {
  describe('quando uma planta é inserida com sucesso', () => {

  });

  describe('quando uma planta não é inserida', () => {

  });
});