$(document).ready(function() {
    setInterval(function() {
        $.ajax({
            type: 'GET',
            url: chatUrl,
            success: function(response) {
                console.log(response);
                $("#conversation").empty();
                var allowedImageTypes = [".jpeg", ".jpg", ".png", ".gif", ".webp"];
                var currentUserId = response.current_user_id;

                response.messages.forEach(function(message) {
                    var isReceiver = (parseInt(message.sender.id) === parseInt(currentUserId));
                    var content = message.message || '';

                    // Check attachment type if it exists
                    if (message.attachment) {
                        if (allowedImageTypes.some(type => message.attachment.endsWith(type))) {
                            content += `<a href="/media/${message.attachment}"><img src="/media/${message.attachment}" id="image"></a>`;
                        } else {
                            content += `<a href="/media/${message.attachment}">${message.attachment}</a>`;
                        }
                    }

                    // Message template
                    var temp = isReceiver ?
                        `<div class="row message-body">
                            <div class="col-sm-12 message-main-receiver">
                                <div class="receiver">
                                    <div class="message-text">${content}</div>
                                    <span class="message-time pull-right">${message.time_sent}</span>
                                </div>
                            </div>
                        </div>` :
                        `<div class="row message-body">
                            <div class="col-sm-12 message-main-sender">
                                <div class="sender">
                                    <div class="message-text">${content}</div>
                                    <span class="message-time pull-right">${message.time_sent}</span>
                                </div>
                            </div>
                        </div>`;

                    $("#conversation").append(temp);
                });

                // Show Previous Message link
                $("#conversation").append(`
                    <div class="row message-previous">
                        <div class="col-sm-12 previous" id="previous">
                            <a id="ankitjain28" name="20">Show Previous Message!</a>
                        </div>
                    </div>
                `);
            },
            error: function() {
                alert("Error");
            }
        });
    }, 200000); // Adjusted interval to every 2 seconds for better performance
});
