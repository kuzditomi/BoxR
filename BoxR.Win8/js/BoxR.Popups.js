var BoxR;
(function (BoxR) {
    var dummychars = "Ù";
    var Popups = (function () {
        function Popups(popupControl) {
            this.popupControl = popupControl;
            this.greenColor = "#77B900";
            this.redColor = "#AD103C";
        }
        Popups.prototype.Invited = function (name) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: WinJS.Resources.getString("accept").value,
                        background: this.greenColor,
                        click: function () {
                            BoxR.Manager.Hub.server.inviteAccepted();
                            _this.popupControl.Hide();
                        }
                    }, 
                    {
                        text: WinJS.Resources.getString("deny").value,
                        background: this.redColor,
                        click: function () {
                            BoxR.Manager.Hub.server.inviteDenied();
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: name + WinJS.Resources.getString("challengedyou").value
            };
        };
        Popups.prototype.Wait = function (name) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: WinJS.Resources.getString("suspend").value,
                        background: this.redColor,
                        click: function () {
                            BoxR.Manager.Hub.server.inviteDenied();
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: WinJS.Resources.getString("youchallanged").value + name + ". " + WinJS.Resources.getString("pleasewait").value
            };
        };
        Popups.prototype.Quit = function () {
            var _this = this;
            return {
                buttons: [
                    {
                        text: WinJS.Resources.getString("quit").value,
                        background: this.redColor,
                        click: function () {
                            BoxR.Manager.Hub.server.quitGame();
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/users/users.html");
                        }
                    }, 
                    {
                        text: WinJS.Resources.getString("cancel").value,
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: WinJS.Resources.getString("quitquestion").value
            };
        };
        Popups.prototype.Disconnect = function (isSinglePlayer) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }
                ],
                text: WinJS.Resources.getString("opponentquit").value
            };
        };
        Popups.prototype.Win = function (isSinglePlayer) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }
                ],
                text: WinJS.Resources.getString("wingame").value
            };
        };
        Popups.prototype.Lost = function (isSinglePlayer) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.redColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }
                ],
                text: WinJS.Resources.getString("lostgame").value
            };
        };
        return Popups;
    })();
    BoxR.Popups = Popups;    
})(BoxR || (BoxR = {}));
