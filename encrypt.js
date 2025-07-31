const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load .env variables

const algorithm = 'aes-128-cbc';
let key;

// Option 1: Load key from environment variable if set
if (process.env.SECRET_KEY) {
    const envKey = Buffer.from(process.env.SECRET_KEY, 'utf8');
    if (envKey.length !== 16) {
        throw new Error('SECRET_KEY must be 16 bytes (128 bits) for AES-128-CBC');
    }
    key = envKey;
    console.log('[INFO] Using secret key from environment variable.');
} else {
    // Option 2: Fallback to file-based key loading and rotation
    const keyDir = path.join(__dirname, '../keys');
    const currentKeyPath = path.join(keyDir, 'current.txt');

    if (!fs.existsSync(keyDir)) {
        throw new Error(`Keys directory not found at ${keyDir}`);
    }
    if (!fs.existsSync(currentKeyPath)) {
        throw new Error(`Current key file not found at ${currentKeyPath}`);
    }

    const currentKeyFile = fs.readFileSync(currentKeyPath, 'utf8').trim();
    const currentKeyFilePath = path.join(keyDir, currentKeyFile);

    if (!fs.existsSync(currentKeyFilePath)) {
        throw new Error(`Key file "${currentKeyFile}" not found in keys directory.`);
    }

    key = fs.readFileSync(currentKeyFilePath);
    if (key.length !== 16) {
        throw new Error(`Key in file must be 16 bytes (128 bits) for AES-128-CBC`);
    }

    console.log(`[INFO] Using key from file: ${currentKeyFile}`);
}

/**
 * Encrypts a Buffer using AES-128-CBC.
 * Prepends the random IV to the ciphertext.
 * @param {Buffer} buffer - The plaintext buffer to encrypt.
 * @returns {Buffer} - The IV + ciphertext buffer.
 */
function encrypt(buffer) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return encrypted;
}

/**
 * Decrypts a Buffer encrypted by `encrypt()`.
 * Extracts the IV from the first 16 bytes.
 * @param {Buffer} buffer - The encrypted buffer (IV + ciphertext).
 * @returns {Buffer} - The decrypted plaintext buffer.
 */
function decrypt(buffer) {
    const iv = buffer.slice(0, 16);
    const encryptedText = buffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted;
}

module.exports = { encrypt, decrypt };