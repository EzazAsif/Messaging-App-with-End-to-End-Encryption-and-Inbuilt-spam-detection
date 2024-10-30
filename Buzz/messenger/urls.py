from django.urls import path
from .views import *
from .encryptor import get_public_key,get_private_key
from .msgfuncs import get_chat

urlpatterns = [
    path('test', test, name='test'),
    path('get-private-key/<int:id>', get_private_key, name='get-private-key'),
    path('get-public-key/<int:id>', get_public_key, name='get-public-key'),
    path('', chat, name='chat'),
    path('chat/<int:id>/', chat, name='chat'),
    path('get_chat/<int:id>', get_chat, name='get_chat'),
    
]
