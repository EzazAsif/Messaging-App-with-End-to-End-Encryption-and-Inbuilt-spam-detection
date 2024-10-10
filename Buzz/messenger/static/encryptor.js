
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

    // Load private key from Django (fetch from backend)
    async function loadPrivateKey() {
        const response = await fetch('/get-private-key/', {
            method: 'GET',
            credentials: 'include', // Include credentials for authenticated requests
        });

        if (response.ok) {
            const privateKeyBase64 = await response.text(); // Base64 encoded private key
            const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);

            return await window.crypto.subtle.importKey(
                "pkcs8",
                privateKeyBuffer,
                {
                    name: "RSA-OAEP",
                    hash: { name: "SHA-256" },
                },
                false,
                ["decrypt"]
            );
        } else {
            throw new Error("Failed to load private key");
        }
    }

    // Decrypt message using private key
    async function decryptMessage(encryptedMessageBase64) {
        const privateKey = await loadPrivateKey();
        const encryptedMessageBuffer = base64ToArrayBuffer(encryptedMessageBase64);

        try {
            const decryptedMessage = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                privateKey,
                encryptedMessageBuffer
            );

            return new TextDecoder().decode(decryptedMessage);
        } catch (error) {
            console.error("Decryption failed:", error);
            return null;
        }
    }

