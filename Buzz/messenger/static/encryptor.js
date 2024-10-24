// Fetch Public Key from Django API
async function fetchPublicKey(userId) {
    const response = await fetch(`/get-public-key/${userId}`);
    const publicKeyPem = await response.text();
    return `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;
}

// Fetch Private Key from Django API
async function fetchPrivateKey(userId) {
    const response = await fetch(`/get-private-key/${userId}`);
    const privateKeyPem = await response.text();
    return `-----BEGIN PRIVATE KEY-----\n${privateKeyPem}\n-----END PRIVATE KEY-----`;
}

// Import the public key from PEM format
async function importPublicKey(pemKey) {
    const keyData = pemKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\n/g, '');

    const binaryKeyData = atob(keyData); // Base64 decode
    const keyBuffer = new Uint8Array(binaryKeyData.split('').map(char => char.charCodeAt(0)));

    return await crypto.subtle.importKey(
        'spki',  // "SubjectPublicKeyInfo" structure
        keyBuffer.buffer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' }
        },
        true,
        ['encrypt']
    );
}

// Import the private key from PEM format
async function importPrivateKey(pemKey) {
    const keyData = pemKey
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '');

    const binaryKeyData = atob(keyData); // Base64 decode
    const keyBuffer = new Uint8Array(binaryKeyData.split('').map(char => char.charCodeAt(0)));

    return await crypto.subtle.importKey(
        'pkcs8',  // "PrivateKeyInfo" structure
        keyBuffer.buffer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' }
        },
        true,
        ['decrypt']
    );
}

// Use imported keys from API
async function processEncryption(message, userId) {
    try {
        // Fetch public and private keys from the API
        const publicKeyPem = await fetchPublicKey(userId);
        const privateKeyPem = await fetchPrivateKey(userId);

        // Import public and private keys
        const publicKey = await importPublicKey(publicKeyPem);
        const privateKey = await importPrivateKey(privateKeyPem);

        // Generate AES key
        const aesKey = await generateAESKey();

        // Encrypt message with AES
        const { iv, encryptedMessage } = await encryptMessageAES(aesKey, message);

        // Encrypt AES key with RSA public key
        const encryptedAESKey = await encryptAESKeyWithRSA(publicKey, aesKey);

        // Log results
        console.log("Encrypted AES Key:", encryptedAESKey);
        console.log("Encrypted Data:", encryptedMessage);

        // Decrypt AES key with RSA private key
        const decryptedAESKey = await decryptAESKeyWithRSA(privateKey, encryptedAESKey);

        // Decrypt message using decrypted AES key
        const decryptedMessage = await decryptMessageAES(decryptedAESKey, iv, encryptedMessage);

        console.log("Decrypted Message:", decryptedMessage);
    } catch (error) {
        console.error("Encryption/Decryption failed:", error);
    }
}

// Helper function to generate an AES key
async function generateAESKey() {
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,  // 256-bit AES key
        },
        true,  // Extractable (so we can wrap it with RSA)
        ["encrypt", "decrypt"]
    );
}

// AES Encryption Function
async function encryptMessageAES(aesKey, message) {
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate IV

    const encryptedMessage = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        encodedMessage
    );

    return { iv, encryptedMessage };
}

// AES Key Encryption with RSA Public Key
async function encryptAESKeyWithRSA(publicKey, aesKey) {
    const exportedAESKey = await crypto.subtle.exportKey("raw", aesKey);
    return await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        exportedAESKey
    );
}

// AES Key Decryption with RSA Private Key
async function decryptAESKeyWithRSA(privateKey, encryptedAESKey) {
    const decryptedAESKey = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        privateKey,
        encryptedAESKey
    );

    return await crypto.subtle.importKey(
        "raw",
        decryptedAESKey,
        {
            name: "AES-GCM",
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// AES Decryption Function
async function decryptMessageAES(aesKey, iv, encryptedMessage) {
    const decryptedMessage = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        encryptedMessage
    );

    return new TextDecoder().decode(decryptedMessage);
}

// Example usage
const userId = 24;  // Replace with the actual user ID
processEncryption("Annonymous person!", userId);
