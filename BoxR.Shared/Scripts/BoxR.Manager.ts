/// <reference path="BoxR.Game.ts"/>
/// <reference path="BoxR.Server.ts"/>
/// <reference path="BoxR.IClient.ts"/>

module BoxR {
    export module Manager {
        export var Connection: any;
        export var Hub: any;
        export var Server: BoxR.Server;
        export var Client: BoxR.IClient;
        export var Game: BoxR.Game;
    }
}