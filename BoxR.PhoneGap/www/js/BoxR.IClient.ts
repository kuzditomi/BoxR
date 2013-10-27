/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Server.ts"/>
module BoxR {
    var dummychars = "Ù";
    "use strict";

    export interface IClient {
        StartGame(selfStart: bool, name: string, opponentName: string);
        InvitedPopup(user);
        WaitPopup(username:string);
        QuitPopup();
        DisconnectPopup();
        WinPopup();
        LosePopup();
        ClosePopup();        

        UpdateSelfScore(score);
        UpdateOpponentScore(score);
    }

    export class ClientBase implements IClient {
        StartGame(selfStart: bool, name: string, opponentName: string) { 
            throw new Error('abstract method, override in derived class');
        }
        InvitedPopup(user){ 
            throw new Error('abstract method, override in derived class');
        }
        WaitPopup(username:string){ 
            throw new Error('abstract method, override in derived class');
        }
        QuitPopup() {
            throw new Error('abstract method, override in derived class');
        }
        DisconnectPopup(){ 
            throw new Error('abstract method, override in derived class');
        }
        WinPopup(){ 
            throw new Error('abstract method, override in derived class');
        }
        LosePopup(){ 
            throw new Error('abstract method, override in derived class');
        }
        ClosePopup(){ 
            throw new Error('abstract method, override in derived class');
        } 

        UpdateSelfScore(score) {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = score;
        }

        UpdateOpponentScore(score) {
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = score;
        }
    }
}