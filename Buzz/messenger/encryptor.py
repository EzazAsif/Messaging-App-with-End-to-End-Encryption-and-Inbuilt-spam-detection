# views.py (Django)
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
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

# Encrypt a message using the public key (used by backend to send to frontend)
def encrypt_message(message):
    public_key = load_public_key()
    cipher = PKCS1_OAEP.new(public_key, hashAlgo=SHA256)
    encrypted_message = cipher.encrypt(message.encode())
    return base64.b64encode(encrypted_message).decode('utf-8')

# Decrypt the message using the private key (used to decrypt messages from the frontend)
def decrypt_message(encrypted_message_base64):
    private_key = load_private_key()
    cipher = PKCS1_OAEP.new(private_key, hashAlgo=SHA256)
    decrypted_message = cipher.decrypt(base64.b64decode(encrypted_message_base64))
    return decrypted_message.decode('utf-8')

# View to serve the public key to the frontend
def get_public_key(request):
    public_key = load_public_key()
    return HttpResponse(base64.b64encode(public_key.export_key()).decode('utf-8'), content_type="text/plain")

