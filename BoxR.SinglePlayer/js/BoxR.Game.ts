declare var $;
var INFINITY = 300;
module BoxR {
    var dummychars = "Ù";
    var IsSelfRound :bool = false;
    "use strict";
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

    export class ClickResponse {
        public EdgeActivated: bool;
        public SquereActivated: number;

        constructor(edgeActivated: bool, squereActivated: number) {
            this.EdgeActivated = edgeActivated;
            this.SquereActivated = squereActivated;
        }
    }

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
                this.color = IsSelfRound ? '27,161,226,' : '290,20,0,';
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

    export class Game {
        ctx: CanvasRenderingContext2D;
        private edges: Edge[][];
        private squares: Squere[][];
        private finished = false;

        n: number;
        LeftOffset: number;
        TopOffset: number;
        Width: number;
        selfScore: number;
        opponentScore: number;


        constructor(canvas: HTMLElement) {
            this.ctx = (<HTMLCanvasElement>canvas).getContext('2d');
            this.LeftOffset = canvas.offsetLeft; //canvas.getBoundingClientRect().left;
            this.TopOffset = canvas.getBoundingClientRect().top;
            this.Width = canvas.clientWidth;
        }

        public Init(n: number, selfstart: bool) {
            this.n = n;
            this.Clear();
            this.selfScore = 0;
            this.opponentScore = 0;
            this.UpdateScore();
            this.edges = new Edge[][];
            this.squares = new Squere[][];

            if(selfstart)
                $("#blueturn").animate({width:"120px",marginLeft:"0px"});
            else
                $("#redturn").animate({ width: "120px", marginLeft: "0px" });

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
                this.edges[i] = new Edge[];
                this.squares[i/2 - 1] = new Squere[];
                var isAlternateRow = i % 2; // 0,2,4 is alternative, these are for the horizontal edges
                var m = isAlternateRow == 0 ? n : n + 1;
                for (var j = 0; j < m; j++) {
                    this.edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);

                    if (isAlternateRow == 0 && i > 0) {
                        var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                        this.squares[i/2 - 1][j] = sq;
                        this.edges[i][j].AddSquere(sq);
                        this.edges[i - 1][j + 1].AddSquere(sq);
                        this.edges[i - 2][j].AddSquere(sq);
                        this.edges[i - 1][j].AddSquere(sq);

                        sq.edges.push(this.edges[i][j]);
                        sq.edges.push(this.edges[i - 1][j + 1]);
                        sq.edges.push(this.edges[i - 2][j]);
                        sq.edges.push(this.edges[i - 1][j]);
                    }
                }
            }

            IsSelfRound = selfstart;
            this.selfScore = 0;
            this.opponentScore = 0;
        }
        public Draw() {
            this.Clear();
            this.edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.Draw();
                });
            });
            this.squares.forEach(function (row) {
                row.forEach(function (squere) {
                    squere.Draw();
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
            this.edges.forEach(function (row, i) {
                row.forEach(function (edge, j) {
                    var response = edge.Click(click_X, click_Y);
                    if (response.EdgeActivated) {
                         //BoxR.Manager.Hub.server.edgeClicked(i, j);
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

            this.edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.MouseOver(x, y);
                });
            });

            this.Draw();
        }
        
        public EdgeClickFromServer(e: Edge) :bool {
            var _this = this;
            
            if (!e.active) {
                var squeractivated = e.Activate();
                _this.opponentScore += squeractivated;
                _this.UpdateScore();
                _this.Draw();
                
                if (squeractivated == 0)
                    return false;
                
                return true;
            }
            return false;
        }

        private UpdateScore() {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = this.selfScore.toString();
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = this.opponentScore.toString();
            
            if (this.selfScore + this.opponentScore == this.n * this.n) {
                this.finished = true;
                var blanket = document.getElementById("blanket");
                blanket.style.display = "table";
                if (this.selfScore > this.opponentScore) {
                    document.getElementById("winPopup").style.display = "block";
                }
                else {
                    document.getElementById("losePopup").style.display = "block";
                }
            }
        }

        private NextRound() {
            IsSelfRound ^= true;
            if(!IsSelfRound){
                $("#redturn").animate({width:"120px",marginLeft:"0px"});
                $("#blueturn").animate({width:"0px",marginLeft:"0px"});
                this.MachineClick();
            }
            else{
                $("#blueturn").animate({width:"120px",marginLeft:"0px"});
                $("#redturn").animate({width:"0px",marginLeft:"0px"});
            }
        }

        // AI clicks now
        private MachineClick() {
            var _this = this;
            //var gameState = this.getGameState();
            
            // szinkron, debugra
            //var nextMove = this.runMinimax(gameState, 4);
            //var needContinue = _this.EdgeClickFromServer(_this.edges[nextMove.i][nextMove.j]);
            //if (needContinue)
            //    _this.MachineClick();
            //else
            //    _this.NextRound();


            // aszinkron
            //var myWorker = new Worker("/js/BoxR.MiniMax.js");
            //myWorker.postMessage({gameState: gameState,depth: 5});
            //myWorker.onmessage = function (e) {
            //    var needContinue = _this.EdgeClickFromServer(_this.edges[e.data.nextClick.i][e.data.nextClick.j]);
            //    if (needContinue)
            //        _this.MachineClick();
            //    else
            //        _this.NextRound();
            //};
            
            // egyszerubb algoritmussal
            setTimeout(() => {
                var fourthEdge = this.FourthClick();
                var nextEdge = this.CleverClick(0) || this.CleverClick(1);
                if (nextEdge) { // még van olyan, aminek csak a második élét húzom be
                    if (fourthEdge) { // be lehet keríteni négyzetet, ilyenkor veszély nélkül
                        _this.EdgeClickFromServer(fourthEdge);
                        _this.MachineClick();
                    } else {
                        _this.EdgeClickFromServer(nextEdge);
                        _this.NextRound();
                    }
                }
                else { // minimax
                    var gameState = this.getGameState();
                    // egyszálon
                    //var nextMove = this.runMinimax(gameState, 5);
                    //var needContinue = _this.EdgeClickFromServer(_this.edges[nextMove.i][nextMove.j]);
                    //if (needContinue)
                    //    _this.MachineClick();
                    //else
                    //    _this.NextRound();
                    //másik szálon
                    var myWorker = new Worker("/js/BoxR.MiniMax.js");
                    myWorker.postMessage({gameState: gameState,depth: 6});
                    myWorker.onmessage = function (e) {
                        var needContinue = _this.EdgeClickFromServer(_this.edges[e.data.nextClick.i][e.data.nextClick.j]);
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
            for (var i = 0; i < this.edges.length;i++){
                for (var j = 0; j < this.edges[i].length;j++){
                    if (!this.edges[i][j].active) {
                        available.push(this.edges[i][j]);
                    }
                }
            }
            while(!clicked && available.length > 0){
                var random = Math.floor(Math.random() * available.length);
                
                var edge = available[random];
                if(edge.squeres[0].EdgesChecked() <= activeEdges && (edge.squeres.length == 1 || edge.squeres[1].EdgesChecked() <= activeEdges)){
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
            for (var i = 0; i < this.squares.length && !find;i++){
                for (var j = 0; j < this.squares[i].length && !find;j++){
                    var sq = this.squares[i][j];
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

        private EmulateClick(gameState: any,move:any){
            gameState["edges"][move.i][move.j] = true;
            var squereActivated = false;
            
            if (move.i % 2 == 0) { // ha az el vizszintes
                if(move.i < gameState.n * 2 ){ // also szomszedos negyzet ellenorzese, ha van
                    gameState["squares"][move.i / 2][move.j] += 1;
                    if (gameState["squares"][move.i / 2][move.j] == 4) {
                        gameState["selfScore"] = gameState["turn"] ? gameState["selfScore"] + 1 : gameState["selfScore"];
                        gameState["opponentScore"] = gameState["turn"] ? gameState["opponentScore"] : gameState["opponentScore"] + 1;
                        squereActivated = true;
                    }
                }
                
                if (move.i > 0) { // felso szomszedos negyzet ellenorzese, ha van
                    gameState["squares"][move.i / 2 - 1][move.j] += 1;
                    if (gameState["squares"][move.i / 2 - 1][move.j] == 4) {
                        gameState["selfScore"] = gameState["turn"] ? gameState["selfScore"] + 1 : gameState["selfScore"];
                        gameState["opponentScore"] = gameState["turn"] ? gameState["opponentScore"] : gameState["opponentScore"] + 1;
                        squereActivated = true;
                    }
                }
            }
            else{ // ha az el fuggoleges
                if (move.j < gameState.n * 2) { // jobb oldali szomszedos negyzet ellenorzese, ha van
                    gameState["squares"][(move.i - 1) / 2][move.j] += 1;
                    if (gameState["squares"][(move.i - 1) / 2][move.j] == 4) {
                        gameState["selfScore"] = gameState["turn"] ? gameState["selfScore"] + 1 : gameState["selfScore"];
                        gameState["opponentScore"] = gameState["turn"] ? gameState["opponentScore"] : gameState["opponentScore"] + 1;
                        squereActivated = true;
                    }
                }
                if (move.j > 0) { // bal oldali szomszedos negyzet ellenorzese, ha van
                    gameState["squares"][(move.i - 1) / 2][move.j - 1] += 1;
                    if (gameState["squares"][(move.i - 1) / 2][move.j - 1] == 4) {
                        gameState["selfScore"] = gameState["turn"] ? gameState["selfScore"] + 1 : gameState["selfScore"];
                        gameState["opponentScore"] = gameState["turn"] ? gameState["opponentScore"] : gameState["opponentScore"] + 1;
                        squereActivated = true;
                    }
                }
            }
            if(!squereActivated)
                gameState["turn"] ^= true;
        }

        // create gameState object
        private getGameState(){
            var gameState = {};
            // add edges as booleans
            gameState["edges"] = new bool[][];
            for (var i = 0; i < this.edges.length;i++){
                gameState["edges"][i] = new bool[];
                for (var j = 0; j < this.edges[i].length; j++) {
                    gameState["edges"][i][j] = this.edges[i][j].active;
                }
            }

            // add squares as booleans
            gameState["squares"] = new number[][];
            for (var i = 0; i < this.squares.length;i++){
                gameState["squares"][i] = new bool[];
                for (var j = 0; j < this.squares[i].length; j++) {
                    gameState["squares"][i][j] = this.squares[i][j].EdgesChecked();
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

        //#region új kód
        // copied from here: https://bitbucket.org/hal/dots-and-boxes-ai-assignment/src/7308e80bc128b622749bd6546ba82afa03283206/src/main/java/hal/dotsandboxes/decision/JavaMinimaxDecisionEngine.java
        private runMinimax(gameState,depth) {
            // find available moves
            var available = [];
            for (var i = 0; i < gameState["edges"].length; i++) {
                for (var j = 0; j < gameState["edges"][i].length; j++) {
                    if (!gameState["edges"][i][j]) {
                        available.push({ i: i, j: j });
                    }
                }
            }

            // set a minimum value for best value
            var best = -INFINITY;
    
            // fill the moves array with values of moves
            var moves = [];
            for (var i = 0; i < available.length; i++) {
                var gameStateCopy = JSON.parse(JSON.stringify(gameState));
                this.EmulateClick(gameStateCopy,available[i]);
                var score = this.minimax(gameStateCopy, depth - 1);
                if(score > best) {
                    best = score;
                }
                moves.push({ score:score, move: available[i] });
            }

            // find the best moves by score
            var bestmoves = [];
            for(var i = 0; i < moves.length ;i ++) {
                if (moves[i].score == best)
                    bestmoves.push(moves[i]);
            }

            // return a random one from best moves
            return bestmoves[Math.floor(Math.random() * bestmoves.length)].move;
        }

        private minimax(gameState,depth) {
            if (gameState.n * gameState.n == gameState.opponentScore + gameState.selfScore || depth == 0) {
                //console.log("return: opponent:" + gameState.opponentScore + " self:" + gameState.selfScore + " value:" + this.valueOf(gameState));
                return this.estimateValue(gameState);
            }

            var bestscore = gameState.turn ? +INFINITY : -INFINITY;// turn == false, if it's AI's turn, -INFINITY to favored player
            // find available moves
            var available = [];
            for (var i = 0; i < gameState["edges"].length; i++) {
                for (var j = 0; j < gameState["edges"][i].length; j++) {
                    if (!gameState["edges"][i][j]) {
                        available.push({ i: i, j: j });
                    }
                }
            }
    
            // iterate on available moves
            for (var i = 0; i < available.length; i++) {
                var gameStateCopy = JSON.parse(JSON.stringify(gameState));
                this.EmulateClick(gameStateCopy,available[i]);
                var score = this.minimax(gameStateCopy, depth - 1);

                bestscore = gameState.turn ? Math.min(score, bestscore) : Math.max(score, bestscore);
            }
            return bestscore;
        }

        private estimateValue(gameState) {
            return gameState.opponentScore - gameState.selfScore; //gameState.turn ? gameState.selfScore - gameState.opponentScore : gameState.opponentScore - gameState.selfScore;
        }
        //#endregion
    }
}