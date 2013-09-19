var BoxR;
(function (BoxR) {
    var dummychars = "Ù";
    "use strict";
    var ClientBase = (function () {
        function ClientBase() { }
        ClientBase.prototype.StartGame = function (selfStart, name, opponentName) {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.InvitedPopup = function (user) {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.WaitPopup = function (username) {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.QuitPopup = function () {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.DisconnectPopup = function () {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.WinPopup = function () {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.LosePopup = function () {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.ClosePopup = function () {
            throw new Error('abstract method, override in derived class');
        };
        ClientBase.prototype.UpdateSelfScore = function (score) {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = score;
        };
        ClientBase.prototype.UpdateOpponentScore = function (score) {
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = score;
        };
        return ClientBase;
    })();
    BoxR.ClientBase = ClientBase;    
})(BoxR || (BoxR = {}));
