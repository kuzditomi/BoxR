// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/register/register.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            $("#btnBackToLogin").click(function() {
                WinJS.Navigation.navigate("/pages/login/login.html");
            });
            
            $("#btnRegister").click(function () {
                displayError("");
                var username = $("#username").val();
                var password = $("#password").val();
                var passwordAgain = $("#passwordAgain").val();
                
                if(!username) {
                    displayError("Please give you choosen username.");
                    return;
                }
                if (!password) {
                    displayError("Please give you choosen password.");
                    return;
                }
                
                if(password != passwordAgain) {
                    displayError("Given passwords does not match.");
                    return;
                }

                BoxR.Manager.Hub.server.register(username, password).done(function(message) {
                    if (message == "true") {
                        // copied from login page js
                        BoxR.Manager.Hub.server.login(username, password).done(function (success) {
                            if (success) {
                                BoxR.Manager.UserName = success;
                                WinJS.Navigation.navigate("/pages/users/users.html");
                            } else {
                                displayError("Error with authentication.");
                            }
                        });
                    }
                    else {
                        displayError(message);
                    }
                }).fail(function (message) {
                    displayError(message);
                });
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

function displayError(message) {
    $(".error").html(message);
}