const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    BIGCHAINDB_URL: process.env.BIGCHAINDB_URL || 'http://localhost:9984/api/v1/',
    BROKERS: (process.env.BROKERS || 'localhost:9092,localhost:9093,localhost:9094').split(','),
    CONSUMER_GROUP_ID: process.env.CONSUMER_GROUP_ID || 'GROUP1',
    CONSUMER_TOPIC: process.env.CONSUMER_TOPIC || 'TOPIC1',
    PRODUCER_TOPIC: process.env.PRODUCER_TOPIC || 'TOPIC2'
};
