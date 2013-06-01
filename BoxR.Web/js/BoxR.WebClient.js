﻿var __extends = this.__extends || function (d, b) {
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
            var quitButton = document.getElementById("quitGame");
            quitButton.style.display = "block";
            var height = $(this.Blanket).height() * 0.65;
            var container = document.getElementById("container");
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
                document.getElementById("quitBtn").onclick = function () {
                    return _this.QuitPopup();
                };
            });
        };
        WebClient.prototype.InvitedPopup = function (user) {
            BoxR.Manager.PopupControl.Invite(user.UserName);
        };
        WebClient.prototype.WaitPopup = function (username) {
            BoxR.Manager.PopupControl.Wait(username);
        };
        WebClient.prototype.QuitPopup = function () {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("quitPopup").style.display = "block";
            }
        };
        WebClient.prototype.DisconnectPopup = function () {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("disconnectPopup").style.display = "block";
            }
        };
        WebClient.prototype.WinPopup = function () {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("winPopup").style.display = "block";
            }
        };
        WebClient.prototype.LosePopup = function () {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("losePopup").style.display = "block";
            }
        };
        WebClient.prototype.ClosePopup = function () {
            BoxR.Manager.PopupControl.Hide();
        };
        return WebClient;
    })(BoxR.ClientBase);
    BoxR.WebClient = WebClient;    
})(BoxR || (BoxR = {}));
