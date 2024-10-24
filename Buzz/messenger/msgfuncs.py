from django.http import JsonResponse
from messenger.models import Messages
from accounts.models import User


def get_chat(request,id):
    messages = Messages.objects.filter(sender=request.user.id,receiver=id)|Messages.objects.filter(sender=id,receiver=request.user.id)
    messages_html = list(messages.values())
          
    return JsonResponse({'messages': messages_html,'id':id})


def chat_user(id):
    messages = Messages.objects.filter(receiver=uid)|Messages.objects.filter(sender=id)
    id_array = [message.sender for message in messages] + [message.receiver for message in messages]
    id_array = list(set(id_array))
    if id in id_array:
      id_array.remove(id)
    users = User.objects.filter(id__in=id_array)
    return(users)
