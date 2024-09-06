const { Kafka } = require('kafkajs');
const { BROKERS, CONSUMER_GROUP_ID } = require('../config');

const kafka = new Kafka({
    clientId: 'bigchaindb-consumer',
    brokers: BROKERS
    // brokers: ['localhost:9092']
});

// Initialize producer and consumer
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: CONSUMER_GROUP_ID });

// Connect to Kafka
async function connect() {
    await producer.connect();
    console.log('Producer connected');

    await consumer.connect();
    console.log('Consumer connected');
}

// Disconnect from Kafka
async function disconnect() {
    await producer.disconnect();
    console.log('Producer disconnected');

    await consumer.disconnect();
    console.log('Consumer disconnected');
}

// Export the producer, consumer, and connection functions
module.exports = {
    producer,
    consumer,
    connect,
    disconnect
};
