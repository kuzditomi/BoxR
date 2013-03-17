// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/game/game.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var height = window.outerHeight;
            var newsize = height * 0.65;

            var canvas = $("#gameCanvas")[0];
            canvas.width = canvas.height = newsize;
            game = new Game(canvas);
            game.Init(3, options.selfStart);
            game.Draw();

            canvas.addEventListener("click", function (e) { game.Click(e); }, true);
            canvas.addEventListener("mousemove", function (e) { game.MouseMove(e); });
            $(".selfname").html(options.name);
            $(".opponentname").html(options.opponentname);
            $("#roundcounter").html(options.selfStart ? "YOUR TURN COMES" : "PLEASE WAIT FOR THE OPPONENT");
            
            $("#welcome").html("Üdvözöllek, " + selfUserName + "!");
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
