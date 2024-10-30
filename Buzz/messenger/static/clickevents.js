// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Select the option tick element
  const optionTick = document.querySelector(".col-sm-1.col-xs-1.heading-dot.pull-right");
  
  // Add a click event listener to the option tick element
  optionTick.addEventListener("click", function() {
      // Select the option box element
      const optionBox = document.querySelector(".optionbox");

      // Toggle the visibility of the option box
      optionBox.style.visibility = optionBox.style.visibility === "hidden" ? "visible" : "hidden";
  });

  // Select the edit profile button
  const editProfileButton = document.querySelector("#editpp");
 
  // Add a click event listener to the edit profile button
  editProfileButton.addEventListener("click", function() {
      // Redirect to the specified URL when the button is clicked
      window.location.href = editprofileurl;
  });


  // Select the logout 
  const logoutButton = document.querySelector("#logout");
  
  // Add a click event listener to the logout button
  logoutButton.addEventListener("click", function() {
      // Redirect to the specified URL when the button is clicked
      window.location.href = redirectUrl;
  });

  // Select the previous messages link
  
  // jQuery function to handle click events
$(function () {
  // When the heading-compose element is clicked
  $(".heading-compose").click(function () {
      // Move the side-two element to the left
      $(".side-two").css({
          left: "0",
      });
  });

  // When the newMessage-back element is clicked
  $(".newMessage-back").click(function () {
      // Move the side-two element to the left by 100%
      $(".side-two").css({
          left: "-100%",
      });
  });
});

});

