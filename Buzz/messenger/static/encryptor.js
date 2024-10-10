// Load public key from Django (fetch from backend)
function arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Load the public key for RSA encryption
async function loadPublicKey() {
    try {
        const response = await fetch('/get-public-key/', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const publicKeyBase64 = await response.text();
            const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);

            return await window.crypto.subtle.importKey(
                "spki",
                publicKeyBuffer,
                {
                    name: "RSA-OAEP",
                    hash: { name: "SHA-256" },
                },
                false,
                ["encrypt"]
            );
        } else {
            throw new Error("Failed to load public key");
        }
    } catch (error) {
        console.error("Error loading public key:", error);
        throw error; // rethrow to handle in the main function
    }
}

// AES encryption with RSA key wrapping
async function encryptMessage(message) {
    try {
        // Step 1: Generate AES key
        const aesKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt"]
        );

        // Step 2: Encrypt the message using AES-GCM
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM nonce
        const encodedMessage = new TextEncoder().encode(message);

        const ciphertext = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 128,
            },
            aesKey,
            encodedMessage
        );

        // Step 3: Encrypt the AES key using RSA
        const publicKey = await loadPublicKey();
        const aesKeyBuffer = await window.crypto.subtle.exportKey("raw", aesKey);
        const encryptedAesKey = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            publicKey,
            aesKeyBuffer
        );

        // Step 4: Return the encrypted message, AES key, and nonce
        return {
            encrypted_aes_key: arrayBufferToBase64(encryptedAesKey),
            nonce: arrayBufferToBase64(iv),
            ciphertext: arrayBufferToBase64(ciphertext),
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error; // rethrow to handle in the calling function
    }
}

// Decrypt the AES key using RSA
async function decryptAesKey(encryptedAesKeyBase64) {
    try {
        const privateKey = await loadPrivateKey();
        const encryptedAesKeyBuffer = base64ToArrayBuffer(encryptedAesKeyBase64);

        const aesKeyBuffer = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedAesKeyBuffer
        );

        return new Uint8Array(aesKeyBuffer); // Return as Uint8Array
    } catch (error) {
        console.error("Decryption of AES key failed:", error);
        return null;
    }
}

// Decrypt the message using AES-GCM
async function decryptMessage(encryptedData) {
    try {
        const { encrypted_aes_key, nonce, ciphertext } = encryptedData;

        // Step 1: Decrypt the AES key
        const aesKey = await decryptAesKey(encrypted_aes_key);
        if (!aesKey) {
            throw new Error("Failed to decrypt AES key");
        }

        // Step 2: Decrypt the message using AES
        return await decryptAes(ciphertext, nonce, aesKey);
    } catch (error) {
        console.error("Decryption error:", error);
        throw error;
    }
}

// AES decryption function
async function decryptAes(ciphertextBase64, nonceBase64, aesKey) {
    try {
        const nonce = base64ToArrayBuffer(nonceBase64);
        const ciphertext = base64ToArrayBuffer(ciphertextBase64);

        // Import the AES key and decrypt the ciphertext
        const cipher = await window.crypto.subtle.importKey(
            "raw",
            aesKey,
            {
                name: "AES-GCM",
            },
            false,
            ["decrypt"]
        );

        const decryptedMessageBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: nonce,
                tagLength: 128,
            },
            cipher,
            ciphertext
        );

        return new TextDecoder().decode(decryptedMessageBuffer);
    } catch (error) {
        console.error("AES decryption failed:", error);
        return null;
    }
}
