// Function to fetch RSA public key
async function fetchPublicKey() {
    const response = await fetch('/get-public-key/');
    if (!response.ok) throw new Error('Error fetching public key');
    const publicKeyBase64 = await response.text();
    return publicKeyBase64;
}

// Function to fetch RSA private key
async function fetchPrivateKey() {
    const response = await fetch('/get-private-key/');
    if (!response.ok) throw new Error('Error fetching private key');
    const privateKeyBase64 = await response.text();
    return privateKeyBase64;
}

// Function to import RSA public key
async function importPublicKey(publicKeyBase64) {
    const publicKey = await window.crypto.subtle.importKey(
        'spki', 
        Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0)), 
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' }
        }, 
        false, 
        ['encrypt']
    );
    return publicKey;
}

// Function to import RSA private key
async function importPrivateKey(privateKeyBase64) {
    const privateKey = await window.crypto.subtle.importKey(
        'pkcs8', 
        Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0)), 
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' }
        }, 
        false, 
        ['decrypt']
    );
    return privateKey;
}

// Function to generate AES key
async function generateAESKey() {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 128 // AES-128
        },
        true, 
        ['encrypt', 'decrypt']
    );
}

// Function to encrypt a message with AES
async function aesEncrypt(message, aesKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encoder = new TextEncoder();
    const ciphertext = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        aesKey,
        encoder.encode(message)
    );

    return {
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(ciphertext))
    };
}

// Function to decrypt a message with AES
async function aesDecrypt(ciphertext, aesKey, iv) {
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new Uint8Array(iv),
        },
        aesKey,
        new Uint8Array(ciphertext)
    );
    return new TextDecoder().decode(decrypted);
}

// Function to encrypt AES key with RSA public key
async function encryptAESKey(aesKey, publicKey) {
    const exportedKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedKey = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP'
        },
        publicKey,
        exportedKey
    );
    return Array.from(new Uint8Array(encryptedKey));
}

// Function to decrypt AES key with RSA private key
async function decryptAESKey(encryptedKey, privateKey) {
    const decryptedKey = await window.crypto.subtle.decrypt(
        {
            name: 'RSA-OAEP'
        },
        privateKey,
        new Uint8Array(encryptedKey)
    );
    return await window.crypto.subtle.importKey(
        'raw', 
        decryptedKey, 
        {
            name: 'AES-GCM'
        },
        true,
        ['encrypt', 'decrypt']
    );
}
