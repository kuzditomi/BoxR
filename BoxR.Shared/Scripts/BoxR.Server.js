var BoxR;
(function (BoxR) {
    var Server = (function () {
        function Server() {
            var _this = this;
            BoxR.Manager.Hub.client.alertDuplicate = function () {
                var header = document.getElementById('header');
                var span = document.createElement("span");
                span.textContent = "You are already logged in with another window.";
                span.className = "error";
                header.appendChild(span);
            };
            BoxR.Manager.Hub.client.receiveUsers = function (users) {
                var userList = document.getElementById("userList");
                if(!userList) {
                    return;
                }
                for(var i in users) {
                    if(users[i].ConnectionId != BoxR.Manager.Hub.connection.id) {
                        userList.appendChild(_this.createDivFromUser(users[i]));
                    }
                }
            };
            BoxR.Manager.Hub.client.receiveUser = function (user) {
                var userList = document.getElementById("userList");
                if(!userList) {
                    return;
                }
                userList.appendChild(_this.createDivFromUser(user));
            };
            BoxR.Manager.Hub.client.removeUser = function (connectionId) {
                var userList = document.getElementById("userList");
                if(!userList) {
                    return;
                }
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
        Server.prototype.UpdateUsers = function () {
            BoxR.Manager.Hub.server.getUsers();
        };
        Server.prototype.UpdateRound = function (selfround) {
            var counterdiv = document.getElementById('roundcounter');
            counterdiv.innerHTML = selfround ? 'YOUR TURN' : "OPPONENT'S TURN!";
        };
        Server.prototype.UpdateSelfScore = function (score) {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = score;
        };
        Server.prototype.UpdateOpponentScore = function (score) {
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = score;
        };
        Server.prototype.displayError = function (error, logerror) {
            var errorDiv = document.getElementById('error');
            errorDiv.textContent = error;
            console.log(logerror || error);
        };
        Server.prototype.HideError = function () {
            var errorDiv = document.getElementById('error');
            errorDiv.innerHTML = "&nbsp;";
        };
        Server.prototype.createDivFromUser = function (user) {
            var _this = this;
            var div = document.createElement("div");
            div.id = user.ConnectionId;
            div.className = "user";
            var span = document.createElement("span");
            span.textContent = user.UserName;
            div.appendChild(span);
            div.onclick = function () {
                BoxR.Manager.Hub.server.invite(div.id);
            };
            return div;
        };
        return Server;
    })();
    BoxR.Server = Server;    
})(BoxR || (BoxR = {}));
