/// <reference path="BoxR.Manager.ts"/>
declare var WinJS;
module BoxR {
    var dummychars = "Ù";
    export class Popups {
        private greenColor: string;
        private redColor: string;

        private popupControl: any;

        constructor(popupControl) {
            this.popupControl = popupControl;
            this.greenColor = "#77B900";
            this.redColor = "#AD103C";
        }

        Invited(name: string): any {
            return {
                buttons: [
                    {
                        text:  WinJS.Resources.getString("accept").value,
                        background: this.greenColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteAccepted();
                            this.popupControl.Hide();
                        }
                    },
                    {
                        text: WinJS.Resources.getString("deny").value,
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteDenied();
                            this.popupControl.Hide();
                        }
                    }],
                text: name + WinJS.Resources.getString("challengedyou").value
            };
        }

        Wait(name: string): any {
            return {
                buttons: [
                    {
                        text: WinJS.Resources.getString("suspend").value,
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteDenied();
                            this.popupControl.Hide();
                        }
                    }],
                text: WinJS.Resources.getString("youchallanged").value + name + ". " + WinJS.Resources.getString("pleasewait").value
            };
        }

        Quit(): any {
            return {
                buttons: [
                    {
                        text: WinJS.Resources.getString("quit").value,
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.quitGame();
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/users/users.html");
                        }
                    },
                    {
                        text: WinJS.Resources.getString("cancel").value,
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                        }
                    }],
                text: WinJS.Resources.getString("quitquestion").value
            };
        }

        Disconnect(isSinglePlayer:bool): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }],
                text: WinJS.Resources.getString("opponentquit").value
            };
        }

        Win(isSinglePlayer:bool): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }],
                text: WinJS.Resources.getString("wingame").value
            };
        }

        Lost(isSinglePlayer:bool): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.redColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate(isSinglePlayer ? "/pages/main/main.html" : "/pages/users/users.html");
                        }
                    }],
                text: WinJS.Resources.getString("lostgame").value
            };
        }
    }
}