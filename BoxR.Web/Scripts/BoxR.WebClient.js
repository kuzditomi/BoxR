var BoxR;
(function (BoxR) {
    "use strict";
    var WebClient = (function () {
        function WebClient() {
            this.Blanket = document.getElementById("blanket");
        }
        WebClient.prototype.SetServer = function (server) {
            this.Server = server;
        };
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
                game = new BoxR.Game(canvas, _this.Server, _this);
                game.Init(3, selfStart);
                game.Draw();
                canvas.addEventListener("click", function (e) {
                    game.Click(e);
                }, true);
                canvas.addEventListener("mousemove", function (e) {
                    game.MouseMove(e);
                });
                _this.Server.SetGame(game);
            });
            return game;
        };
        WebClient.prototype.InvitedPopup = function (user) {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("inviterName").innerHTML = user.UserName;
                document.getElementById("invitedPopup").style.display = "block";
            }
        };
        WebClient.prototype.WaitPopup = function (username) {
            if(this.Blanket.style.display == "none") {
                this.Blanket.style.display = "table";
                document.getElementById("invitedName").innerHTML = username;
                document.getElementById("waitPopup").style.display = "block";
            }
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
            this.Blanket.style.display = "none";
        };
        return WebClient;
    })();
    BoxR.WebClient = WebClient;    
})(BoxR || (BoxR = {}));
