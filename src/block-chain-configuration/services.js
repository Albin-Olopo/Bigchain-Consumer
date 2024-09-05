const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');

// Function to generate a new keypair
async function createKeypair() {
    const mnemonic = bip39.generateMnemonic(); 
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const key32Bytes = seed.slice(0, 32);
    const keyPair = new BigchainDB.Ed25519Keypair(key32Bytes); 
    return keyPair;
}

// Function to create a signed asset transaction
async function createAsset(keyPair, assetData) {
    const asset = { data: assetData };
    const metadata = { timestamp: Date.now() };

    const transaction = BigchainDB.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keyPair.publicKey))
        ],
        keyPair.privateKey
    );

    const signedTransaction = BigchainDB.Transaction.signTransaction(transaction, keyPair.privateKey);
    return signedTransaction;
}

// Function to create and post a transaction
async function createTransaction(assetData, connection) {
    try {
        // const keyPair = await createKeypair();
        // const signedTransaction = await createAsset(keyPair, assetData);
        // const result = await connection.postTransactionCommit(signedTransaction);

        return {
            assetData
        };
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error; // Rethrow the error after logging
    }
}

module.exports = {
    createTransaction
};
