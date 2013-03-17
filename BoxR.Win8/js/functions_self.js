var msg;
var selfUserName;
var popup;
var popupHelper;
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
                connection = $.connection.hub;
                connection.url = localSettings.values["connectionURL"] + 'signalr';

                gameHub = $.connection.game;

                initHub();

                connection.start(function () {
                    console.log('connection started!');
                }).done(function () {
                    gameHub.server.logout();
                    WinJS.Navigation.navigate("/pages/login/login.html");
                });
            } else {
                // TODO: This application has been reactivated from suspension.
                // store logged in state?
                gameHub.server.logout();
                WinJS.Navigation.navigate("/pages/login/login.html");
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
        var popupDiv = document.getElementById('popupdiv');
        popup = new BoxR.UI.PopupControl(popupDiv);
        popupHelper = new Popups();
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        gameHub.server.logout();
        app.sessionState.history = nav.history;
    };

    app.start();
})();
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
            WinJS.Navigation.navigate("/pages/main/main.html");
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

/************** Popups *******************/
function invited_popup(user) {
    var setting = popupHelper.Invited(user.UserName);
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function wait_popup(username) {
    var setting = popupHelper.Wait(username);
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function quit_popup() {
    var setting = popupHelper.Quit();
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function disconnect_popup() {
    var setting = popupHelper.Disconnect();
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function win_popup() {
    var setting = popupHelper.Win();
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function lose_popup() {
    var setting = popupHelper.Lost();
    popup.SetBtn(setting.buttons);
    popup.SetText(setting.text);
    popup.Show();
}

function close_popup() {
    popup.Hide();
}