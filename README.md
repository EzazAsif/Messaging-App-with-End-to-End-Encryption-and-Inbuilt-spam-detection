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
Messaging-App-with-End-to-End-Encryption-and-Inbuilt-spam-detection/
│
├── Buzz/                               # Main Django app
│   ├── migrations/                     # Database migrations
│   ├── models.py                       # Defines the database models (Message, User, etc.)
│   ├── views.py                        # Handles user requests (sending/receiving messages)
│   ├── urls.py                         # URL routing for the app
│   ├── forms.py                        # User forms for login/register
│   └── templates/                      # HTML templates
│
├── encryption/                         # Folder containing encryption utilities
│   ├── encrypt.py                      # Handles message encryption and decryption
│
├── spam_detection/                     # Folder containing spam detection model
│   ├── spam_classifier.py              # Spam detection model and prediction logic
│
├── requirements.txt                    # Python dependencies for the project
└── README.md                           # Project documentation
