// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

var body = "";
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/report/report.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var ErrorDiv = document.getElementById('errors');
            var noErrorDiv = document.getElementById('noerrors');
            var localSettings = applicationData.localSettings;
            if (localSettings && localSettings.values["errors"]) {
                var errors = JSON.parse(localSettings.values["errors"]);
                if(Object.prototype.toString.call( errors ) === '[object Array]' && errors.length > 0){
                    ErrorDiv.style.display = "block";
                    noErrorDiv.style.display = "none";
                    body = localSettings.values["errors"];
                }
                else {
                    applicationData.localSettings.values["errors"] = JSON.stringify([]);
                    ErrorDiv.style.display = "none";
                    noErrorDiv.style.display = "block";
                }
            }
            else {
                ErrorDiv.style.display = "none";
                noErrorDiv.style.display = "block";
            }
            //localSettings.values["lasterrorstack"] = e.detail.stack;
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

function sendReport() {
    if (BoxR.Manager.Hub && BoxR.Manager.Hub.server) {
        BoxR.Manager.Hub.server.report(body).done(function() {
            document.getElementById('errors').innerHTML = "<p>Errors reported to developer. Thanks</p>";
        });
    }
    applicationData.localSettings.values["errors"] = JSON.stringify([]);
}
