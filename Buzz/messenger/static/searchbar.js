$(document).ready(() => {
    // Capture all elements with the class 'clickable-div' in a constant array
    const clickableDivs = Array.from(document.getElementsByClassName("clickable-div1"));
    const clickableDivs2 = Array.from(document.getElementsByClassName("clickable-div2"));

    $("#searchText").keyup(function () {
    
        // Get the search term from the input field
        const searchTerm = $(this).val().toLowerCase();
        
        // Filter the stored array of clickableDivs based on the search term
        const matchingDivs = clickableDivs.filter(div => {
          const nameMeta = div.querySelector(".name-meta");
          return nameMeta && nameMeta.innerHTML.toLowerCase().includes(searchTerm);
        });
      
        // Update .sideBar with only matching divs
        $(".sideBar").empty().append(matchingDivs);
      
        // Output the matching divs to the console for debugging
        
      });
      
      $("#composeText").keyup(function () {
          
        // Get the search term from the input field
        const searchTerm = $(this).val().toLowerCase();
        
        // Filter the stored array of clickableDivs based on the search term
        const matchingDivs = clickableDivs2.filter(div => {
          const nameMeta = div.querySelector(".name-meta");
          return nameMeta && nameMeta.innerHTML.toLowerCase().includes(searchTerm);
        });
      
        // Update .sideBar with only matching divs
        $(".compose-sideBar").empty().append(matchingDivs);
      
        // Output the matching divs to the console for debugging
        
      });

});
  
