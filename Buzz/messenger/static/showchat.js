$(document).ready(function() {
    setInterval(function() {
        $.ajax({
            type: 'GET',
            url: getMaxMessageId(),
            success: function(response) {
                //$("#conversation").empty();
                var allowedImageTypes = [".jpeg", ".jpg", ".png", ".gif", ".webp"];
                var allowedVideoTypes = [".mp4", ".webm", ".ogg"];
                var currentUserId = response.current_user_id;

                for (var key in response.messages) {
                    var message = response.messages[key];
                    var isReceiver = (message.sender === currentUserId);
                    var isSpam = message.spam;

                    // Check attachment type
                    var content = message.message || '';
                    if (message.attachment) {
                        var attachmentType = message.attachment.split('.').pop();

                        if (allowedImageTypes.some(type => message.attachment.endsWith(type))) {
                            content = `<a href="${message.attachment}"><img src="${message.attachment}" style="max-width: 200px; height: auto;" id="image"></a>`;
                        } else if (allowedVideoTypes.some(type => message.attachment.endsWith(type))) {
                            content = `<video controls style="max-width: 200px; height: auto;">
                                            <source src="${message.attachment}" type="video/${attachmentType}">
                                            Your browser does not support the video tag.
                                        </video>`;
                        } else {
                            content = `<a href="${message.attachment}">${message.attachment.split('/').pop()}</a>`;  // Display file name
                        }
                    }

                    // Convert the timestamp to a readable format
                    var date = new Date(message.time_sent * 1000);
                    var optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
                    var optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
                    var formattedDate = date.toLocaleDateString('en-US', optionsDate);
                    var formattedTime = date.toLocaleTimeString('en-US', optionsTime);
                    var timestamp = `${formattedDate}, ${formattedTime}`; // Combine date and time

                    console.log(timestamp);
                    var messageClass = !isReceiver ? "message-main-receiver" : "message-main-sender";
                    var spamClass = isSpam ? "spam" : "";

                    var temp = `
                    <div class="row message-body">
                        <div class="col-sm-12 ${messageClass}">
                            <div class="${!isReceiver ? 'receiver' : 'sender'} ${spamClass}">
                                <div id="mid${message.id}" class="message-text">${content}</div>
                                <span class="message-time pull-right">${timestamp}</span>
                            </div>
                        </div>
                    </div>`;

                    $("#conversation").append(temp).children().last().fadeIn(15000);  // Fade in effect;
                    $("#conversation").scrollTop($("#conversation")[0].scrollHeight);  // Auto-scroll
                    
                }

                $(".spam").click(function() {
                    $(this).toggleClass("spam-hidden");  // Toggle visibility on click
                });
            },
            error: function() {
                alert("Error");
            }
        });
        
    }, 500);
});
