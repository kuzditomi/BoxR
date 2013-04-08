﻿(function () {
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
                var connection = $.connection.hub;
                connection.url = localSettings.values["connectionURL"] + 'signalr';

                var popupDiv = document.getElementById('popupdiv');
                var popupControl = new BoxR.UI.PopupControl(popupDiv);
                
                //create hub and set the static Hub
                var hub = $.connection.game;
                BoxR.Manager.Hub = hub;
                
                //create client and set the static Client
                var client = new BoxR.WinRTClient(popupControl);
                BoxR.Manager.Client = client;

                //create server and set the static Server
                var server = new BoxR.Server();
                BoxR.Manager.Server = server;

                connection.start(function () {
                    console.log('connection started!');
                }).done(function () {
                    setTimeout(function (){
                        WinJS.Navigation.navigate("/pages/login/login.html");
                    },3000);
                });
            } else {
                // TODO: This application has been reactivated from suspension.
                // store logged in state?
                // WinJS.Navigation.navigate("/pages/login/login.html");
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

        //gameHub.server.logout();
        app.sessionState.history = nav.history;
    };

    app.start();
})();