function initMultiPlayer() {
    //BoxR.Manager.Client.IsSinglePlayer = false;
    $(".login input.username").keydown(function (event) {
        $(".error").html("&nbsp;");
        if (event.which == 13) {
            auth($('.login input.username').val(), $('.login input.password').val());
            return false;
        }
    });
    $(".login input.password").keydown(function (event) {
        $(".error").html("&nbsp;");
        if (event.which == 13) {
            auth($('.login input.username').val(), $('.login input.password').val());
            return false;
        }
    });
    $('.login form').submit(function() {
        auth($('.login input.username').val(), $('.login input.password').val());
        return false;
    });
    
    var connection = $.connection.hub;
    connection.url = 'http://boxr.azurewebsites.net/signalr';
    BoxR.Manager.Connection = connection;

    // create hub and set the static Hub
    var hub = $.connection.game;
    BoxR.Manager.Hub = hub;
    
    // create server and set the static Server
    var server = new BoxR.Server();
    BoxR.Manager.Server = server;

    BoxR.Manager.Connection.start(function () {
        console.log('connection started!');
    }).done(function () {
        $('#waitDiv').hide();
    }).fail(function () {
        //alert('ok');
        //notifyConnectionError();
    });
}

function auth(username, password) {
    $("#loginprogress").show();
    BoxR.Manager.Hub.server.login(username, password).done(function (success) {
        if (success) {
            BoxR.Manager.UserName = success;
            loadUsers();
            //WinJS.Navigation.navigate("/pages/users/users.html");
        } else {
            //displayError(WinJS.Resources.getString("login_auth_error").value);
        }

        //$("#loginprogress").hide();
    });
}