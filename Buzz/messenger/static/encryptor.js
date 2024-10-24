// Fetch Public Key from Django API
async function fetchPublicKey(userId) {
    const response = await fetch(`/get-public-key/${userId}`);
    const publicKeyPem = await response.text();
    return publicKeyPem;
}

// Fetch Private Key from Django API
async function fetchPrivateKey(userId) {
    const response = await fetch(`/get-private-key/${userId}`);
    const privateKeyPem = await response.text();
    return privateKeyPem;
}

// Convert PEM Public Key to CryptoKey Object
async function importPublicKey(pemKey) {
    const keyData = pemKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\n/g, '');
    const binaryKeyData = atob(keyData);  // base64 decode
    const keyBuffer = new Uint8Array(binaryKeyData.split('').map(char => char.charCodeAt(0)));

    return crypto.subtle.importKey(
        'spki',
        keyBuffer.buffer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt']
    );
}

// Convert PEM Private Key to CryptoKey Object
async function importPrivateKey(pemKey) {
    const keyData = pemKey
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\n/g, '');
    const binaryKeyData = atob(keyData);  // base64 decode
    const keyBuffer = new Uint8Array(binaryKeyData.split('').map(char => char.charCodeAt(0)));

    return crypto.subtle.importKey(
        'pkcs8',
        keyBuffer.buffer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        ['decrypt']
    );
}

// Encrypt AES Key with RSA Public Key
async function encryptAesKeyWithPublicKey(aesKey, userId) {
    const publicKeyPem = await fetchPublicKey(userId);
    const publicKey = await importPublicKey(publicKeyPem);

    return crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        aesKey
    );
}

// Decrypt AES Key with RSA Private Key
async function decryptAesKeyWithPrivateKey(encryptedAesKey, userId) {
    const privateKeyPem = await fetchPrivateKey(userId);
    const privateKey = await importPrivateKey(privateKeyPem);

    return crypto.subtle.decrypt(
        {
            name: 'RSA-OAEP',
        },
        privateKey,
        encryptedAesKey
    );
}

// AES Encryption Function (Example - needs implementation)
async function aesEncrypt(message, aesKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV for AES GCM
    const encodedMessage = new TextEncoder().encode(message);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        aesKey,
        encodedMessage
    );

    return {
        ciphertext: new Uint8Array(encryptedData),
        iv: iv
    };
}

// AES Decryption Function (Example - needs implementation)
async function aesDecrypt(ciphertext, aesKey, iv) {
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        aesKey,
        ciphertext
    );

    return new TextDecoder().decode(decryptedData);
}
