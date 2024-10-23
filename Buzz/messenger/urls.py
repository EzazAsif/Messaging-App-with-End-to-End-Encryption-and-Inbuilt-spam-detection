from django.urls import path
from .views import *
from .encryptor import get_public_key,get_private_key
urlpatterns = [
    path('test', test, name='test'),
    path('get-private-key/', get_private_key, name='get-private-key'),
    path('get-public-key/', get_public_key, name='get-public-key'),
    path('', chat, name='chat'),
    path('chat/', chat, name='chat'),
    
]
