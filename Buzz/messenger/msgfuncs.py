from django.http import JsonResponse
from messenger.models import Messages
from accounts.models import User
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from .encryptor import decrypt_message
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.utils.dateformat import format


@login_required
def get_chat(request, id):
    maxid = request.GET.get('maxid', None)
    messages = Messages.objects.filter(
        Q(sender=request.user, receiver_id=id) |
        Q(sender_id=id, receiver=request.user)
    ).order_by('time_sent')
    if maxid is not None:
            maxid = int(maxid)
            messages = messages.filter(id__gt=maxid)  # Use __gt to filter ids greater than maxid
        
    encmessages=decrypt_messages(messages)
    messages_html = []
    for message in encmessages:
        messages_html.append({
            'id': message.id,
            'sender': message.sender.id,  # Use .id to get sender ID
            'receiver': message.receiver.id,  # Use .id to get receiver ID
            'message': message.message,  # This should now be a string after decryption
            'attachment': message.attachment.url if message.attachment else None,
            'time_sent': message.time_sent.timestamp(),  # Convert to Unix timestamp
            'spam': message.spam,
        })
    
    return JsonResponse({
        'messages': messages_html,
        'current_user_id': request.user.id,  # Include current user's ID
        'chat_user_id': id  # Chat user ID
    })


def chat_user(user):
    messages = Messages.objects.filter(receiver=user)|Messages.objects.filter(sender=user)
    id_array = [message.sender.id for message in messages] + [message.receiver.id for message in messages]
    id_array = list(set(id_array))
    if user.id in id_array:
      id_array.remove(user.id)
    users = User.objects.filter(id__in=id_array)
    return(users)


@login_required
def get_chat1(request, id):
    messages = Messages.objects.filter(
        Q(sender=request.user, receiver_id=id) |
        Q(sender_id=id, receiver=request.user.id)
    ).order_by('time_sent') 
    messages=decrypt_messages(messages)
    return messages


def decrypt_messages(messages):
    if messages:
        for message in messages:
            if message.message:       
                
                message.message = decrypt_message(message.message, message.sender.id)   
            else:
                message.message = ""

    return messages