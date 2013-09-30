(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("error", function (err) {
        WinJS.log && WinJS.log("error", err);
        // return true; // only if error is handled
    });

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                // subscribe for connection events
                var networkInfo = Windows.Networking.Connectivity.NetworkInformation;

                try {
                    // register for network status change notifications
                    networkInfo.addEventListener("networkstatuschanged", onNetworkStatusChange);
                }
                catch (e) {
                    //print("An unexpected exception occured: " + e.name + ": " + e.message);
                }
                // init ads
                initAds();
                
                // create the populcontrol for the Client
                var popupDiv = document.getElementById('popupdiv');
                var popupControl = new BoxR.UI.PopupControl(popupDiv);

                // create client and set the static Client
                var client = new BoxR.WinRTClient(popupControl);
                BoxR.Manager.Client = client;
                
                var applicationData = Windows.Storage.ApplicationData.current;
                var localSettings = applicationData.localSettings;
                var bgcolor = localSettings.values["bgColor"] || '#16a085';
                
                // bg color
                BoxR.activeColor = bgcolor;
                $('body').css("background-color", BoxR.activeColor);
                
                var onResize = function() {
                    var currentViewState = Windows.UI.ViewManagement.ApplicationView.value;
                    var snapped = Windows.UI.ViewManagement.ApplicationViewState.snapped;

                    if (currentViewState === snapped) {
                        $(".fullview").addClass('snapview').removeClass('fullview');
                        //$(".snapview").show();//view.layout = new WinJS.UI.ListLayout();
                    } else {
                        $(".snapview").addClass('fullview').removeClass('snapview');
                        //view.lastViewState = new WinJS.UI.GridLayout();
                    }
                };
                window.addEventListener('resize', onResize, false);
            } else {
                // TODO: This application has been reactivated from suspension.
                // store logged in state?

                // bullshit, nothing is happening here :C
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
    
    // resume from suspension ( this time real)
    Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", resumingHandler, false);

    function resumingHandler() {
        if (BoxR.Manager.Hub && BoxR.Manager.Hub.server && BoxR.Manager.Connection && BoxR.Manager.Connection.id)
            BoxR.Manager.Hub.server.logout();
        
        WinJS.Navigation.navigate("/pages/main/main.html");
        //initConnection();
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().

        if (BoxR.Manager.Hub && BoxR.Manager.Hub.server && BoxR.Manager.Connection && BoxR.Manager.Connection.id)
            BoxR.Manager.Hub.server.logout();
        app.sessionState.history = nav.history;
    };



    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "about": { title: "About", href: "/pages/about/about.html" },
            "privacy": { title: "Privacy Policy", href: "/pages/privacy/privacy.html" },
            "report": { title: "Error Report", href: "/pages/report/report.html" },
            "settings": { title: "Settings", href: "/pages/settings/settings.html"}
    };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    WinJS.Application.onerror = function (e) {
        var localSettings = applicationData.localSettings;
        if (localSettings) {
            var errors;
            if (localSettings.values["errors"] && typeof (JSON.parse(localSettings.values["errors"]) == typeof (Array)))
                errors = JSON.parse(localSettings.values["errors"]) || [];
            else
                errors = [];

            errors.push({ message: e.detail.message || e.detail.errorMessage, stack: e.detail.stack || e.detail.errorUrl, line: e.detail.errorLine });

            localSettings.values["errors"] = JSON.stringify(errors);
        }
        
        return true;
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
        if (!BoxR.Manager.Client.IsSinglePlayer) {
            WinJS.Navigation.navigate("/pages/main/main.html");
        }
    }
    else {
        if (!BoxR.Manager.Client.IsSinglePlayer) {
            notifyConnectionIsBack();
            WinJS.Navigation.navigate("/pages/login/login.html");
        }
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

function initAds() {
    var currentApp = Windows.ApplicationModel.Store.CurrentApp;
    // Get the license info
    var licenseInformation = currentApp.licenseInformation;
    if (licenseInformation.isTrial) {
        var adDiv = document.getElementById("myAd");
        var myAdControl = new MicrosoftNSJS.Advertising.AdControl(adDiv,
            {
                applicationId: 'c7d93e9f-0ef7-4436-8bf3-59368e6c5034',
                adUnitId: '127760'
            });
        myAdControl.isAutoRefreshEnabled = true;
        myAdControl._onErrorOccurred = function () {
            myAdControl.isAutoRefreshEnabled = false;
            adDuplexAd.winControl.setup();
            $(adDiv).hide();
        };
        
    }
}

function displayError(error, logerror) {
    //$(".error").text(error);

    var msg = new Windows.UI.Popups.MessageDialog(error, "Error");
    msg.showAsync();
    console.log(logerror || error);
}