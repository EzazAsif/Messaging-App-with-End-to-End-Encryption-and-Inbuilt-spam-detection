from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .spamdetector import *
from .encryptor import encrypt_message,decrypt_message
from .models import Messages
from .msgfuncs import chat_user,get_chat
from django.http import JsonResponse

User=get_user_model()

# Create your views here.
@login_required
def test(request):
    message="Hello I am Rafid"
    if request.method=="POST":
        data=request.POST
        message1=data.get('message')
        if message1:
            message=message1
    pred=makepreds(message)
    encrypted_message=encrypt_message(message,request.user.id)
    decrypted_message=decrypt_message(encrypted_message,request.user.id)
    return render(request, 'index.html',{'pred':pred,'message':message,'encrypted_message':encrypted_message['encrypted_aes_key'],'decrypted_message':decrypted_message})

@login_required
def chat(request, id=None):
    user = User.objects.exclude(username=request.user.username)
    chatusers = chat_user(request.user)
    if id:
        chatuser = User.objects.get(id=id)
    elif chatusers:
        chatuser = chatusers[0]
        id = chatusers[0].id
    else:
        chatuser = user[0]
        id = user[0].id    

    if request.method == "POST":
        message = request.POST.get('message')
        picture = request.FILES.get('picturefile')
        if message or picture:
            if message:
                Messages.objects.create(sender=request.user, message=message, receiver=chatuser)
            if picture:
                Messages.objects.create(sender=request.user, attachment=picture, receiver=chatuser)
            # Return JSON response for success
            return JsonResponse({'status': 'success'}, status=200)
        # No message or picture provided
        return JsonResponse({'status': 'no_content'}, status=204)
    
    return render(request, "chat.html", context={'users': user, 'chatuser': chatuser, 'chatusers': chatusers})
