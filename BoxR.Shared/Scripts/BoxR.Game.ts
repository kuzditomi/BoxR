/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Server.ts"/>
module BoxR {
    var dummychars = "Ù";
    var IsSelfRound :bool = false;
    "use strict";

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
        public squeres: Squere[];
        private mouseover: bool;

        constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, isHorizontal: bool) {
            super(ctx, x, y);
            this.width = width;
            this.height = height;
            this.isHorizontal = isHorizontal;
            this.squeres = new Squere[];
            this.mouseover = false;
        }

        public Draw() {
            this.ctx.strokeStyle = "black";
            if (this.active) {
                this.ctx.fillStyle = "darkslateblue";
            }
            else {
                if (this.mouseover) {
                    this.ctx.fillStyle = "rgb(27,161,226)";
                }
                else {
                    this.ctx.fillStyle = "slateblue";
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
            this.squeres.push(squere);
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
            this.squeres.forEach(function (squere) {
                if (squere.EdgeChecked())
                    squereactivated++;
            });

            return squereactivated;
        }
    }

    export class Squere extends Drawable {
        public Edges: Edge[];
        private width: number;
        private animated: bool;
        private color: string;

        constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
            super(ctx, x, y);
            this.width = width;
            this.animated = false;
            this.Edges = new Edge[];
        }

        public EdgeChecked(): bool {
            if (this.EdgesChecked() == 4) {
                this.active = true;
                this.color = IsSelfRound ? '27,161,226,' : '290,20,0,';
                return true;
            }
            return false;
        }

        public EdgesChecked():number { 
            var count = 0; 
            for (var i = 0; i < this.Edges.length;i++){
                count += this.Edges[i].active ? 1 : 0;
            }
            return count;
        }

        public Draw() {
            if (!this.active)
                return;

            if (!this.animated) {
                this.color = IsSelfRound ? '27,161,226,' : '290,20,0,';
                var steps = 120;
                var i = 0;
                var _this = this;

                var interval = setInterval(function () {
                    _this.ctx.fillStyle = 'rgba(' + _this.color + i / steps + ')';
                    _this.ctx.strokeStyle = 'black';

                    _this.ctx.beginPath();
                    _this.ctx.rect(_this.x, _this.y, _this.width, _this.width);
                    _this.ctx.closePath();

                    _this.ctx.fill();
                    _this.ctx.stroke();
                    i++;
                    if (i === steps) {
                        clearInterval(interval);
                    }
                }, 30);
                this.animated = true;
            }
            else {
                this.ctx.fillStyle = 'rgba(' + this.color + '1)';
                this.ctx.strokeStyle = 'black';

                this.ctx.beginPath();
                this.ctx.rect(this.x, this.y, this.width, this.width);
                this.ctx.closePath();

                this.ctx.fill();
                this.ctx.stroke();
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

                        sq.Edges.push(this.Edges[i][j]);
                        sq.Edges.push(this.Edges[i - 1][j + 1]);
                        sq.Edges.push(this.Edges[i - 2][j]);
                        sq.Edges.push(this.Edges[i - 1][j]);
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
            if (!this.IsSinglePlayer) {
                BoxR.Manager.Server.UpdateSelfScore(this.selfScore);
                BoxR.Manager.Server.UpdateOpponentScore(this.opponentScore);
            }
            if (this.selfScore + this.opponentScore == this.n * this.n) {
                if (!this.IsSinglePlayer)
                    BoxR.Manager.Hub.server.finishGame();
                if (this.selfScore > this.opponentScore)
                    BoxR.Manager.Client.WinPopup();
                else
                    BoxR.Manager.Client.LosePopup();
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
            setTimeout(() => {
                var nextEdge = this.FourthClick() || this.CleverClick(0);
                var needContinue = this.EdgeClickFromServerByEdge(nextEdge);
                if (needContinue)
                    this.MachineClick();
                else
                    this.NextRound();
            }, 1000);
        }

        // finds the squere with the lowest possible surrounding edge activated
        private CleverClick(activeEdges : number): Edge{
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
                if(edge.squeres[0].EdgesChecked() <= activeEdges && (edge.squeres.length == 1 || edge.squeres[1].EdgesChecked() <= activeEdges)){
                    return edge
                    clicked = true;
                }
                available.splice(random, 1);
            }
            if(!clicked){
                return this.CleverClick(activeEdges + 1);
            }
        }


        // checks for any Squere with 3 surrounding edge, to finish it
        private FourthClick() :Edge{
            var find = false;
            var edge;
            for (var i = 0; i < this.Squares.length && !find;i++){
                for (var j = 0; j < this.Squares[i].length && !find;j++){
                    var sq = this.Squares[i][j];
                    if(sq.EdgesChecked() == 3){
                        for (var e = 0; e < sq.Edges.length;e++)
                            if(!sq.Edges[e].active){
                                edge = sq;
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
        //#endregion
    }
    //#endregion
}