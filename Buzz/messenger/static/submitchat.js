document.getElementById("attachmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    const formData = new FormData(this); // Capture form data
  
    fetch(this.action, { // Send data using Fetch API
      method: this.method,
      body: formData,
      headers: {
        "X-CSRFToken": getCookie("csrftoken") // Add CSRF token
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      document.getElementById("comment").value = "";
      document.getElementById("fileinputtt").value = "";
      
      const scrollableDiv = document.getElementById("conversation");
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      
      return response.json();
    })
    .then(data => {
      // Handle response data from Django
      console.log(data);
      
    })
    .catch(error => {
      // Handle errors
      console.error("Error:", error);
    });
  });
  
  // Function to get CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;

  }

  document.addEventListener("DOMContentLoaded", function() {
    
    const scrollableDiv = document.getElementById("conversation");

    
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
});