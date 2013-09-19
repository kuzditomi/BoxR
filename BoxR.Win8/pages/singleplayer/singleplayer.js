// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/singleplayer/singleplayer.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            //$('.container').css('height', getDocHeight());
            var size = $('canvas').parent().width();
            $('.span2').css('height', size);

            var canvas = document.getElementById("gameCanvas");
            canvas.height = size;
            canvas.width = size;

            BoxR.Manager.Game = new BoxR.Game(canvas, true);
            BoxR.Manager.Game.Init(3, true);
            BoxR.Manager.Game.Draw();

            BoxR.Manager.Client.IsSinglePlayer = true;

            canvas.addEventListener("click", function (e) { BoxR.Manager.Game.Click(e); }, true);
            canvas.addEventListener("mousemove", function (e) { BoxR.Manager.Game.MouseMove(e); });
         
            BoxR.Manager.Game.Draw();
            
            var $backbutton = $('#backbutton');
            if ($backbutton) {
                $backbutton.on('click', function () {
                    document.location.href = "/";
                });
                $backbutton.show();
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

function getDocHeight() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
}