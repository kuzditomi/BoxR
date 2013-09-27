// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/choosenick/choosenick.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("provider").textContent = options.provider;
            document.getElementById("provider2").textContent = options.provider;

            document.getElementById("btnBackToLogin").onclick = function () {
                BoxR.Manager.Hub.server.skipRegistration();
                WinJS.Navigation.navigate("/pages/login/login.html");
            };

            document.getElementById("btnRegister").onclick = function () {
                var newUserName = document.getElementById("username").value;
                if(newUserName) {
                    BoxR.Manager.Hub.server.registerUserNameToOAuth(newUserName).done(function () {
                        BoxR.Manager.UserName = newUserName;
                        WinJS.Navigation.navigate("/pages/users/users.html");
                    });
                }
                
            };
            
            $('#back').on('click', function () {
                WinJS.Navigation.navigate("/pages/login/login.html");
            });

            // TODO: Initialize the page here.
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
