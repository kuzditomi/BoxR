var BoxR;
(function (BoxR) {
    var Popups = (function () {
        function Popups(gameHub, popupControl) {
            this.gameHub = gameHub;
            this.popupControl = popupControl;
            this.greenColor = "#77B900";
            this.redColor = "#AD103C";
        }
        Popups.prototype.Invited = function (name) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "Accept",
                        background: this.greenColor,
                        click: function () {
                            _this.gameHub.server.inviteAccepted();
                            _this.popupControl.Hide();
                        }
                    }, 
                    {
                        text: "Deny",
                        background: this.redColor,
                        click: function () {
                            _this.gameHub.server.inviteDenied();
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: name + " has challanged you!"
            };
        };
        Popups.prototype.Wait = function (name) {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "Suspend invite",
                        background: this.redColor,
                        click: function () {
                            _this.gameHub.server.inviteDenied();
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: "You have challanged " + name + ". Please wait for his response!"
            };
        };
        Popups.prototype.Quit = function () {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "Quit",
                        background: this.redColor,
                        click: function () {
                            _this.gameHub.server.inviteDenied();
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }, 
                    {
                        text: "Cancel",
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                        }
                    }
                ],
                text: "Are you sure? By quiting the game, your opponent will win."
            };
        };
        Popups.prototype.Disconnect = function () {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }
                ],
                text: "Your opponent has quit the game."
            };
        };
        Popups.prototype.Win = function () {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }
                ],
                text: "Congratulation, you have won the game!"
            };
        };
        Popups.prototype.Lost = function () {
            var _this = this;
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.redColor,
                        click: function () {
                            _this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }
                ],
                text: "You have just lost the game."
            };
        };
        return Popups;
    })();
    BoxR.Popups = Popups;    
})(BoxR || (BoxR = {}));
