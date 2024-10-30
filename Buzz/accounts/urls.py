from django.urls import path
from .views import *

urlpatterns = [
    path('', welcome, name='welcome'),
    path('login/', login, name='login'),
    path('signup/', signup, name='signup'),
    path('logout/', logout_view, name='logout'),
    path('editprofile/', edit_profile, name='editprofile'),
]
