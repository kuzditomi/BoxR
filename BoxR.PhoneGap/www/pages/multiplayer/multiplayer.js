function initMultiPlayer() {
    //BoxR.Manager.Client.IsSinglePlayer = false;
    $(".login input.username").keydown(function (event) {
        if (event.which == 13) {
            auth($('.login input.username').val(), $('.login input.password').val());
        }
        return false;
    });
    $(".login input.password").keydown(function (event) {
        if (event.which == 13) {
            auth();
        }
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
        console.log('connection successfull');
    }).fail(function () {
        console.log('connection fail');
        alert('Cannot connect to server, please try again later.');
    });
}

function auth() {
    var username = $('#username').val();
    var password = $('#password').val();
    //$("#loginprogress").show();
    BoxR.Manager.Hub.server.login(username, password).done(function (success) {
        if (success) {
            BoxR.Manager.UserName = success;
            loadUsers();
            //WinJS.Navigation.navigate("/pages/users/users.html");
        } else {
            alert('Wrong credentials!');
            //displayError(WinJS.Resources.getString("login_auth_error").value);
        }

        //$("#loginprogress").hide();
    });
}

function register() {
    var username = $("#regusername").val();
    var password = $("#regpassword").val();
    var passwordAgain = $("#confirmpassword").val();

    if (!username) {
        alert('Please provide a username!');
        return;
    }
    if (!password) {
        alert('Please provide a password!');
        return;
    }

    if (password != passwordAgain) {
        alert('Passwords does not match!');
        return;
    }
    BoxR.Manager.Hub.server.register(username, password).done(function (message) {
        if (message == "true") {
            // copied from login page js
            BoxR.Manager.Hub.server.login(username, password).done(function (success) {
                if (success) {
                    BoxR.Manager.UserName = success;
                    loadUsers();
                } else {
                    alert('Wrong login credentials!');
                }
            });
        }
        else {
            alert(message);
        }
    }).fail(function (message) {
        alert(message);
    });
}