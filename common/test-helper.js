'use strict';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


const server = new MongoMemoryServer();


const connect = async database => {
    try {
        const conn = await mongoose.connect(
            database,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return conn;
    } catch (err) {
        //eslint-disable-next-line
        console.log('Error to connect on mongo', err);
    }
};

const disconnect = async () => { await mongoose.connection.close(); }

const createDB = async () => {
    try {
        const url = await server.getConnectionString();
        await connect(url);
    } catch (err) {
        throw err;
    }
};

const destroyDB = () => {
    disconnect();

};

module.exports = {
    createDB,
    destroyDB
};
