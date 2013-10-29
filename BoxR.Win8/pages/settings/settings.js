// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/settings.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Resources.processAll();
            var $colorDiv = $('#colors');
            var colors = [
                "16a085",
                "27ae60",
                "2980b9",
                "8e44ad",
                "f39c12",
                "d35400",
                "c0392b",
                "7f8c8d",
                "2c3e50"
            ];
            for (var i = 0; i < colors.length; i++) {
                var $box = $('<div/>').css({
                    width: '50px',
                    height: '50px',
                    background: '#' + colors[i],
                    margin: '10px',
                    display: 'inline-block',
                    cursor: 'pointer'
                });
                $colorDiv.append($box);
                $box.click(function () {
                    $('body').css("background-color", $(this).css('background-color'));
                    if (window.BoxR && BoxR.activeColor) {
                        BoxR.activeColor = $(this).css('background-color');
                        if (BoxR.Manager && BoxR.Manager.Game)
                            BoxR.Manager.Game.Draw();
                    }
                    var applicationData = Windows.Storage.ApplicationData.current;
                    var localSettings = applicationData.localSettings;
                    localSettings.values['bgColor'] = $(this).css('background-color');
                    return false;
                }); 
            }
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
