/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Manager.ts"/>
/// <reference path="lib/jquery.d.ts"/>

module BoxR {
    var dummychars = "Ù";
    export class Server {
        constructor() {
            var _this = this;

            BoxR.Manager.Hub.client.alertDuplicate = function () {
                var header = document.getElementById('header');
                var span = document.createElement("span");
                span.textContent = "You are already logged in with another window.";
                span.className = "error";
                if (header) {
                    header.appendChild(span);
                }
            }

            BoxR.Manager.Hub.client.receiveUsers = function (users) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                for (var i in users) {
                    if(users[i].ConnectionId != BoxR.Manager.Hub.connection.id)
                        userList.appendChild(_this.createDivFromUser(users[i]));
                }
            };

            BoxR.Manager.Hub.client.receiveUser = function (user) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                if(user.ConnectionId != BoxR.Manager.Hub.connection.id)
                    userList.appendChild(_this.createDivFromUser(user));
            };

            BoxR.Manager.Hub.client.removeUser = function (connectionId) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                var user = document.getElementById(connectionId);
                userList.removeChild(user);
            };

            BoxR.Manager.Hub.client.invited = function (user) {
                BoxR.Manager.Client.InvitedPopup(user);
            };
            
            BoxR.Manager.Hub.client.waitInvite = function (username) {
                BoxR.Manager.Client.WaitPopup(username);
            };


            BoxR.Manager.Hub.client.inviteDenied = function () {
                BoxR.Manager.Client.ClosePopup();
            };

            BoxR.Manager.Hub.client.startGame = function (selfStart, name, opponentname) {
                BoxR.Manager.Client.ClosePopup();
                BoxR.Manager.Client.StartGame(selfStart, name, opponentname);
            };

            BoxR.Manager.Hub.client.edgeClicked = function (i, j) {
                BoxR.Manager.Game.EdgeClickFromServer(i, j);
            };

            BoxR.Manager.Hub.client.alertDisconnect = function () {
                BoxR.Manager.Client.DisconnectPopup();
            };
        }

        UpdateUsers() {
            BoxR.Manager.Hub.server.getUsers();
        }

        UpdateRound(selfround) {
            if(!selfround){
                $("#redturn").animate({width:"120px",marginLeft:"0px"});
                $("#blueturn").animate({width:"0px",marginLeft:"0px"});
            }
            else{
                $("#blueturn").animate({width:"120px",marginLeft:"0px"});
                $("#redturn").animate({width:"0px",marginLeft:"0px"});
            }
       }

        UpdateSelfScore(score) {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = score;
        }

        UpdateOpponentScore(score) {
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = score;
        }
         
        displayError(error,logerror) {
            var errorDiv = document.getElementById('error');
            errorDiv.textContent = error;
            console.log(logerror || error); // ez kiraly
        }

        HideError() {
            var errorDiv = document.getElementById('error');
            errorDiv.innerHTML = "&nbsp;";
        }

        private createDivFromUser(user) : HTMLElement {
            var _this = this;
            var div = document.createElement("div");
            div.id = user.ConnectionId;
            div.className = "user";

            var span = document.createElement("span");
            span.textContent = user.UserName;

            div.appendChild(span);
            div.onclick = () => { // magic syntax
                BoxR.Manager.Hub.server.invite(div.id);
            };

            return div;
        }
    }
}