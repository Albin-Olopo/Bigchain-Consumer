// bigchainDB.js
const BigchainDB = require('bigchaindb-driver');
const { BIGCHAINDB_URL } = require('../config');

// Initialize the connection
const connection = new BigchainDB.Connection(BIGCHAINDB_URL);

module.exports = connection;
