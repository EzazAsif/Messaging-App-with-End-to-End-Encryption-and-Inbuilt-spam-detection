from django.http import JsonResponse
from messenger.models import Messages
from accounts.models import User
from django.db.models import Q
from django.contrib.auth.decorators import login_required

@login_required
def get_chat(request, id):
    messages = Messages.objects.filter(
        Q(sender=request.user, receiver_id=id) |
        Q(sender_id=id, receiver=request.user)
    ).order_by('time_sent')
    messages_html = list(messages.values('id', 'sender', 'receiver', 'message', 'attachment', 'time_sent'))
    
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
    return messages