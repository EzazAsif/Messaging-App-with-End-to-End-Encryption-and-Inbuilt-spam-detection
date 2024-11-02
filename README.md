# Messaging App with End-to-End Encryption and Spam Detection

## Overview

This is a secure messaging application built using Django. The app provides **end-to-end encryption** (E2EE) to ensure message confidentiality and integrates **Deep Learning**-based spam detection to filter out unwanted or harmful messages. The project is designed for privacy-conscious users who want a reliable and safe communication platform.

## Features

- **End-to-End Encryption (E2EE)**: Messages are encrypted before being sent and only decrypted by the intended recipient, ensuring that no third party can access the message content.
- **Spam Detection**: Uses a Deep Learning model to automatically detect and block spam messages from reaching the user.
- **User Authentication**: Secure user registration and login system using Django's built-in authentication framework.
- **Individual and Group Messaging**: Support for both one-on-one and group conversations.
- **Message History**: Users can view their encrypted message history, stored securely in the database.
  
## Technologies Used

- **Django**: Backend framework for managing server-side logic, user authentication, and routing.
- **Django ORM**: For database interaction and managing message storage.
- **Cryptography Libraries**: Implemented for securing message data during transmission.
- **Deep Learning (TensorFlow/Keras/PyTorch)**: Model for detecting spam in user messages.
- **HTML/CSS/JavaScript**: For building the frontend of the application.

## Project Structure

```bash
+---Buzz
ª   ª   .env
ª   ª   .rar
ª   ª   AdminPass.txt
ª   ª   db.sqlite3
ª   ª   manage.py
ª   ª   
ª   +---.vscode
ª   ª       launch.json
ª   ª       
ª   +---accounts
ª   ª   ª   admin.py
ª   ª   ª   apps.py
ª   ª   ª   logfuncs.py
ª   ª   ª   models.py
ª   ª   ª   tests.py
ª   ª   ª   urls.py
ª   ª   ª   views.py
ª   ª   ª   __init__.py
ª   ª   ª   
ª   ª   +---migrations
ª   ª   ª   ª   0001_initial.py
ª   ª   ª   ª   0002_remove_user_profileid.py
ª   ª   ª   ª   0003_user_private_key_user_public_key.py
ª   ª   ª   ª   0004_alter_user_picture.py
ª   ª   ª   ª   __init__.py
ª   ª   ª   ª   
ª   ª   ª   +---__pycache__
ª   ª   ª           
ª   ª   +---static
ª   ª   ª       login_and_signup.css
ª   ª   ª       welcome.css
ª   ª   ª       
ª   ª   +---templates
ª   ª   ª       editprofile.html
ª   ª   ª       login.html
ª   ª   ª       signup.html
ª   ª   ª       welcome.html
ª   ª   ª       
ª   ª   +---__pycache__
ª   ª           admin.cpython-312.pyc
ª   ª           
ª   +---Buzz
ª   ª   ª   asgi.py
ª   ª   ª   settings.py
ª   ª   ª   urls.py
ª   ª   ª   wsgi.py
ª   ª   ª   __init__.py
ª   ª   ª   
ª   ª   +---__pycache__
ª   ª           settings.cpython-312.pyc
ª   +---media
ª   ª   +---attachments
ª   ª   ª       855289-hd_1920_1080_25fps.mp4
ª   ª   ª       856787-hd_1920_1080_30fps.mp4
ª   ª   ª       download.jpg
ª   ª   ª       download_1.jpg
ª   ª   ª       
ª   ª   +---profilepictures
ª   ª           defaultpp.jpg
ª   ª           image_2024-10-31_204935243.png
ª   ª           image_2024-11-01_155542618.png
ª   ª           
ª   +---messenger
ª       ª   admin.py
ª       ª   apps.py
ª       ª   encryptor.py
ª       ª   models.py
ª       ª   msgfuncs.py
ª       ª   spamdetector.py
ª       ª   spam_classifier_model.pth
ª       ª   tests.py
ª       ª   tfidf_vectorizer.pkl
ª       ª   urls.py
ª       ª   views.py
ª       ª   __init__.py
ª       ª   
ª       +---migrations
ª       ª   ª   0001_initial.py
ª       ª   ª   0002_messages_spam.py
ª       ª   ª   0003_alter_messages_message.py
ª       ª   ª   0004_alter_messages_message.py
ª       ª   ª   0005_alter_messages_attachment.py
ª       ª   ª   __init__.py
ª       ª   ª   
ª       ª   +---__pycache__
ª       ª           0001_initial.cpython-312.pyc
ª       ª           0002_messages_spam.cpython-312.pyc
ª       ª           0003_alter_messages_message.cpython-312.pyc
ª       ª           0004_alter_messages_message.cpython-312.pyc
ª       ª           0005_alter_messages_attachment.cpython-312.pyc
ª       ª           __init__.cpython-312.pyc
ª       ª           
ª       +---static
ª       ª   ª   chat.css
ª       ª   ª   clickevents.js
ª       ª   ª   defaultpp.jpg
ª       ª   ª   encryptor.js
ª       ª   ª   showchat.js
ª       ª   ª   submitchat.js
ª       ª   ª   
ª       ª   +---images
ª       ª           Screenshot 2024-10-21 235706.png
ª       ª           Screenshot 2024-10-21 235836.png
ª       ª           Screenshot 2024-10-22 000105.png
ª       ª           Screenshot 2024-10-22 000157.png
ª       ª           Screenshot2024-10-21235758.png
ª       ª           Yellow paper plane 3d isometric icon.jpeg
ª       ª           
ª       +---templates
ª       ª       chat.html
ª       ª       index.html
ª       ª       
ª       +---__pycache__
ª               admin.cpython-312.pyc
ª  
