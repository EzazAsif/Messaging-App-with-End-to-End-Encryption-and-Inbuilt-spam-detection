from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .spamdetector import *
# Create your views here.

def index(request):
    message1="Subject: 🎉 Congratulations! You've Won a Gift Card! 🎉 Dear Valued Customer,\nYou are the lucky winner of a $1000 Gift Card to your favorite store! 🛍️ \nTo claim your prize, please click the link below and fill out the form. Don't miss out on this incredible opportunity!👉\n Claim Your Gift Card Now! Hurry! This offer is only valid for the next 24 hours! \nBest regards, The Gift Card Team"
    message2="hello friend,how are you doing"
    message=message1
    pred=makepreds(message)
    return render(request, 'index.html',{'pred':pred,'message':message})
