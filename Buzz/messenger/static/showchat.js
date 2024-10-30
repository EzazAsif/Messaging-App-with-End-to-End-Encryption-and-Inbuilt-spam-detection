$(document).ready(function(){
          
    setInterval(function(){
        $.ajax({
            type: 'GET',
            url: chatUrl,
            success: function(response){
                console.log(response);
                $("#conversation").empty();
                var allowedImageTypes = [".jpeg", ".jpg", ".png", ".gif",".webp"];

                for(var key in response.messages){
                  var temp;
                  id=response.user.id;
                  if(response.messages[key].sender.id==id){
                  
                    if(response.messages[key].message){
                     temp=`<div class="row message-body">
                      <div class="col-sm-12 message-main-receiver">
                        <div class="receiver">
                              <div class="message-text">${response.messages[key].message} </div>
                              <span class="message-time pull-right"> ${response.messages[key].time_sent} </span>
                          </div>
                      </div>
                  </div>`
                    }
                    else{
                      var content;
                      if(allowedImageTypes.some(type => response.messages[key].attachment.endsWith(type))){
                        content=`<a href="/media/${response.messages[key].attachment}"><img src="/media/${response.messages[key].attachment}"  id="image"> </a>`;
                      }
                      else{
                        content=`<a href="/media/${response.messages[key].attachment}">${response.messages[key].attachment} </a>`;
                      }
                      temp=`<div class="row message-body">
                      <div class="col-sm-12 message-main-receiver">
                        <div class="receiver">
                        <div class="message-text">${content}</div>
                              <span class="message-time pull-right"> ${response.messages[key].time_sent} </span>
                          </div>
                      </div>
                  </div>`;
                    }
                  } 
                 else{
                  if(response.messages[key].message){
                   temp=`<div class="row message-body">
                    <div class="col-sm-12 message-main-sender">
                        <div class="sender">
                            <div class="message-text">${response.messages[key].message} </div>
                            <span class="message-time pull-right"> ${response.messages[key].time_sent} </span>
                        </div>
                    </div>
                </div>`
                  }
                  else{
                    var content;
                    if(allowedImageTypes.some(type => response.messages[key].attachment.endsWith(type))){
                      content=`<a href="/media/${response.messages[key].attachment}"><img src="/media/${response.messages[key].attachment}"  id="image"> </a>`;
                    }
                    else{
                      content=`<a href="/media/${response.messages[key].attachment}">${response.messages[key].attachment} </a>`;
                    }
                    temp=`<div class="row message-body">
                    <div class="col-sm-12 message-main-sender">
                        <div class="sender">
                        <div class="message-text">${content}</div>
                            <span class="message-time pull-right"> ${response.messages[key].time_sent} </span>
                        </div>
                    </div>
                </div>`
                  }
                 }       
                  $("#conversation").append(temp);
                }
               temp1= `<div class="row message-previous">
              <div class="col-sm-12 previous" id="previous">
                <a  id="ankitjain28" name="20">
                  Show Previous Message!
                </a>
              </div>
            </div>`;
            $("#conversation").append(temp1);
            },
            error: function(response){
                alert("Error");
            }
        });
    }, 100); // Added comma and corrected timing value
});