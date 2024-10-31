from django.http import JsonResponse
from messenger.models import Messages
from accounts.models import User
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from .encryptor import decrypt_message

@login_required
def get_chat(request, id):
    maxid = request.GET.get('maxid', None)
    messages = Messages.objects.filter(
        Q(sender=request.user, receiver_id=id) |
        Q(sender_id=id, receiver=request.user)
    ).order_by('time_sent')
    #messages=decrypt_messages(messages)
    # Convert maxid to an integer for comparison if it is provided
    if (maxid is not None)and (maxid != -1):
        try:
            maxid = int(maxid)
            messages = messages.filter(id__gt=maxid)  # Use __gt to filter ids greater than maxid
        except ValueError:
            maxid = None  # If conversion fails, set maxid to None
    messages_html = list(messages.values('id', 'sender', 'receiver', 'message', 'attachment', 'time_sent','spam'))
    
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
    #messages=decrypt_messages(messages)
    return messages


def decrypt_messages(messages):
    decrypted_messages = []  # List to store decrypted messages
    for message in messages:
        if message.message:
            decrypted_message = decrypt_message(message.message, message.sender.id)
            decrypted_messages.append(decrypted_message)  # Append decrypted message to the list
        else:
            decrypted_messages.append(None)  # Append None if the message is empty
    return decrypted_messages  # Return the list of decrypted messages
