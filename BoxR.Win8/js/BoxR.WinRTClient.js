var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoxR;
(function (BoxR) {
    "use strict";
    var WinRTClient = (function (_super) {
        __extends(WinRTClient, _super);
        function WinRTClient(popupControl) {
                _super.call(this);
            this.popupControl = popupControl;
            this.popupHelper = new BoxR.Popups(popupControl);
        }
        WinRTClient.prototype.StartGame = function (selfStart, name, opponentName) {
            var _this = this;
            WinJS.Navigation.navigate("/pages/game/game.html", {
                selfStart: selfStart,
                name: name,
                opponentname: opponentName
            }).done(function () {
                var height = window.outerHeight;
                var newsize = height * 0.65;
                var canvas = document.getElementById("gameCanvas");
                canvas.width = canvas.height = newsize;
                var game = new BoxR.Game(canvas);
                BoxR.Manager.Game = game;
                game.Init(3, selfStart);
                game.Draw();
                canvas.addEventListener("click", function (e) {
                    game.Click(e);
                }, true);
                canvas.addEventListener("mousemove", function (e) {
                    game.MouseMove(e);
                });
                document.getElementById("selfname").innerHTML = name;
                document.getElementById("opponentname").innerHTML = opponentName;
                document.getElementById("welcome").innerHTML = "Welcome " + name;
            });
        };
        WinRTClient.prototype.InvitedPopup = function (user) {
            var setting = this.popupHelper.Invited(user.UserName);
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.WaitPopup = function (username) {
            var setting = this.popupHelper.Wait(username);
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.QuitPopup = function () {
            var setting = this.popupHelper.Quit();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.DisconnectPopup = function () {
            var setting = this.popupHelper.Disconnect();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.WinPopup = function () {
            var setting = this.popupHelper.Win();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.LosePopup = function () {
            var setting = this.popupHelper.Lost();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        };
        WinRTClient.prototype.ClosePopup = function () {
            this.popupControl.Hide();
        };
        return WinRTClient;
    })(BoxR.ClientBase);
    BoxR.WinRTClient = WinRTClient;    
})(BoxR || (BoxR = {}));
