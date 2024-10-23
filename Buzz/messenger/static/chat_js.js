// Store chat history for each user
const chatHistory = {
  'User 1': [
    { text: 'Hey there!', time: '09:05', type: 'received' },
    { text: 'How are you?', time: '09:07', type: 'sent' }
  ],
  'User 2': [
    { text: 'Hello, what\'s up?', time: '09:10', type: 'received' }
  ],
  'User 3': [
    { text: 'Good morning!', time: '09:20', type: 'received' }
  ],
  'User 4': [
    { text: 'See you soon!', time: '09:30', type: 'received' }
  ]
};

// Function to send a message
function sendMessage() {
  const input = document.getElementById('messageInput');
  const messageText = input.value;
  const currentUsername = document.getElementById('chatHeaderName').textContent;

  if (messageText === '') return;

  const chatMessages = document.querySelector('.chat-messages');
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'sent');
  
  messageElement.innerHTML = `
      <p>${messageText}</p>
      <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;

  chatMessages.appendChild(messageElement);
  input.value = '';

  // Scroll to the bottom of the chat window
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Store the sent message in the chat history for the current user
  if (!chatHistory[currentUsername]) {
    chatHistory[currentUsername] = [];
  }
  chatHistory[currentUsername].push({ text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'sent' });
}

// Function to search users in the sidebar
function searchUsers() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const chatItems = document.getElementsByClassName('chat-item');

  for (let i = 0; i < chatItems.length; i++) {
    const chatInfo = chatItems[i].getElementsByClassName('chat-info')[0];
    const username = chatInfo.getElementsByTagName('h4')[0].textContent.toLowerCase();

    if (username.indexOf(filter) > -1) {
      chatItems[i].style.display = "";
    } else {
      chatItems[i].style.display = "none";
    }
  }
}

// Function to select a user and update the chat header
function selectUser(username, imageUrl) {
  document.getElementById('chatHeaderName').textContent = username;
  document.getElementById('chatHeaderImage').src = imageUrl;

  // Clear current chat messages
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';

  // Load chat history for the selected user
  if (chatHistory[username]) {
    chatHistory[username].forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', message.type);
      
      messageElement.innerHTML = `
          <p>${message.text}</p>
          <span class="time">${message.time}</span>
      `;

      chatMessages.appendChild(messageElement);
    });
  } else {
    // If no chat history exists for the user, initialize an empty chat
    chatMessages.innerHTML = `
      <div class="message received">
        <p>Hello ${username}!</p>
        <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `;
  }
}

// Profile Modal Trigger on Profile Image Click
document.querySelector('.profile').addEventListener('click', () => {
  $('#profileModal').modal('show');
});

// Profile picture update button event listener
document.getElementById('updateProfilePicBtn').addEventListener('click', function () {
  const fileInput = document.getElementById('profilePhotoInput');
  fileInput.click(); // Simulate file input click to open file dialog
});

// Change the profile image when a file is selected
document.getElementById('profilePhotoInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          document.getElementById('profileImage').src = e.target.result; // Update the profile image
          document.getElementById('sidebarProfileImage').src = e.target.result; // Update sidebar profile pic
      };
      reader.readAsDataURL(file);
  }
});

// Add event listener to the attach button to trigger the file input click
document.getElementById('attachBtn').addEventListener('click', function() {
  document.getElementById('fileInput').click(); // Open file dialog
});

// Add event listener to handle file selection
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
      // Display the file name in the chat for now (you can upload or send it in chat)
      const chatMessages = document.getElementById('chatMessages');
      const fileMessage = document.createElement('div');
      fileMessage.classList.add('message', 'sent');

      fileMessage.innerHTML = `
          <p>File attached: ${file.name}</p>
          <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;

      chatMessages.appendChild(fileMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

      console.log(`File selected: ${file.name}`);
  }
});


// Function to save profile changes and update sidebar
function saveProfileChanges() {
  const username = document.getElementById('username').value; // Get the updated username
  const email = document.getElementById('email').value;
  const dob = document.getElementById('dob').value;

  // Log the updated details (optional)
  console.log(`Profile updated! Username: ${username}, Email: ${email}, DOB: ${dob}`);

  // Update the sidebar username dynamically
  document.getElementById('sidebarUsername').textContent = username;

  // Close the modal after saving changes
  $('#profileModal').modal('hide');
}



