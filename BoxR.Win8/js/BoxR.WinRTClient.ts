/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Server.ts"/>
/// <reference path="BoxR.Popups.ts"/>
/// <reference path="BoxR.Manager.ts"/>

module BoxR {
    "use strict";

    export class WinRTClient extends ClientBase {
        private popupHelper: BoxR.Popups;
        private popupControl: any;

        constructor(popupControl : any) {
            super();
            this.popupControl = popupControl;
            this.popupHelper = new BoxR.Popups(popupControl);
        }

        StartGame(selfStart: bool, name: string, opponentName: string) {
            var _this = this;
            WinJS.Navigation.navigate("/pages/game/game.html", { selfStart: selfStart, name: name, opponentname: opponentName })
                .done(function () {
                    var height = window.outerHeight;
                    var newsize = height * 0.65;

                    var canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
                    canvas.width = canvas.height = newsize;
                    var game = new BoxR.Game(canvas);
                    BoxR.Manager.Game = game;
                    game.Init(3, selfStart);
                    game.Draw();

                    canvas.addEventListener("click", function (e) { game.Click(<MouseEvent>e); }, true);
                    canvas.addEventListener("mousemove", function (e) { game.MouseMove(<MouseEvent>e); });
                    document.getElementById("selfname").innerHTML = name;
                    document.getElementById("opponentname").innerHTML = opponentName;
                    document.getElementById("roundcounter").innerHTML = selfStart ? "YOUR TURN COMES" : "PLEASE WAIT FOR THE OPPONENT"; 
                    document.getElementById("welcome").innerHTML = "Welcome " + name;
                });          
        }
        InvitedPopup(user) {
            var setting = this.popupHelper.Invited(user.UserName);
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        WaitPopup(username: string) {
            var setting = this.popupHelper.Wait(username);
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        QuitPopup() {
            var setting = this.popupHelper.Quit();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        DisconnectPopup() {
            var setting = this.popupHelper.Disconnect();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        WinPopup() {
            var setting = this.popupHelper.Win();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        LosePopup() {
            var setting = this.popupHelper.Lost();
            this.popupControl.SetBtn(setting.buttons);
            this.popupControl.SetText(setting.text);
            this.popupControl.Show();
        }
        ClosePopup() {
            this.popupControl.Hide();
        }
    }
}