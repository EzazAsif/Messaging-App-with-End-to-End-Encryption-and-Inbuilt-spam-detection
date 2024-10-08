from django.shortcuts import render
from .models import User
# Create your views here.

def welcome(request):
    return render(request ,"welcome.html")

def login(request):
    return render(request ,"login.html")

def signup(request):
    return render(request ,"signup.html")