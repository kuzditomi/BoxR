var adduplexadvert;


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
                WinJS.Resources.processAll();
                var networkInfo = Windows.Networking.Connectivity.NetworkInformation;

                try {
                    // register for network status change notifications
                    networkInfo.addEventListener("networkstatuschanged", onNetworkStatusChange);
                }
                catch (e) {
                    //print("An unexpected exception occured: " + e.name + ": " + e.message);
                }
                // init ads
                //initAds();
                
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
                
                //snapview detect
                window.addEventListener('resize', onResize, false);
                var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
                dataTransferManager.addEventListener("datarequested", function(e) {
                    var request = e.request;
                    request.data.properties.title = "BoxR";
                    request.data.properties.description = "A short puzzle game to challenge your friends.";
                    request.data.setUri(new Windows.Foundation.Uri("http://apps.microsoft.com/windows/hu-hu/app/boxr/eecf0832-e2e4-4cb8-8ac2-92348a3d4e97"));
                });
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
            "about": { title: WinJS.Resources.getString("about").value, href: "/pages/about/about.html" },
            "privacy": { title: WinJS.Resources.getString("privacy_policy").value, href: "/pages/privacy/privacy.html" },
            "report": { title: WinJS.Resources.getString("error_report").value, href: "/pages/report/report.html" },
            "settings": { title: WinJS.Resources.getString("settings").value, href: "/pages/settings/settings.html" }
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

            errors.push({ message: e.detail.error.message || e.detail.error.errorMessage, stack: e.detail.error.stack || e.detail.error.errorUrl, line: e.detail.error.errorLine });

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
        var myAdControl = new MicrosoftNSJS.Advertising.AdControl(pubCenterAd,
            {
                applicationId: 'c7d93e9f-0ef7-4436-8bf3-59368e6c5034',
                adUnitId: '127760'
            });
        myAdControl.isAutoRefreshEnabled = true;
        myAdControl._onErrorOccurred = function () {
            myAdControl.isAutoRefreshEnabled = false;
            myAdControl.dispose();
            pubCenterAd.innerHtml = "";
            
            var ad = new AdDuplexJs.Controls.AdControl(adDuplexAd, { appId: '56899', size: '728x90' });
        };
    };
}

function displayError(error, logerror) {
    //$(".error").text(error);

    var msg = new Windows.UI.Popups.MessageDialog(error, WinJS.Resources.getString("error").value);
    msg.showAsync();
    console.log(logerror || error);
}

function onResize() {
    var currentViewState = Windows.UI.ViewManagement.ApplicationView.value;
    var snapped = Windows.UI.ViewManagement.ApplicationViewState.snapped;
    var canvas = document.getElementById("gameCanvas");
    var $turnDiv = $("#turnDiv");
    var currentApp = Windows.ApplicationModel.Store.CurrentApp;
    // Get the license info
    var licenseInformation = currentApp.licenseInformation;
                    
    if (currentViewState === snapped) {// change into snap view
        // change the outer class for css
        $(".fullview").addClass('snapview').removeClass('fullview');
                        
        // resize game canvas 
        if (BoxR && BoxR.Manager && BoxR.Manager.Game && canvas) { 
            canvas.height = 0;
            canvas.width = 0;
            var size = $('canvas').parent().width();
            canvas.height = size;
            canvas.width = size;
                            
            BoxR.Manager.Game.Resize(size);
            BoxR.Manager.Game.Draw();
                            
            if($turnDiv) {
                $turnDiv.css('width', '292px');
                $turnDiv.css('margin-left', '0');
            }
        }
        // change ad
        if (licenseInformation.isTrial) {
            $(".snapview").css('height', ($(window).height() - 300) + 'px');
            adContainer.style.width = adContainer.style.height = '250px';
            adDuplexAd.style.width = adDuplexAd.style.height = '250px';
            pubCenterAd.style.width = pubCenterAd.style.height = '250px';
                            
            if(pubCenterAd.winControl) {
                pubCenterAd.winControl.dispose();
                pubCenterAd.innerHtml = "";
                                
                var mySnapAdControl = new MicrosoftNSJS.Advertising.AdControl(pubCenterAd,
                    {
                        applicationId: 'c7d93e9f-0ef7-4436-8bf3-59368e6c5034',
                        adUnitId: '126195'
                    });
                mySnapAdControl.isAutoRefreshEnabled = true;
                mySnapAdControl._onErrorOccurred = function () {
                    if (adDuplexAd.winControl)
                        adDuplexAd.winControl.dispose();
                    adDuplexAd.innerHTML = "";
                    new AdDuplexJs.Controls.AdControl(adDuplexAd, { appId: '56899', size: '250x250' });
                };
            }
            else {
                if (adDuplexAd.winControl)
                    adDuplexAd.winControl.dispose();
                adDuplexAd.innerHTML = "";
                new AdDuplexJs.Controls.AdControl(adDuplexAd, { appId: '56899', size: '250x250' });
            }
                            
        }
    } else {// change into fullview
        // change the outer class for css
        $(".snapview").addClass('fullview').removeClass('snapview');
                        
        // resize game canvas 
        if (BoxR && BoxR.Manager && BoxR.Manager.Game && canvas) { 
            canvas.height = 0;
            canvas.width = 0;
            var size = $('canvas').parent().width();
            canvas.height = size;
            canvas.width = size;

            BoxR.Manager.Game.Resize(size);
            BoxR.Manager.Game.Draw();
            if ($turnDiv) {
                $turnDiv.css('width', '145px');
                $turnDiv.css('margin-left', '10px');
            }
        }
        // change ad
        if (licenseInformation.isTrial) {
            $(".fullview").css('height', '100%');
            adContainer.style.width = '728px';adContainer.style.height = '90px';
            adDuplexAd.style.width = '728px'; adDuplexAd.style.height = '90px';
            pubCenterAd.style.width = '728px'; pubCenterAd.style.height = '90px';

            if (pubCenterAd.winControl) {
                pubCenterAd.winControl.dispose();
                pubCenterAd.innerHtml = "";

                var mySnapAdControl = new MicrosoftNSJS.Advertising.AdControl(pubCenterAd,
                    {
                        applicationId: 'c7d93e9f-0ef7-4436-8bf3-59368e6c5034',
                        adUnitId: '127760'
                    });
                mySnapAdControl.isAutoRefreshEnabled = true;
                mySnapAdControl._onErrorOccurred = function () {
                    if (adDuplexAd.winControl)
                        adDuplexAd.winControl.dispose();
                    adDuplexAd.innerHTML = "";
                    new AdDuplexJs.Controls.AdControl(adDuplexAd, { appId: '56899', size: '728x90' });
                };
            }
            else {
                if (adDuplexAd.winControl)
                    adDuplexAd.winControl.dispose();
                adDuplexAd.innerHTML = "";
                new AdDuplexJs.Controls.AdControl(adDuplexAd, { appId: '56899', size: '728x90' });
            }
        }
    }
}