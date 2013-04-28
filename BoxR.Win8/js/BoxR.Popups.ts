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
                        text: "Accept",
                        background: this.greenColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteAccepted();
                            this.popupControl.Hide();
                        }
                    },
                    {
                        text: "Deny",
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteDenied();
                            this.popupControl.Hide();
                        }
                    }],
                text: name + " has challanged you!"
            };
        }

        Wait(name: string): any {
            return {
                buttons: [
                    {
                        text: "Suspend invite",
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.inviteDenied();
                            this.popupControl.Hide();
                        }
                    }],
                text: "You have challanged " + name + ". Please wait for his response!"
            };
        }

        Quit(): any {
            return {
                buttons: [
                    {
                        text: "Quit",
                        background: this.redColor,
                        click: () => {
                            BoxR.Manager.Hub.server.quitGame();
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    },
                    {
                        text: "Cancel",
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                        }
                    }],
                text: "Are you sure? By quiting the game, your opponent will win."
            };
        }

        Disconnect(): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }],
                text: "Your opponent has quit the game."
            };
        }

        Win(): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.greenColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }],
                text: "Congratulation, you have won the game!"
            };
        }

        Lost(): any {
            return {
                buttons: [
                    {
                        text: "OK",
                        background: this.redColor,
                        click: () => {
                            this.popupControl.Hide();
                            WinJS.Navigation.navigate("/pages/main/main.html");
                        }
                    }],
                text: "You have just lost the game."
            };
        }
    }
}