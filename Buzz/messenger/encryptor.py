# views.py (Django)
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Hash import SHA256
import base64
from django.http import JsonResponse, HttpResponse
import json

# Generate RSA keys (you only need to generate them once)
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()

    # Store the keys securely (in environment variables, files, or database)
    with open("private.pem", "wb") as priv_file:
        priv_file.write(private_key)
    
    with open("public.pem", "wb") as pub_file:
        pub_file.write(public_key)
    
    return private_key, public_key

# Load the private key from file
def load_private_key():
    with open("private.pem", "rb") as priv_file:
        return RSA.import_key(priv_file.read())

# Load the public key from file
def load_public_key():
    with open("public.pem", "rb") as pub_file:
        return RSA.import_key(pub_file.read())

# Encrypt a message using AES
def encrypt_message(message):
    aes_key = get_random_bytes(16)  # AES-128
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(message.encode())
    
    # Encrypt the AES key with RSA
    encrypted_aes_key = encrypt_aes_key(aes_key)
    
    return {
        'encrypted_aes_key': encrypted_aes_key,
        'nonce': base64.b64encode(cipher_aes.nonce).decode('utf-8'),
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
        'tag': base64.b64encode(tag).decode('utf-8')
    }

# Decrypt a message using AES
def decrypt_message(encrypted_data):
    aes_key = decrypt_aes_key(encrypted_data['encrypted_aes_key'])
    nonce = base64.b64decode(encrypted_data['nonce'])
    ciphertext = base64.b64decode(encrypted_data['ciphertext'])
    tag = base64.b64decode(encrypted_data['tag'])
    
    cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce=nonce)
    decrypted_message = cipher_aes.decrypt_and_verify(ciphertext, tag)
    
    return decrypted_message.decode('utf-8')

# Encrypt the AES key using RSA
def encrypt_aes_key(aes_key):
    public_key = load_public_key()
    cipher = PKCS1_OAEP.new(public_key, hashAlgo=SHA256)
    encrypted_aes_key = cipher.encrypt(aes_key)
    return base64.b64encode(encrypted_aes_key).decode('utf-8')

# Decrypt the AES key using RSA
def decrypt_aes_key(encrypted_aes_key_base64):
    private_key = load_private_key()
    cipher = PKCS1_OAEP.new(private_key, hashAlgo=SHA256)
    encrypted_aes_key = base64.b64decode(encrypted_aes_key_base64.encode())
    return cipher.decrypt(encrypted_aes_key)

# View to serve the public key to the frontend
def get_public_key(request):
    public_key = load_public_key()
    return HttpResponse(base64.b64encode(public_key.export_key()).decode('utf-8'), content_type="text/plain")

def get_private_key(request):
    private_key = load_private_key()
    return HttpResponse(base64.b64encode(private_key.export_key()).decode('utf-8'), content_type="text/plain")


