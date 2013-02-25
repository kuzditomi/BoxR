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
});

/********* oauth ************/
function launchFacebookWebAuth() {
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

                        connection.start(function () {
                            console.log('connection started!');
                        }).done(function () {
                            gameHub.server.loginExternal('facebook', token).done(function (success) {
                                if(success) {
                                    WinJS.Navigation.navigate("/pages/main/main.html",success);
                                }
                            });
                        });
                    }
                    else {
                        $("#error").text("lofasz");
                    }
                    break;
                case Windows.Security.Authentication.Web.WebAuthenticationStatus.userCancel:
                    $("#error").text("User cancelled the authentication to Facebook.");
                    break;
                case Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp:
                    $("#error").text("An error occurred while communicating with Facebook.");
                    break;
            }
        }, function (err) {
            //WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
            $("#error").text("Error returned: " + err.message);
        });
}

/************* game ***************/
function startGame(selfStart, name, opponentname) {
    WinJS.Navigation.navigate("/pages/game/game.html", {selfStart:selfStart, name:name, opponentname:opponentname});
}

/************* popups *************/

function invited_popup(user) {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(".challenger").html(user.UserName);
        $(el).find(".invited").show();
        //$("#inner .accept").click(function () {
        //    gameHub.server.inviteAccepted();
        //    close_popup();
        //});
        //$("#inner .deny").click(function () {
        //    gameHub.server.inviteDenied();
        //    close_popup();
        //});
    }
}

function wait_popup(username) {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(".challenger").html(username);
        $(el).find(".wait").show();
        //$("#inner .deny").click(function () {
        //    gameHub.server.inviteDenied();
        //    close_popup();
        //});
    }
}

function quit_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".quit").show();
    }
}

function disconnect_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".disconnect").show();
    }
}

function win_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".win").show();
    }
}

function lose_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".lose").show();
    }
}

function close_popup() {
    var el = $('#blanket');
    el.find("section").hide();
    el.hide();
}