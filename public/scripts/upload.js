$(document).ready(function() {

    status('Choose a file :)');

    // Check to see when a user has selected a file                                                                                                                
    var timerId;
    timerId = setInterval(function() {
        if ($('#userSongInput').val() !== '') {
            clearInterval(timerId);
            console.log("Upload pressed");
            //$('#uploadForm').submit();
        }
    }, 500);

    $('#uploadForm').submit(function() {
        if ($('#userSongInput').val() !== '') {
            status('uploading the file ...');

            $(this).ajaxSubmit({

                error: function(xhr) {
                    status('Error: ' + xhr.status);
                },

                success: function(response) {
                    status('Success!');
                },

                statusCode: {
                    200: function() {
                        status('Success, file uploaded to server!');
                    },
                    500: function() {
                        status('File failed to upload!');
                    }
                }
            });
        }
        else {
            status('You have not chose a file :(');
        }


        // Have to stop the form from submitting and causing                                                                                                       
        // a page refresh - don't forget this                                                                                                                      
        return false;
    });

    function status(message) {
        $('#status').text(message);
    }
});