/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Server.ts"/>


module BoxR {
    "use strict";

    export interface IClient {
        StartGame(selfStart: bool, name: string, opponentName: string);
        SetServer(server: BoxR.Server);
        InvitedPopup(user);
        WaitPopup(username:string);
        QuitPopup();
        DisconnectPopup();
        WinPopup();
        LosePopup();
        ClosePopup();        
    }

    export class ClientBase implements IClient {
        Server: BoxR.Server;
        SetServer(server: BoxR.Server) {
            this.Server = server;
        }
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
    }
}