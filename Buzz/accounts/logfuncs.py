from django.contrib import messages
from accounts.models import User


def checkvalidity(request, passw, rpassw, username,email):
    # Check if any of the required fields are None or empty
    if not passw or not rpassw or not username:
        messages.error(request, "All fields are required.")
        return False
    
    # Check if the password length is less than 8 characters
    if len(passw) < 8:
        messages.error(request, "Passwords must be at least 8 characters.")
        return False

    # Check if passwords do not match
    elif passw != rpassw:
        messages.error(request, "Passwords don't match.")
        return False
    
    # Check if the user already exists with the provided email
    elif User.objects.filter(username=username).exists():
        messages.error(request, "User already exists.")
        return False
    
    elif User.objects.filter(email=email).exists():
        messages.error(request, "Use differant Email.")
        return False
    
    return True
