(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        // subscribe for connection events
        var networkInfo = Windows.Networking.Connectivity.NetworkInformation;
        
        try {
            // register for network status change notifications
            networkInfo.addEventListener("networkstatuschanged", onNetworkStatusChange);
        }
        catch (e) {
            print("An unexpected exception occured: " + e.name + ": " + e.message);
        }


        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                
                // connect to Hub and set the static Hub and static Connection
                initConnection();

                // create the populcontrol for the Client
                var popupDiv = document.getElementById('popupdiv');
                var popupControl = new BoxR.UI.PopupControl(popupDiv);
                
                // create client and set the static Client
                var client = new BoxR.WinRTClient(popupControl);
                BoxR.Manager.Client = client;

                // create server and set the static Server
                var server = new BoxR.Server();
                BoxR.Manager.Server = server;
                
                BoxR.Manager.Connection.start(function() {
                    console.log('connection started!');
                }).done(function() {
                    setTimeout(function() {
                        WinJS.Navigation.navigate("/pages/login/login.html");
                    }, 1500);
                }).fail(function () {
                    notifyConnectionError();
                    //WinJS.Navigation.navigate("/pages/login/login.html");
                });

            } else {
                // TODO: This application has been reactivated from suspension.
                // store logged in state?
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
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().

        BoxR.Manager.Hub.server.logout();
        app.sessionState.history = nav.history;
    };

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = { "about": { title: "About", href: "/pages/about/about.html" }, "privacy": { title:"Privacy Policy", href:"/pages/privacy/privacy.html"} };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();

// Event handler for Network Status Change event
function onNetworkStatusChange(sender) {
    // get the ConnectionProfile that is currently used to connect to the Internet
    var networkInfo = Windows.Networking.Connectivity.NetworkInformation;
    var internetProfile = networkInfo.getInternetConnectionProfile();
    
    // check if the current profile is connected to internet
    if (internetProfile.getNetworkConnectivityLevel() != Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess) {
        notifyConnectionError();
        WinJS.Navigation.navigate("/pages/login/login.html");
    }
    else {
        initConnection();
        notifyConnectionIsBack();
        WinJS.Navigation.navigate("/pages/login/login.html");
    }
}

function notifyConnectionError() {
    var notifications = Windows.UI.Notifications;
    var template = notifications.ToastTemplateType.toastText02;
    var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
    var toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode("Connection error."));
    toastTextElements[1].appendChild(toastXml.createTextNode("Could not connect to host. Please retry later."));
    var toastNode = toastXml.selectSingleNode("/toast");
    toastNode.setAttribute("duration", "long");
    var toast = new notifications.ToastNotification(toastXml);
    var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
    toastNotifier.show(toast);
};

function notifyConnectionIsBack() {
    var notifications = Windows.UI.Notifications;
    var template = notifications.ToastTemplateType.toastText02;
    var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
    var toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode("Successfully connected."));
    toastTextElements[1].appendChild(toastXml.createTextNode("Network connection is back!"));
    var toastNode = toastXml.selectSingleNode("/toast");
    toastNode.setAttribute("duration", "long");
    var toast = new notifications.ToastNotification(toastXml);
    var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
    toastNotifier.show(toast);
};

function initConnection() {
    // connect to hub
    var connection = $.connection.hub;
    connection.url = localSettings.values["connectionURL"] + 'signalr';
    BoxR.Manager.Connection = connection;
    
    // create hub and set the static Hub
    var hub = $.connection.game;
    BoxR.Manager.Hub = hub;
}