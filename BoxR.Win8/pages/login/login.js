/// <reference path="///LiveSDKHTML/js/wl.js" />

(function () {
    "use strict";
    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            BoxR.Manager.Client.IsSinglePlayer = false;
            
            $('#regbtn').click(function() {
                WinJS.Navigation.navigate("/pages/register/register.html");
            });
            $(".username").focus();

            $(".username").keydown(function (event) {
                $(".error").html("&nbsp;");
                if (event.which == 13) {
                    launchformauth($('input.username').val(), $('input.password').val());
                }
            });
            $(".password").keydown(function (event) {
                $(".error").html("&nbsp;");
                if (event.which == 13) {
                    launchformauth($('input.username').val(), $('input.password').val());
                }
            });
            $(".fblogin").click(function () {
                launchFacebookWebAuth();
            });
            $(".mslogin").click(function () {
                WL.init();
                authenticate();
            });
            
            $('#back').on('click', function () {
                WinJS.Navigation.back();
            });


            var connection = $.connection.hub;
            connection.url = localSettings.values["connectionURL"] + 'signalr';
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
                notifyConnectionError();
                //WinJS.Navigation.navigate("/pages/login/login.html");
            });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
    /********* oauth ************/
    function launchFacebookWebAuth() {
        $("#progressRing").show();
        var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";

        var clientID = localSettings.values.fbclientid;

        var callbackURL = 'https://www.facebook.com/connect/login_success.html';

        var authURL = facebookURL + clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&display=popup&response_type=token";

        var startURI = new Windows.Foundation.Uri(authURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                switch (result.responseStatus) {
                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.success:
                        var fragment = Windows.Foundation.Uri(result.responseData).fragment;
                        if (fragment.indexOf("#access_token=") != -1) {
                            var token = fragment.substring(
                                new String("#access_token=").length,
                                fragment.indexOf("&expires_in="));

                            BoxR.Manager.Hub.server.loginExternal('facebook', token).done(function (loginresult) {
                                switch (loginresult.Result) {
                                    case 0: // Success
                                        BoxR.Manager.UserName = loginresult.UserName;
                                        WinJS.Navigation.navigate("/pages/users/users.html");
                                        break;
                                    case 1: // Need to choose nickname
                                        WinJS.Navigation.navigate("/pages/choosenick/choosenick.html",{ provider:"facebook" });
                                        break;
                                    case 2: // Error
                                        displayError("Error with facebook authentication.");
                                        break;
                                }
                            });
                        }
                        else {
                            displayError("Error with facebook authentication.");
                        }
                        break;
                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.userCancel:
                        //displayError("User cancelled the authentication to Facebook.");
                        break;
                    case Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp:
                        displayError("Error with facebook authentication..");
                        break;
                }
            }, function (err) {
                displayError("Error with facebook authentication.", err.message);
            });
        $("#progressRing").hide();
    }
    /************ form auth ***************/
    function launchformauth(username, password) {
        $("#progressRing").show();
        BoxR.Manager.Hub.server.login(username, password).done(function (success) {
            if (success) {
                BoxR.Manager.UserName = success;
                WinJS.Navigation.navigate("/pages/users/users.html");
            } else {
                displayError("Error with authentication.");
            }
            
            $("#progressRing").hide();
        });
    }
   
    /********** live auth *************/
    var session = null;
    
    function logout() {
        return new WinJS.Promise(function (complete) {
            WL.getLoginStatus().then(function () {
                if (WL.canLogout()) {
                    WL.logout(complete);
                }
                else {
                    complete();
                }
            });
        });
    };
    
    function login() {
        $("#progressRing").show();
        return new WinJS.Promise(function (complete) {
            WL.login({ scope: "wl.basic" }).then(function (result) {
                var token = result.session.access_token;
                BoxR.Manager.Hub.server.loginExternal('microsoft', token).done(function (loginresult) {
                    switch (loginresult.Result) {
                        case 0: // Success
                            BoxR.Manager.UserName = loginresult.UserName;
                            WinJS.Navigation.navigate("/pages/users/users.html");
                            break;
                        case 1: // Need to choose nickname
                            WinJS.Navigation.navigate("/pages/choosenick/choosenick.html", { provider: "microsoft" });
                            break;
                        case 2: // Error
                            displayError("Error with microsoft authentication.");
                            break;
                    }
                });
                $("#progressRing").hide();
            }, function (error) {
                session = null;
                var dialog = new Windows.UI.Popups.MessageDialog("You must log in.", "Login Required");
                dialog.showAsync().done(complete);
                $("#progressRing").hide();
            });
        });
    }

    function authenticate() {
        // Force a logout to make it easier to test with multiple Microsoft Accounts
        logout().then(login);
    }
    
})();
function register() {
    var username = $(".registerform input.username").val();
    var password = $(".registerform input.password").val();
    var passwordAgain = $("input.confirm-password").val();

    if (!username) {
        displayError("Please give your choosen username.");
        return;
    }
    if (!password) {
        displayError("Please give your choosen password.");
        return;
    }

    if (password != passwordAgain) {
        displayError("Given passwords does not match.");
        return;
    }

    BoxR.Manager.Hub.server.register(username, password).done(function (message) {
        if (message == "true") {
            // copied from login page js
            BoxR.Manager.Hub.server.login(username, password).done(function (success) {
                if (success) {
                    BoxR.Manager.UserName = success;
                    WinJS.Navigation.navigate("/pages/users/users.html");
                } else {
                    displayError("Error with authentication.");
                }
            });
        }
        else {
            displayError(message);
        }
    }).fail(function (message) {
        displayError(message);
    });
}