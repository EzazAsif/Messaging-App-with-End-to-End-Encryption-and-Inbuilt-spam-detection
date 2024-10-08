from django.shortcuts import render,redirect
from .models import User
from .logfuncs import *
from django.contrib import messages
# Create your views here.

def welcome(request):
    return render(request ,"welcome.html")

def login(request):
    return render(request ,"login.html")

def signup(request):
    if request.method=="POST":
        data=request.POST
        Firstname=data.get('fname')
        Lastname=data.get('lname')
        Email=data.get('email')
        password=data.get('passw')
        rpassword=data.get('rpassw')
        username=f"{Firstname} {Lastname}"
        if checkvalidity(request,password,rpassword,username,Email):
            user = User.objects.create(username=username, email=Email, first_name=Firstname, last_name=Lastname)
            user.set_password(password) 
            user.save()
            messages.success(request, "Registration successful. You can now log in.")
            return redirect('/accounts/login/')
    return render(request ,"signup.html")