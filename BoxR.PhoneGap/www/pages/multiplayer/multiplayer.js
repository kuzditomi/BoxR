function initMultiPlayer() {
    BoxR.Manager.Client.IsSinglePlayer = false;
    $(".login input.username").keydown(function (event) {
        $(".error").html("&nbsp;");
        if (event.which == 13) {
            launchformauth($('.login input.username').val(), $('.login input.password').val());
            return false;
        }
    });
    $(".login input.password").keydown(function (event) {
        $(".error").html("&nbsp;");
        if (event.which == 13) {
            launchformauth($('.login input.username').val(), $('.login input.password').val());
            return false;
        }
    });
}

var my_client_id = fbclientid, // YOUR APP ID
    my_secret = fbsecret, // YOUR APP SECRET 
    my_redirect_uri = "https://www.facebook.com/connect/login_success.html", // LEAVE THIS
    my_type ="user_agent", my_display = "touch"; // LEAVE THIS

var facebook_token = "fbToken"; // OUR TOKEN KEEPER
var ref; //IN APP BROWSER REFERENCE

// FACEBOOK
var Facebook = {
    init: function () {
        // Begin Authorization
        var authorize_url = "https://www.facebook.com/dialog/oauth?";
        authorize_url += "client_id=" + my_client_id;
        authorize_url += "&redirect_uri=" + my_redirect_uri;
        authorize_url += "&display=" + my_display;
        authorize_url += "&scope=publish_stream";

        //CALL IN APP BROWSER WITH THE LINK
        ref = window.open(authorize_url, '_blank', 'location=no');

        ref.addEventListener('loadstart', function (event) {

            Facebook.facebookLocChanged(event.url);

        });

    },
    facebookLocChanged: function (loc) {

        if (loc.indexOf("code=") >= 1) {

            //CLOSE INAPPBROWSER AND NAVIGATE TO INDEX
            ref.close();

            //THIS IS MEANT TO BE DONE ON SERVER SIDE TO PROTECT CLIENT SECRET
            var codeUrl = 'https://graph.facebook.com/oauth/access_token?client_id=' + my_client_id + '&client_secret=' + my_secret + '&redirect_uri=' + my_redirect_uri + '&code=' + loc.split("=")[1];
            console.log('CODE_URL::' + codeUrl);
            $.ajax({
                url: codeUrl,
                data: {},
                type: 'POST',
                async: false,
                cache: false,
                success: function (data, status) {
                    //WE STORE THE TOKEN HERE
                    localStorage.setItem(facebook_token, data.split('=')[1].split('&')[0]);
                },
                error: function () {
                    alert("Unknown error Occured");
                }
            });
        }
    }
}