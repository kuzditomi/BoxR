/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Game.ts"/>

module BoxR {

    export class Server {
        public gameHub;
        private client: IClient;
        private game: Game;

        constructor(gameHub,client:IClient) {
            var _this = this;
            this.client = client;
            this.gameHub = gameHub;

            gameHub.client.alertDuplicate = function () {
                var header = document.getElementById('header');
                var span = document.createElement("span");
                span.textContent = "You are already logged in with another window.";
                span.className = "error";
                header.appendChild(span);
            }

            gameHub.client.receiveUsers = function (users) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                for (var i in users) {
                    userList.appendChild(_this.createDivFromUser(users[i])); // TODO: eleg csunya... vagy nem?
                }
            };

            gameHub.client.receiveUser = function (user) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                userList.appendChild(_this.createDivFromUser(user));
            };

            gameHub.client.removeUser = function (connectionId) {
                var userList = document.getElementById("userList");
                if(!userList)
                    return;
                var user = document.getElementById(connectionId);
                userList.removeChild(user);
            };

            gameHub.client.invited = function (user) {
                _this.client.InvitedPopup(user);
            };
            
            gameHub.client.waitInvite = function (username) {
                _this.client.WaitPopup(username);
            };


            gameHub.client.inviteDenied = function () {
                _this.client.ClosePopup();
            };

            gameHub.client.startGame = function (selfStart, name, opponentname) {
                _this.client.ClosePopup();
                _this.client.StartGame(selfStart, name, opponentname);
            };

            gameHub.client.edgeClicked = function (i, j) {
                _this.game.EdgeClickFromServer(i, j);
            };

            gameHub.client.alertDisconnect = function () {
                _this.client.DisconnectPopup();
            };
        }

        UpdateUsers() {
            this.gameHub.server.getUsers();
        }

        UpdateRound(selfround) {
            var counterdiv = document.getElementById('roundcounter');
            counterdiv.innerHTML = selfround ? 'YOUR TURN' : "OPPONENT'S TURN!";
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
        
        SetGame(game: BoxR.Game) {
            this.game = game;
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
               this.gameHub.server.invite(div.id);
            };

            return div;
        }
    }
}