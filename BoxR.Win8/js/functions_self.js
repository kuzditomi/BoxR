﻿var msg;
var selfUserName;
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();

/************* onload ******************/
$(function () {
    connection = $.connection.hub;
    connection.url = localSettings.values["connectionURL"] + 'signalr';

    gameHub = $.connection.game;

    initHub();

    connection.start(function() {
        console.log('connection started!');
    });
});
/********* progress ring***************/
function showProgressRing() {
    $("#progressRing").show();
}
function hideProgressRing() {
    $("#progressRing").hide();
}
/********* oauth ************/
function launchFacebookWebAuth() {
    showProgressRing();
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

                            gameHub.server.loginExternal('facebook', token).done(function (success) {
                                if (success) {
                                    selfUserName = success;
                                    WinJS.Navigation.navigate("/pages/main/main.html",success);
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
            displayError("Error with facebook authentication.",err.message);
        });
    hideProgressRing();
}
/************ form auth ***************/
function launchformauth(username, password) {

    showProgressRing();
    gameHub.server.login(username, password).done(function(success) {
        if (success) {
            selfUserName = success;
            WinJS.Navigation.navigate("/pages/main/main.html", success);
        } else {
            displayError("Wrong password or username!");
        }
        hideProgressRing();
    });
}


/************* game ***************/
function startGame(selfStart, name, opponentname) {
    WinJS.Navigation.navigate("/pages/game/game.html", {selfStart:selfStart, name:name, opponentname:opponentname});
}

/************* popups *************/

function invited_popup(user) {
    msg = new Windows.UI.Popups.MessageDialog(user.UserName + " has challanged you!", "A wild challenger appears");
    msg.commands.append(new Windows.UI.Popups.UICommand("Accept", 
       function (command) {
           gameHub.server.inviteAccepted();
       }));
    msg.commands.append(new Windows.UI.Popups.UICommand("Deny",
        function (command) {
            gameHub.server.inviteDenied();
        }));
    msg.showAsync();
}

function wait_popup(username) {
    msg = new Windows.UI.Popups.MessageDialog("You have challanged" + username + ". Please wait for his response!","Invite sent");
    msg.commands.append(new Windows.UI.Popups.UICommand("Suspend invite",
        function (command) {
            gameHub.server.inviteDenied();
        }));
    msg.showAsync();
}

function quit_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".quit").show();
    }
}

function disconnect_popup() {
    msg = new Windows.UI.Popups.MessageDialog("Your opponent has quit the game.");
    msg.commands.append(new Windows.UI.Popups.UICommand("OK",
        function (command) {
            WinJS.Navigation.navigate("/pages/main/main.html", selfUserName);
        }));
    msg.showAsync();
}

function win_popup() {
    msg = new Windows.UI.Popups.MessageDialog("Congratulation, you have won the game!");
    msg.commands.append(new Windows.UI.Popups.UICommand("OK",
        function (command) {
            WinJS.Navigation.navigate("/pages/main/main.html", selfUserName);
        }));
    msg.showAsync();
}

function lose_popup() {
    msg = new Windows.UI.Popups.MessageDialog("You have just lost the game.");
    msg.commands.append(new Windows.UI.Popups.UICommand("OK",
        function (command) {
            WinJS.Navigation.navigate("/pages/main/main.html", selfUserName);
        }));
    msg.showAsync();
}

function close_popup() {
    WinJS.Navigation.navigate("/pages/main/main.html", selfUserName);
}