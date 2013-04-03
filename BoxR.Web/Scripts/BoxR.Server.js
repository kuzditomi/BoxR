var BoxR;
(function (BoxR) {
    var Server = (function () {
        function Server(gameHub, client) {
            var _this = this;
            this.client = client;
            this.gameHub = gameHub;
            var userList = document.getElementById("userList");
            gameHub.client.alertDuplicate = function () {
                var header = document.getElementById('header');
                var span = document.createElement("span");
                span.textContent = "You are already logged in with another window.";
                span.className = "error";
                header.appendChild(span);
            };
            gameHub.client.receiveUsers = function (users) {
                for(var i in users) {
                    userList.appendChild(_this.createDivFromUser(users[i]));
                }
            };
            gameHub.client.receiveUser = function (user) {
                userList.appendChild(BoxR.Server.prototype.createDivFromUser(user));
            };
            gameHub.client.removeUser = function (connectionId) {
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
        Server.prototype.UpdateUsers = function () {
            this.gameHub.server.getUsers();
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
        Server.prototype.SetGame = function (game) {
            this.game = game;
        };
        Server.prototype.createDivFromUser = function (user) {
            var _this = this;
            var _this = this;
            var div = document.createElement("div");
            div.id = user.ConnectionId;
            div.className = "user";
            var span = document.createElement("span");
            span.textContent = user.UserName;
            div.appendChild(span);
            div.onclick = function () {
                _this.gameHub.server.invite(div.id);
            };
            return div;
        };
        return Server;
    })();
    BoxR.Server = Server;    
})(BoxR || (BoxR = {}));
