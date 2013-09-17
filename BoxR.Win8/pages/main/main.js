// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/main/main.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            $('#btnsp').click(function() {
                WinJS.Navigation.navigate("/pages/singleplayer/singleplayer.html");
            });
            $('#btnmp').click( function () {
                WinJS.Navigation.navigate("/pages/login/login.html");
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
})();

function start() {
    // create server and set the static Server
    var server = new BoxR.Server();
    BoxR.Manager.Server = server;
    
    BoxR.Manager.Connection.start(function () {
        console.log('connection started!');
    }).done(function () {
        setTimeout(function () {
            WinJS.Navigation.navigate("/pages/login/login.html");
        }, 1500);
    }).fail(function () {
        notifyConnectionError();
        //WinJS.Navigation.navigate("/pages/login/login.html");
    });
}

function initConnection() {
    // connect to hub
    var connection = $.connection.hub;
    connection.url = localSettings.values["connectionURL"] + 'signalr';
    BoxR.Manager.Connection = connection;

    // create hub and set the static Hub
    var hub = $.connection.game;
    BoxR.Manager.Hub = hub;
}

function initConnection() {
    // connect to hub
    var connection = $.connection.hub;
    connection.url = localSettings.values["connectionURL"] + 'signalr';
    BoxR.Manager.Connection = connection;

    // create hub and set the static Hub
    var hub = $.connection.game;
    BoxR.Manager.Hub = hub;
}