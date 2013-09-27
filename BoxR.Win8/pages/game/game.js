// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/game/game.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            $('#back').on('click', function () {
                BoxR.Manager.Client.QuitPopup();
            });
            
            $('body').on('mouseenter', '.truncate',
                function () {
                    var scrollWidth = this.scrollWidth;
                    $(this).animate({
                        width: scrollWidth,
                        paddingRight: '5px'
                    }, 200);
                }
            );
            $('body').on('mouseleave', '.truncate',
                function () {
                    $(this).animate({
                        width: '140px',
                        paddingRight: '0px'
                    }, 200);

                }
            );
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
