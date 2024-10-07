from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .spamdetector import *
# Create your views here.

def index(request):
    message="WINNER!! As a valued network customer you have been selected to receivea å£900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only."
    pred=makepreds(message)
    return render(request, 'index.html',{'pred':pred,'message':message})
