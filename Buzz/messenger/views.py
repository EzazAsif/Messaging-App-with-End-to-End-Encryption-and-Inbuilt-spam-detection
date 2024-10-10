from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .spamdetector import *
from .encryptor import encrypt_message,decrypt_message
# Create your views here.
@login_required
def index(request):
    message="Hello I am Rafid"
    if request.method=="POST":
        data=request.POST
        message1=data.get('message')
        if message1:
            message=message1
    pred=makepreds(message)
    encrypted_message=encrypt_message(message)
    decrypted_message=decrypt_message(encrypted_message)
    return render(request, 'index.html',{'pred':pred,'message':message,'encrypted_message':encrypted_message['encrypted_aes_key'],'decrypted_message':decrypted_message})
