from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Hash import SHA256
import base64
from django.http import JsonResponse, HttpResponse
from accounts.models import User
import json

# Load the private key from the user model (convert to RSA object)
def load_private_key(id):
    private_key = User.objects.get(id=id).private_key
    private_key = add_padding(private_key)  # Ensure base64 string has correct padding
    private_key = base64.b64decode(private_key)  # Decode base64 to binary
    return RSA.import_key(private_key)

# Load the public key from the user model (convert to RSA object)
def load_public_key(id):
    public_key = User.objects.get(id=id).public_key
    public_key = add_padding(public_key)  # Ensure base64 string has correct padding
    public_key = base64.b64decode(public_key)  # Decode base64 to binary
    return RSA.import_key(public_key)

# Encrypt a message using AES
def encrypt_message(message, id):
    aes_key = get_random_bytes(16)  # AES-128 key generation
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(message.encode())
    
    # Encrypt the AES key with RSA
    encrypted_aes_key = encrypt_aes_key(aes_key, id)
    
    return {
        'encrypted_aes_key': encrypted_aes_key,
        'nonce': base64.b64encode(cipher_aes.nonce).decode('utf-8'),
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
        'tag': base64.b64encode(tag).decode('utf-8')
    }

# Decrypt a message using AES
def decrypt_message(encrypted_data, id):
    aes_key = decrypt_aes_key(encrypted_data['encrypted_aes_key'], id)
    nonce = base64.b64decode(encrypted_data['nonce'])
    ciphertext = base64.b64decode(encrypted_data['ciphertext'])
    tag = base64.b64decode(encrypted_data['tag'])
    
    cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce=nonce)
    decrypted_message = cipher_aes.decrypt_and_verify(ciphertext, tag)
    
    return decrypted_message.decode('utf-8')

# Encrypt the AES key using RSA
def encrypt_aes_key(aes_key, id):
    public_key = load_public_key(id)
    cipher = PKCS1_OAEP.new(public_key, hashAlgo=SHA256)
    encrypted_aes_key = cipher.encrypt(aes_key)
    return base64.b64encode(encrypted_aes_key).decode('utf-8')

# Decrypt the AES key using RSA
def decrypt_aes_key(encrypted_aes_key, user_id):
    private_key = load_private_key(user_id)
    cipher = PKCS1_OAEP.new(private_key, hashAlgo=SHA256)  # Use SHA-256 as the hash function
    encrypted_aes_key = base64.b64decode(encrypted_aes_key)  # Decode the AES key from base64
    return cipher.decrypt(encrypted_aes_key)

# View to serve the public key to the frontend
def get_public_key(request, id):
    public_key = load_public_key(id)
    return HttpResponse(base64.b64encode(public_key.export_key()).decode('utf-8'), content_type="text/plain")

# View to serve the private key (for debugging or internal purposes only, be cautious)
def get_private_key(request, id):
    private_key = load_private_key(id)
    return HttpResponse(base64.b64encode(private_key.export_key()).decode('utf-8'), content_type="text/plain")

# Utility to add padding to a base64 string if necessary
def add_padding(base64_string):
    # Ensure the length of the base64 string is divisible by 4 by adding padding characters ('=')
    return base64_string + '=' * (-len(base64_string) % 4)
