// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var client, gameHub, server;
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

                            BoxR.Manager.Hub.server.loginExternal('facebook', token).done(function (success) {
                                if (success) {
                                    BoxR.Manager.UserName = success; // should I write a WinRTManager?
                                    WinJS.Navigation.navigate("/pages/main/main.html");
                                } else {
                                    displayError("Error with facebook authentication.");
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
                BoxR.Manager.UserName = success; // should I write a WinRTManager?
                WinJS.Navigation.navigate("/pages/main/main.html");
            } else {
                displayError("Wrong password or username!");
            }
            $("#progressRing").hide();
        });
    }
    
    function displayError(error, logerror) {
        $(".error").text(error);
        console.log(logerror || error);
    }
})();
