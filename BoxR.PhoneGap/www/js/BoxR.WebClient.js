var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoxR;
(function (BoxR) {
    "use strict";
    var WebClient = (function (_super) {
        __extends(WebClient, _super);
        function WebClient() {
                _super.call(this);
            this.Blanket = document.getElementById("blanket");
            BoxR.Manager.PopupControl = new Popup(document.getElementById("popup"));
        }
        WebClient.prototype.StartGame = function (selfStart, name, opponentName) {
            var _this = this;
            var game;
            this.ClosePopup();
            var height = $(this.Blanket).height() * 0.65;
            var container = document.getElementById("innerContainer");
            $.ajax("/Home/StartGame", {
                data: {
                    name: name,
                    opponent: opponentName,
                    selfstart: selfStart,
                    cwidth: height
                }
            }).done(function (res) {
                container.innerHTML = res;
                var canvas = container.getElementsByTagName("canvas")[0];
                var size = $('canvas').parent().width();
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
        WebClient.prototype.InvitedPopup = function (user) {
            BoxR.Manager.PopupControl.Invite(user.UserName);
        };
        WebClient.prototype.WaitPopup = function (username) {
            BoxR.Manager.PopupControl.Wait(username);
        };
        WebClient.prototype.QuitPopup = function () {
            BoxR.Manager.PopupControl.Quit();
        };
        WebClient.prototype.DisconnectPopup = function () {
            BoxR.Manager.PopupControl.Disconnect();
        };
        WebClient.prototype.WinPopup = function () {
            BoxR.Manager.PopupControl.Win();
        };
        WebClient.prototype.LosePopup = function () {
            BoxR.Manager.PopupControl.Lose();
        };
        WebClient.prototype.ClosePopup = function () {
            BoxR.Manager.PopupControl.Hide();
        };
        return WebClient;
    })(BoxR.ClientBase);
    BoxR.WebClient = WebClient;    
})(BoxR || (BoxR = {}));
