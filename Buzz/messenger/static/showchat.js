$(document).ready(function() {
    setInterval(function() {
        $.ajax({
            type: 'GET',
            url: getMaxMessageId(),
            success: function(response) {
                //$("#conversation").empty();
                var allowedImageTypes = [".jpeg", ".jpg", ".png", ".gif", ".webp"];
                var currentUserId = response.current_user_id;

                for (var key in response.messages) {
                    var message = response.messages[key];
                    var isReceiver = (message.sender === currentUserId);
                    var isSpam = message.spam;

                    // Check attachment type
                    var content = message.message || '';
                    if (message.attachment) {
                        if (allowedImageTypes.some(type => message.attachment.endsWith(type))) {
                            content += `<a href="/media/${message.attachment}"><img src="/media/${message.attachment}" id="image"></a>`;
                        } else {
                            content += `<a href="/media/${message.attachment}">${message.attachment}</a>`;
                        }
                    }

                    var messageClass = !isReceiver ? "message-main-receiver" : "message-main-sender";
                    var spamClass = isSpam ? "spam" : "";

                    var temp = `
                    <div class="row message-body ${spamClass}">
                        <div class="col-sm-12 ${messageClass}">
                            <div class="${!isReceiver ? 'receiver' : 'sender'}">
                                <div id="mid${message.id}" class="message-text">${content}</div>
                                <span class="message-time pull-right">${message.time_sent}</span>
                            </div>
                        </div>
                    </div>`;

                    $("#conversation").append(temp).children().last().fadeIn(15000);  // Fade in effect;
                    $("conversation").scrollTop = conversation.scrollHeight;
                    
                }

                $(".spam").click(function() {
                    $(this).toggleClass("spam-hidden");  // Toggle visibility on click
                });
            },
            error: function() {
                alert("Error");
            }
        });
        
    }, 2000);
});
