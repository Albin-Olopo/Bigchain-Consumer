const { consumer, producer, connect, disconnect } = require('./kafka-configuration/connection');
const { createTransaction } = require('./block-chain-configuration/services');
const os = require('os');
const { CONSUMER_TOPIC, PRODUCER_TOPIC } = require('./config');
const connection = require('./block-chain-configuration/connection');

let isConsuming = true;

async function sendResultToProducer(result) {
    try {
        await producer.send({
            topic: PRODUCER_TOPIC,
            messages: [
                {
                    value: JSON.stringify(result)
                }
            ]
        });
        console.log('Result sent to producer');
    } catch (error) {
        console.error('Error sending result to producer:', error);
    }
}

async function runConsumer() {
    console.log(`Consuming messages from topic "${CONSUMER_TOPIC}"...`);
    
    try {
        await consumer.subscribe({ topic: CONSUMER_TOPIC, fromBeginning: true });
        console.log(`Subscribed to topic "${CONSUMER_TOPIC}"`);

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (isConsuming) {
                    const { value } = message;
                    const parsedMessage = JSON.parse(value.toString());

                    console.log(`Received message: ${JSON.stringify(parsedMessage)} from topic: ${topic}, partition: ${partition}`);
                    
                    try {
                        const result = await createTransaction(parsedMessage,connection);
                        console.log('Transaction created successfully');
                        await sendResultToProducer(result);  // Send the result to Kafka producer
                    } catch (error) {
                        console.error('Error creating transaction:', error);
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function getSystemLoad() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;

    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    }

    return {
        cpuLoad: 1 - (idle / total),
        memoryUsage: (os.totalmem() - os.freemem()) / os.totalmem()
    };
}

async function monitorAndControlConsumer() {
    setInterval(() => {
        const { cpuLoad, memoryUsage } = getSystemLoad();

        console.log(`CPU Load: ${(cpuLoad * 100).toFixed(2)}%`);
        console.log(`Memory Usage: ${(memoryUsage * 100).toFixed(2)}%`);

        if (cpuLoad > 0.8 || memoryUsage > 0.8) {
            if (isConsuming) {
                try {
                    
               
                console.log('High load detected. Pausing consumer...');
                consumer.pause([{ topic: CONSUMER_TOPIC }])
                isConsuming = false;
            } catch (error) {
                console.error('Error pausing consumer:', error);
            }
            }
        } else {
            if (!isConsuming) {
                try {
                    
                
                console.log('Load is normal. Resuming consumer...');
                consumer.resume([{ topic: CONSUMER_TOPIC }])
                isConsuming = true;
            } catch (error) {
                console.error('Error resuming consumer:', error);       
            }
            }
        }
    }, 5000);
}

(async () => {
    try {
        await connect();
        console.log('Connected to Kafka');

        await runConsumer();
        monitorAndControlConsumer();
    } catch (error) {
        console.error('Error during setup:', error);
    }
})();

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await disconnect();
    console.log('Disconnected from Kafka');
    process.exit(0);
});
