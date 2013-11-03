var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoxR;
(function (BoxR) {
    "use strict";
    var PhoneGapClient = (function (_super) {
        __extends(PhoneGapClient, _super);
        function PhoneGapClient() {
                _super.call(this);
            this.Blanket = document.getElementById("blanket");
            BoxR.Manager.PopupControl = new Popup(document.getElementById("popup"));
        }
        PhoneGapClient.prototype.StartGame = function (selfStart, name, opponentName) {
            var _this = this;
            var game;
            this.ClosePopup();
            var height = $(this.Blanket).height() * 0.65;
            var container = document.getElementById("innerContainer");
            app.loadPage('pages/game/game.html', function () {
                var canvas = $("canvas")[0];
                var size = $('canvas').parent().width();
                $('#selfname').text(name);
                $('#opponentname').text(opponentName);
                canvas.height = size;
                canvas.width = size;
                game = new BoxR.Game(canvas);
                BoxR.Manager.Game = game;
                game.Init(3, selfStart);
                game.Draw();
                canvas.addEventListener("click", function (e) {
                    game.Click(e);
                }, true);
                canvas.addEventListener("mousemove", function (e) {
                    game.MouseMove(e);
                });
                var $turnDiv = $(container).find('#turnDiv');
                if($turnDiv) {
                    $turnDiv.html('<h1>' + (selfStart ? 'blue turn' : 'red turn') + '</h1>');
                    $turnDiv.addClass(selfStart ? 'tile-blue' : 'tile-red');
                }
                var $backbutton = $('#backbutton');
                $backbutton.off('click');
                $backbutton.on('click', function () {
                    _this.QuitPopup();
                });
            });
        };
        PhoneGapClient.prototype.InvitedPopup = function (user) {
            BoxR.Manager.PopupControl.Invite(user.UserName);
        };
        PhoneGapClient.prototype.WaitPopup = function (username) {
            BoxR.Manager.PopupControl.Wait(username);
        };
        PhoneGapClient.prototype.QuitPopup = function () {
            BoxR.Manager.PopupControl.Quit();
        };
        PhoneGapClient.prototype.DisconnectPopup = function () {
            BoxR.Manager.PopupControl.Disconnect();
        };
        PhoneGapClient.prototype.WinPopup = function () {
            BoxR.Manager.PopupControl.Win();
        };
        PhoneGapClient.prototype.LosePopup = function () {
            BoxR.Manager.PopupControl.Lose();
        };
        PhoneGapClient.prototype.ClosePopup = function () {
            BoxR.Manager.PopupControl.Hide();
        };
        return PhoneGapClient;
    })(BoxR.ClientBase);
    BoxR.PhoneGapClient = PhoneGapClient;    
})(BoxR || (BoxR = {}));
