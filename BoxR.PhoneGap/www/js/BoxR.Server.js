﻿var BoxR;
(function (BoxR) {
    var dummychars = "Ù";
    var Server = (function () {
        function Server() {
            var _this = this;
            BoxR.Manager.Hub.client.alertDuplicate = function () {
                var header = document.getElementById('header');
                var span = document.createElement("span");
                span.textContent = "You are already logged in with another window.";
                span.className = "error";
                if(header) {
                    header.appendChild(span);
                }
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
                if(user.ConnectionId != BoxR.Manager.Hub.connection.id) {
                    userList.appendChild(_this.createDivFromUser(user));
                }
            };
            BoxR.Manager.Hub.client.removeUser = function (connectionId) {
                var userList = document.getElementById("userList");
                var user = document.getElementById(connectionId);
                if(!userList || !user) {
                    return;
                }
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
                BoxR.Manager.Game.EdgeClickFromServerByCoordinate(i, j);
            };
            BoxR.Manager.Hub.client.alertDisconnect = function () {
                BoxR.Manager.Client.DisconnectPopup();
            };
        }
        Server.prototype.UpdateUsers = function () {
            BoxR.Manager.Hub.server.getUsers();
        };
        Server.prototype.UpdateRound = function (selfround) {
            var turnDivWidth = $("#turnDiv").width();
            var turnDivMargin = $("#turnDiv").css('margin-left');
            if(!selfround) {
                $("#turnDiv").animate({
                    width: "0px",
                    marginLeft: "80px"
                }, 300, function () {
                    $("#turnDiv").addClass('tile-red').removeClass('tile-blue');
                    $("#turnDiv h1").text("red turn");
                    $("#turnDiv").animate({
                        width: turnDivWidth,
                        marginLeft: turnDivMargin
                    });
                });
            } else {
                $("#turnDiv").animate({
                    width: "0px",
                    marginLeft: "80px"
                }, 300, function () {
                    $("#turnDiv").addClass('tile-blue').removeClass('tile-red');
                    $("#turnDiv h1").text("blue turn");
                    $("#turnDiv").animate({
                        width: turnDivWidth,
                        marginLeft: turnDivMargin
                    });
                });
            }
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