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

            var height = $(this.Blanket).height() * 0.65;
            var container = document.getElementById("innerContainer");

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
                var size = $('canvas').parent().width(); //getDocHeight() * 0.65;

                canvas.height = size;
                canvas.width = size;
                game = new BoxR.Game(canvas);
                BoxR.Manager.Game = game;
                game.Init(3, selfStart);
                game.Draw();

                canvas.addEventListener("click", function (e) { game.Click(<MouseEvent>e); }, true);
                canvas.addEventListener("mousemove", function (e) { game.MouseMove(<MouseEvent>e); });
                var $turnDiv = $(container).find('#turnDiv');
                if($turnDiv){
                    $turnDiv.html('<h1>'+(selfStart? 'blue turn' : 'red turn')+'</h1>');
                    $turnDiv.addClass(selfStart ? 'tile-blue' : 'tile-red');
                }
                var $backbutton = $('#backbutton');
                $backbutton.off('click');
                $backbutton.on('click', function () {
                    _this.QuitPopup();
                });
                
            });
        }
        public InvitedPopup(user) {
            BoxR.Manager.PopupControl.Invite(user.UserName);
        }
        public WaitPopup(username: string) {
            BoxR.Manager.PopupControl.Wait(username);
        }
        public QuitPopup() {
            BoxR.Manager.PopupControl.Quit();
        }
        public DisconnectPopup() {
            BoxR.Manager.PopupControl.Disconnect();
        }
        public WinPopup() {
            BoxR.Manager.PopupControl.Win();
        }
        public LosePopup() {
            BoxR.Manager.PopupControl.Lose();
        }
        public ClosePopup() {
            BoxR.Manager.PopupControl.Hide();
        }
    }
}