/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Server.ts"/>
module BoxR {
    "use strict";
    var dummychars = "Ù";
    
    var INFINITY = 300;
    var selfBoxColor = 'rgb(27,161,226)';
    var opponentBoxColor = 'rgb(242,20,0)';
    var backgroundColor = 'rgb(256,256,256)';
    export var activeColor = 'rgb(27,161,226)';
    var IsSelfRound :bool = false;

    //#region "Drawables"
    export class Drawable {
        active: bool;
        ctx: CanvasRenderingContext2D;
        x: number;
        y: number;
        constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
            this.active = false;
            this.ctx = ctx;
            this.x = x;
            this.y = y;
        }

        //Draw method
        Draw() { }

        // click eventhandler 
        // return true, if this is the clicked Drawable)
        Click(x: number, y: number): ClickResponse {
            return new ClickResponse(false, 0);
        }
    };

    export class Edge extends Drawable {
        private isHorizontal: bool;
        private radius: number;
        private width: number;
        private height: number;
        public Squeres: Squere[];
        private mouseover: bool;

        constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, isHorizontal: bool) {
            super(ctx, x, y);
            this.width = width;
            this.height = height;
            this.isHorizontal = isHorizontal;
            this.Squeres = new Squere[];
            this.mouseover = false;
        }

        public Draw() {
            this.ctx.strokeStyle = "black";
            if (this.active) {
                this.ctx.fillStyle = activeColor;
            }
            else {
                if (this.mouseover) {
                    this.ctx.fillStyle = activeColor;
                }
                else {
                    this.ctx.fillStyle = backgroundColor;
                }
            }
            this.ctx.beginPath();
            if (this.isHorizontal) {
                this.ctx.moveTo(this.x + this.width / 6.0, this.y);
                this.ctx.lineTo(this.x + this.width * 5.0 / 6.0, this.y);
                this.ctx.lineTo(this.x + this.width, this.y + this.height / 2.0);
                this.ctx.lineTo(this.x + this.width * 5.0 / 6.0, this.y + this.height);
                this.ctx.lineTo(this.x + this.width / 6.0, this.y + this.height);
                this.ctx.lineTo(this.x, this.y + this.height / 2.);
            }
            else {
                this.ctx.moveTo(this.x + this.width / 2.0, this.y);
                this.ctx.lineTo(this.x + this.width, this.y + this.height / 6.0);
                this.ctx.lineTo(this.x + this.width, this.y + this.height * 5.0 / 6.0);
                this.ctx.lineTo(this.x + this.width / 2.0, this.y + this.height);
                this.ctx.lineTo(this.x, this.y + this.height * 5.0 / 6.0);
                this.ctx.lineTo(this.x, this.y + this.height / 6.0);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.closePath();
        }

        public MouseOver(x: number, y: number) {
            if (this.active)
                return;

            if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
                this.mouseover = true;
                this.Draw();
            }
            else if (this.mouseover) {
                this.mouseover = false;
                this.Draw();
            }

            this.ctx.stroke();
        }

        public AddSquere(squere: Squere) {
            this.Squeres.push(squere);
        }

        public Click(x, y): ClickResponse {
            if (this.active)
                return new ClickResponse(false, 0);

            if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
                return new ClickResponse(true, this.Activate());
            }

            return new ClickResponse(false, 0);
        }
        public Activate(): number {
            this.active = true;
            var squereactivated = 0;
            this.Squeres.forEach(function (squere) {
                if (squere.EdgeChecked())
                    squereactivated++;
            });

            return squereactivated;
        }
    }

     export class Squere extends Drawable {
        public edges: Edge[];
        private width: number;
        private animated: bool;
        private color: string;

        constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
            super(ctx, x, y);
            this.width = width;
            this.animated = false;
            this.edges = new Edge[];
        }

        public EdgeChecked(): bool {
            if (this.EdgesChecked() == 4) {
                this.active = true;
                this.color = IsSelfRound ? selfBoxColor : opponentBoxColor;
                return true;
            }
            return false;
        }

        public EdgesChecked():number { 
            var count = 0; 
            for (var i = 0; i < this.edges.length;i++){
                count += this.edges[i].active ? 1 : 0;
            }
            return count;
        }

        public Draw() {
            if (!this.active)
                return;

            if (!this.animated) {
                var steps = 120;
                var i = 0;
                var mode = 0; // used for animation
                var _this = this;

                _this.ctx.fillStyle = _this.color;
                _this.ctx.strokeStyle = 'black';

                _this.ctx.beginPath();
                _this.ctx.rect(_this.x, _this.y, _this.width, _this.width);
                _this.ctx.closePath();

                _this.ctx.fill();
                _this.ctx.stroke();
                    i++;
                
                var interval = setInterval(function () {
                    if (mode == 0) {
                        _this.ctx.clearRect(_this.x -1 , _this.y -1 ,_this.width + 2, _this.width + 2);

                        _this.ctx.beginPath();
                        _this.ctx.rect(_this.x + i, _this.y, _this.width - (i * 2), _this.width);
                        _this.ctx.closePath();
                        _this.ctx.fillStyle = _this.color;
                        _this.ctx.fill();

                        //_this.ctx.stroke();
                        i+=2;
                        if (i >= _this.width / 2) {
                            mode = 1; // now the size is 0, has to revert
                        }
                    }else{
                        _this.ctx.beginPath();
                        _this.ctx.rect(_this.x + i, _this.y, _this.width - (i * 2), _this.width);
                        _this.ctx.closePath();
                        _this.ctx.fillStyle = _this.color;
                        _this.ctx.fill();

                        //_this.ctx.stroke();
                        i-=3;
                        if (i <= 0) {
                            clearInterval(interval);
                        }
                    }
                }, 10);
                this.animated = true;
            }
            else {
                this.ctx.fillStyle = this.color;
                this.ctx.strokeStyle = 'black';

                this.ctx.beginPath();
                this.ctx.rect(this.x, this.y, this.width, this.width);
                this.ctx.closePath();

                this.ctx.fill();
                //this.ctx.stroke();
            }
        }
    }
    //#endregion
    
    //#region Models
    export class ClickResponse {
        public EdgeActivated: bool;
        public SquereActivated: number;

        constructor(edgeActivated: bool, squereActivated: number) {
            this.EdgeActivated = edgeActivated;
            this.SquereActivated = squereActivated;
        }
    }
    
    export class Coordinate{
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        };
    }
    //#endregion
    
    //#region Game class
    export class Game {
        ctx: CanvasRenderingContext2D;
        private Edges: Edge[][];
        private Squares: Squere[][];
        private IsSinglePlayer: bool;

        public n: number;
        public LeftOffset: number;
        public TopOffset: number;
        public Width: number;
        public selfScore: number;
        public opponentScore: number;


        constructor(canvas: HTMLElement,issingleplayer:bool = false) {
            this.ctx = (<HTMLCanvasElement>canvas).getContext('2d');
            this.LeftOffset = canvas.offsetLeft; //canvas.getBoundingClientRect().left;
            this.TopOffset = canvas.getBoundingClientRect().top;
            this.Width = canvas.clientWidth;
            this.IsSinglePlayer = issingleplayer;
        }

        public Init(n: number, selfstart: bool) {
            this.n = n;
            this.Clear();
            this.Edges = new Edge[][];
            this.Squares = new Squere[][];

            var squereWidthToUnit = 7; // means 7:1
            //unit is the width of a 'corner' which is actually not drawn
            var unit = this.Width / ((n * squereWidthToUnit) + (n + 1) + 2);

            // simple offset, alternate_offset
            var verticalOffset = [unit, 2 * unit];

            // simple offset, alternate_offset
            var horizontalOffset = [2 * unit, unit];

            var squereEdge = squereWidthToUnit * unit;

            // simple width, alternate width
            var width = [squereEdge, unit];

            // simple height, alternate height
            var height = [unit, squereEdge];

            for (var i = 0; i < 2 * n + 1; i++) {
                this.Edges[i] = new Edge[];
                this.Squares[i/2 - 1] = new Squere[];
                var isAlternateRow = i % 2; // 0,2,4 is alternative, these are for the horizontal edges
                var m = isAlternateRow == 0 ? n : n + 1;
                for (var j = 0; j < m; j++) {
                    this.Edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);

                    if (isAlternateRow == 0 && i > 0) {
                        var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                        this.Squares[i/2 - 1][j] = sq;
                        this.Edges[i][j].AddSquere(sq);
                        this.Edges[i - 1][j + 1].AddSquere(sq);
                        this.Edges[i - 2][j].AddSquere(sq);
                        this.Edges[i - 1][j].AddSquere(sq);

                        sq.edges.push(this.Edges[i][j]);
                        sq.edges.push(this.Edges[i - 1][j + 1]);
                        sq.edges.push(this.Edges[i - 2][j]);
                        sq.edges.push(this.Edges[i - 1][j]);
                    }
                }
            }

            IsSelfRound = selfstart;
            this.selfScore = 0;
            this.opponentScore = 0;
            if(!this.IsSinglePlayer)
                BoxR.Manager.Server.UpdateRound(IsSelfRound);
        }

        public Draw() {
            this.Clear();
            this.Edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.Draw();
                });
            });
            this.Squares.forEach(function (row) {
                row.forEach(function (sq) {
                    sq.Draw();
                });
            });
        }

        public Clear() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientWidth);
        }

        public Click(e: MouseEvent) {
            if (!IsSelfRound)
                return;

            var click_X = e.pageX - this.LeftOffset;
            var click_Y = e.pageY - this.TopOffset;

            if (!e.pageX || !e.pageY) {
                click_X = e.x - this.LeftOffset;
                click_Y = e.y - this.TopOffset;
            }

            var _this = this;
            this.Edges.forEach(function (row, i) {
                row.forEach(function (edge, j) {
                    var response = edge.Click(click_X, click_Y);
                    if (response.EdgeActivated) {
                        if(!_this.IsSinglePlayer)
                            BoxR.Manager.Hub.server.edgeClicked(i, j);
                        _this.selfScore += response.SquereActivated;
                        if (response.SquereActivated == 0)
                            _this.NextRound();
                        else
                            _this.UpdateScore();
                        _this.Draw();
                        return;
                    }
                });
            });
        }

        public MouseMove(e: MouseEvent) {
            if (!IsSelfRound)
                return;

            var x = e.clientX - this.LeftOffset;
            var y = e.clientY - this.TopOffset;

            this.Edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.MouseOver(x, y);
                });
            });

            this.Draw();
        }

        public EdgeClickFromServerByCoordinate(i: number, j: number) {
            if (!this.Edges[i][j].active) {
                var squeractivated = this.Edges[i][j].Activate();
                this.opponentScore += squeractivated;
                if (squeractivated == 0)
                    this.NextRound();
                else
                    this.UpdateScore();
                this.Draw();
            }
        }

        public EdgeClickFromServerByEdge(edge: Edge) :bool {
            var _this = this;
            if (!edge.active) {
                var squeractivated = edge.Activate();
                _this.opponentScore += squeractivated;
                if (squeractivated == 0) {
                    _this.Draw();
                    return false;
                }
                else {
                    _this.UpdateScore();
                    _this.Draw();
                    return true;
                }
            }
            return false;
        }

        private UpdateScore() {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = this.selfScore.toString();
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = this.opponentScore.toString();

            if (!this.IsSinglePlayer) {
                BoxR.Manager.Server.UpdateSelfScore(this.selfScore);
                BoxR.Manager.Server.UpdateOpponentScore(this.opponentScore);
            }
            if (this.selfScore + this.opponentScore == this.n * this.n) {
                if (!this.IsSinglePlayer){
                    BoxR.Manager.Hub.server.finishGame();
                    if (this.selfScore > this.opponentScore)
                        BoxR.Manager.Client.WinPopup();
                    else
                        BoxR.Manager.Client.LosePopup();
                }
                else{
                    if (this.selfScore > this.opponentScore)
                        BoxR.Manager.PopupControl.Win();
                    else
                        BoxR.Manager.PopupControl.Lose();
                }
                return;
            }
        }

        private NextRound() {
            IsSelfRound ^= true;
            if (!this.IsSinglePlayer)
                BoxR.Manager.Server.UpdateRound(IsSelfRound);
            else if(!IsSelfRound){
                this.MachineClick();
            }
        }

        //#region Single player functions
        // AI clicks now
        private MachineClick() {
            var _this = this;

            setTimeout(() => {
                var fourthEdge = this.FourthClick();
                var nextEdge = this.CleverClick(0) || this.CleverClick(1);
                if (nextEdge) { // még van olyan, aminek csak a második élét húzom be
                    if (fourthEdge) { // be lehet keríteni négyzetet, ilyenkor veszély nélkül
                        _this.EdgeClickFromServerByEdge(fourthEdge);
                        _this.MachineClick();
                    } else {
                        _this.EdgeClickFromServerByEdge(nextEdge);
                        _this.NextRound();
                    }
                }
                else { // minimax
                    var gameState = this.getGameState();
                    var myWorker = new Worker("/js/BoxR.MiniMax.js");
                    myWorker.postMessage({gameState: gameState,depth: 6});
                    myWorker.onmessage = function (e) {
                        var needContinue = _this.EdgeClickFromServerByEdge(_this.Edges[e.data.nextClick.i][e.data.nextClick.j]);
                        if (needContinue)
                            _this.MachineClick();
                        else
                            _this.NextRound();
                    };
                }
            }, 1000);
        }
        // finds the squere with the lowest possible surrounding edge activated
        private CleverClick(activeEdges : number) :Edge{
            if (activeEdges == 2) {
                return null;
            }
            var clicked = false;
            var available = new Edge[];
            for (var i = 0; i < this.Edges.length;i++){
                for (var j = 0; j < this.Edges[i].length;j++){
                    if (!this.Edges[i][j].active) {
                        available.push(this.Edges[i][j]);
                    }
                }
            }
            while(!clicked && available.length > 0){
                var random = Math.floor(Math.random() * available.length);
                
                var edge = available[random];
                if(edge.Squeres[0].EdgesChecked() <= activeEdges && (edge.Squeres.length == 1 || edge.Squeres[1].EdgesChecked() <= activeEdges)){
                    return edge;
                    clicked = true;
                }
                available.splice(random, 1);
            }
            if(!clicked){
                return null;
            }
        }

        // checks for any Squere with 3 surrounding edge, to finish it
        private FourthClick() :Edge{
            var find = false;
            var edge:Edge;
            for (var i = 0; i < this.Squares.length && !find;i++){
                for (var j = 0; j < this.Squares[i].length && !find;j++){
                    var sq = this.Squares[i][j];
                    if(sq.EdgesChecked() == 3){
                        for (var e = 0; e < sq.edges.length;e++)
                            if(!sq.edges[e].active){
                                edge = sq.edges[e];
                                find = true;
                            }
                    }
                }
            }
            if(find){
                return edge;
            }
            return null;
        }

        // create gameState object
        private getGameState(){
            var gameState = {};
            // add edges as booleans
            gameState["edges"] = new bool[][];
            for (var i = 0; i < this.Edges.length;i++){
                gameState["edges"][i] = new bool[];
                for (var j = 0; j < this.Edges[i].length; j++) {
                    gameState["edges"][i][j] = this.Edges[i][j].active;
                }
            }

            // add squares as booleans
            gameState["squares"] = new number[][];
            for (var i = 0; i < this.Squares.length;i++){
                gameState["squares"][i] = new bool[];
                for (var j = 0; j < this.Squares[i].length; j++) {
                    gameState["squares"][i][j] = this.Squares[i][j].EdgesChecked();
                }
            }

            // add the scores
            gameState["opponentScore"] = this.opponentScore;
            gameState["selfScore"] = this.selfScore;
            gameState["n"] = this.n;

            // who has the turn? false - AI, true - Player
            gameState["turn"] = IsSelfRound;

            return gameState;
        }
        //#endregion
    }
    //#endregion
}