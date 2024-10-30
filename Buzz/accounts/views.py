from django.shortcuts import render,redirect
from .models import User
from .logfuncs import *
from django.contrib.auth import authenticate, login as auth_login,logout
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required

# Create your views here.

def welcome(request):
    return render(request ,"welcome.html")

def login(request):
    if request.method == "POST":
        data = request.POST
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "User does not exist")
            return redirect('/accounts/login/')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            auth_login(request, user)  
            messages.success(request, "Successfully logged in")
            return redirect('/')
        else:
            messages.error(request, "Invalid password")
            return redirect('/accounts/login/')
    
    return render(request, "login.html")


def signup(request):
    if request.method=="POST":
        data=request.POST
        Firstname=data.get('fname')
        Lastname=data.get('lname')
        Email=data.get('email')
        password=data.get('passw')
        rpassword=data.get('rpassw')
        username=f"{Firstname} {Lastname}"
        if checkvalidity(request,passw=password,rpassw=rpassword,username=username,email=Email):
            user = User.objects.create(username=Email, email=Email, first_name=Firstname, last_name=Lastname, password=make_password(password))
            user.save()
            messages.success(request, "Registration successful. You can now log in.")
            return redirect('/accounts/login/')
        
    return render(request,"signup.html")

@login_required
def edit_profile(request):
    user=User.objects.get(id=request.user.id)
    if request.method=="POST":
        data=request.POST
        Firstname=data.get('FirstName')
        Lastname=data.get('LastName')
        Email=data.get('email')
        password=data.get('psw')
        rpassword=data.get('psw-repeat')
        picture = request.FILES.get('editpp')
        if(password and rpassword ):
            if( password==rpassword):
                user.set_password(password)
            else:
                messages.error(request,"Passwords don't match")  
        if Firstname:
            user.first_name=Firstname
        if Lastname:
            user.last_name=Lastname
        if Email:
            user.email=Email
        if picture:
            user.picture=picture
            user.save()
            messages.success(request, "Changes Succesful")
        return redirect('/')
    
    return render(request,"editprofile.html",context={'users':user})


def logout_view(request):
    logout(request)
    messages.success(request, "Successfully logged out")
    return redirect('/')