/// <reference path="///LiveSDKHTML/js/wl.js" />

(function () {
    "use strict";
    WinJS.UI.Pages.define("/pages/login/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            $('#regbtn').attr('href', localSettings.values.connectionURL + 'Account/Register');
            $(".username").focus();

            $(".username").keydown(function (event) {
                $(".error").html("&nbsp;");
                if (event.which == 13) {
                    launchformauth($('.username').val(), $('.password').val());
                }
            });
            $(".password").keydown(function (event) {
                $(".error").html("&nbsp;");
                if (event.which == 13) {
                    launchformauth($('.username').val(), $('.password').val());
                }
            });
            $(".btnfacebook").click(function() {
                launchFacebookWebAuth();
            });
            $(".btnmicrosoft").click(function () {
                WL.init();
                authenticate();
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
                                        WinJS.Navigation.navigate("/pages/main/main.html");
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
                        displayError("User cancelled the authentication to Facebook.");
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
                WinJS.Navigation.navigate("/pages/main/main.html");
            } else {
                displayError("Error with microsoft authentication.");
            }
            
            $("#progressRing").hide();
        });
    }
    
    function displayError(error, logerror) {
        $(".error").text(error);
        console.log(logerror || error);
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
                            WinJS.Navigation.navigate("/pages/main/main.html");
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
        logout().then(login).then(function () {
            if (session === null) {
                // Authentication failed, try again.
                authenticate();
            }
        });
    }
})();
