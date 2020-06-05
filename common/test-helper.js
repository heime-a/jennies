
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


const server = new MongoMemoryServer();


// eslint-disable-next-line consistent-return
const connect = async (database) => {
  try {
    const conn = await mongoose.connect(
      database,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    );

    return conn;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error to connect on mongo', err);
    return undefined;
  }
};

const disconnect = async () => { await mongoose.connection.close(); };

const createDB = async () => {
  try {
    const url = await server.getConnectionString();
    console.log(url);
    await connect(url);
  } catch (err) {
    throw err;
  }
};

const destroyDB = () => {
  // eslint-disable-next-line no-console
  console.log('Mongo disconnecting');
  disconnect();
};

module.exports = {
  createDB,
  destroyDB,
};
