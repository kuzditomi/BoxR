Popups = function () {
    "use strict";

    var greenColor = "#77B900";
    var redColor = "#AD103C";

    this.Invited = function (name) {
        return {
            buttons: [
                {
                    text: "Accept",
                    background: greenColor,
                    click: function() {
                        gameHub.server.inviteAccepted();
                        popup.Hide();
                    }
                },
                {
                    text: "Deny",
                    background: redColor,
                    click: function() {
                        gameHub.server.inviteDenied();
                        popup.Hide();
                    }
                }],
            text: name + " has challanged you!"
        };
    };
    this.Wait = function (name) {
        return {
            buttons: [
                {
                    text: "Suspend invite",
                    background: redColor,
                    click: function () {
                        gameHub.server.inviteDenied();
                        popup.Hide();
                    }
                }],
            text: "You have challanged " + name + ". Please wait for his response!"
        };
    };
    this.Quit = function() {
        return {
            buttons: [
                {
                    text: "Quit",
                    background: redColor,
                    click: function() {
                        gameHub.server.inviteDenied();
                        popup.Hide();
                        WinJS.Navigation.navigate("/pages/main/main.html");
                    }
                },
                {
                    text: "Cancel",
                    background: greenColor,
                    click: function() {
                        popup.Hide();
                    }
                }],
            text: "Are you sure? By quiting the game, your opponent will win."
        };
    };
    this.Disconnect = function() {
        return {
            buttons: [
                {
                    text: "OK",
                    background: greenColor,
                    click: function() {
                        popup.Hide();
                        WinJS.Navigation.navigate("/pages/main/main.html");
                    }
                }],
            text: "Your opponent has quit the game."
        };
    };
    this.Win = function () {
        return {
            buttons: [
                {
                    text: "OK",
                    background: greenColor,
                    click: function() {
                        popup.Hide();
                        WinJS.Navigation.navigate("/pages/main/main.html");
                    }
                }],
            text: "Congratulation, you have won the game!"
        };
    };
    this.Lost = function () {
        return {
            buttons: [
                {
                    text: "OK",
                    background: redColor,
                    click: function() {
                        popup.Hide();
                        WinJS.Navigation.navigate("/pages/main/main.html");
                    }
                }],
            text: "You have just lost the game."
        };
    };
}