from django.urls import path
from .views import *
from .encryptor import get_public_key
urlpatterns = [
    path('', index, name='index'),
    path('get-private-key/', get_public_key, name='get_public_key'),
    
]
