/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Server.ts"/>
/// <reference path="BoxR.Manager.ts"/>
/// <reference path="lib/jquery.d.ts"/>
declare var Popup;
module BoxR {
    "use strict";
    export class WebClient extends ClientBase {
        private Blanket: HTMLElement;

        constructor() {
            super();
            this.Blanket = document.getElementById("blanket");
            BoxR.Manager.PopupControl = new Popup(document.getElementById("popup"));
        }

        public StartGame(selfStart: bool, name: string, opponentName: string) {
            var _this = this;
            var game;
            this.ClosePopup();
            var quitButton = document.getElementById("quitGame");
            quitButton.style.display = "block";

            var height = $(this.Blanket).height() * 0.65;

            var container = document.getElementById("container");

            $.ajax("/Home/StartGame", {
                data: {
                    name: name,
                    opponent: opponentName,
                    selfstart: selfStart,
                    cwidth: height,
                }
            }).done(function (res) {
                container.innerHTML = res;
                var canvas = <HTMLCanvasElement>container.getElementsByTagName("canvas")[0];
                game = new BoxR.Game(canvas);
                BoxR.Manager.Game = game;
                game.Init(3, selfStart);
                game.Draw();

                canvas.addEventListener("click", function (e) { game.Click(<MouseEvent>e); }, true);
                canvas.addEventListener("mousemove", function (e) { game.MouseMove(<MouseEvent>e); });
                document.getElementById("quitBtn").onclick = () => _this.QuitPopup();
            });
        }
        public InvitedPopup(user) {
            BoxR.Manager.PopupControl.Invite(user.UserName);
        }
        public WaitPopup(username: string) {
            BoxR.Manager.PopupControl.Wait(username);
        }
        public QuitPopup() {
            if (this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("quitPopup").style.display = "block";
            }
        }
        public DisconnectPopup() {
            if (this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("disconnectPopup").style.display = "block";
            }
        }
        public WinPopup() {
            if (this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("winPopup").style.display = "block";
            }
        }
        public LosePopup() {
            if (this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("losePopup").style.display = "block";
            }
        }
        public ClosePopup() {
            BoxR.Manager.PopupControl.Hide();
        }
    }
}