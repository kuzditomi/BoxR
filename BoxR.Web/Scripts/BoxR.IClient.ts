/// <reference path="BoxR.Game.ts"/>


module BoxR {
    "use strict";

    export interface IClient {
        StartGame(selfStart: bool, name: string, opponentName: string) :Game;
        SetServer(server: BoxR.Server);
        InvitedPopup(user);
        WaitPopup(username:string);
        QuitPopup();
        DisconnectPopup();
        WinPopup();
        LosePopup();
        ClosePopup();        
    }
}