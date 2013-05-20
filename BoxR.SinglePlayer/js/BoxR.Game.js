var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoxR;
(function (BoxR) {
    "use strict";
    var dummychars = "Ù";
    var INFINITY = 300;
    var selfBoxColor = 'rgb(27,161,226)';
    var opponentBoxColor = 'rgb(242,20,0)';
    var backgroundColor = 'rgb(256,256,256)';
    BoxR.activeColor = 'rgb(27,161,226)';
    var IsSelfRound = false;
    var Drawable = (function () {
        function Drawable(ctx, x, y) {
            this.active = false;
            this.ctx = ctx;
            this.x = x;
            this.y = y;
        }
        Drawable.prototype.Draw = function () {
        };
        Drawable.prototype.Click = function (x, y) {
            return new ClickResponse(false, 0);
        };
        return Drawable;
    })();
    BoxR.Drawable = Drawable;    
    ; ;
    var ClickResponse = (function () {
        function ClickResponse(edgeActivated, squereActivated) {
            this.EdgeActivated = edgeActivated;
            this.SquereActivated = squereActivated;
        }
        return ClickResponse;
    })();
    BoxR.ClickResponse = ClickResponse;    
    var Edge = (function (_super) {
        __extends(Edge, _super);
        function Edge(ctx, x, y, width, height, isHorizontal) {
                _super.call(this, ctx, x, y);
            this.width = width;
            this.height = height;
            this.isHorizontal = isHorizontal;
            this.squeres = new Array();
            this.mouseover = false;
        }
        Edge.prototype.Draw = function () {
            this.ctx.strokeStyle = "black";
            if(this.active) {
                this.ctx.fillStyle = BoxR.activeColor;
            } else {
                if(this.mouseover) {
                    this.ctx.fillStyle = BoxR.activeColor;
                } else {
                    this.ctx.fillStyle = backgroundColor;
                }
            }
            this.ctx.beginPath();
            if(this.isHorizontal) {
                this.ctx.moveTo(this.x + this.width / 6.0, this.y);
                this.ctx.lineTo(this.x + this.width * 5.0 / 6.0, this.y);
                this.ctx.lineTo(this.x + this.width, this.y + this.height / 2.0);
                this.ctx.lineTo(this.x + this.width * 5.0 / 6.0, this.y + this.height);
                this.ctx.lineTo(this.x + this.width / 6.0, this.y + this.height);
                this.ctx.lineTo(this.x, this.y + this.height / 2.0);
            } else {
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
        };
        Edge.prototype.MouseOver = function (x, y) {
            if(this.active) {
                return;
            }
            if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
                this.mouseover = true;
                this.Draw();
            } else {
                if(this.mouseover) {
                    this.mouseover = false;
                    this.Draw();
                }
            }
            this.ctx.stroke();
        };
        Edge.prototype.AddSquere = function (squere) {
            this.squeres.push(squere);
        };
        Edge.prototype.Click = function (x, y) {
            if(this.active) {
                return new ClickResponse(false, 0);
            }
            if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
                return new ClickResponse(true, this.Activate());
            }
            return new ClickResponse(false, 0);
        };
        Edge.prototype.Activate = function () {
            this.active = true;
            var squereactivated = 0;
            this.squeres.forEach(function (squere) {
                if(squere.EdgeChecked()) {
                    squereactivated++;
                }
            });
            return squereactivated;
        };
        return Edge;
    })(Drawable);
    BoxR.Edge = Edge;    
    var Squere = (function (_super) {
        __extends(Squere, _super);
        function Squere(ctx, x, y, width) {
                _super.call(this, ctx, x, y);
            this.width = width;
            this.animated = false;
            this.edges = new Array();
        }
        Squere.prototype.EdgeChecked = function () {
            if(this.EdgesChecked() == 4) {
                this.active = true;
                this.color = IsSelfRound ? selfBoxColor : opponentBoxColor;
                return true;
            }
            return false;
        };
        Squere.prototype.EdgesChecked = function () {
            var count = 0;
            for(var i = 0; i < this.edges.length; i++) {
                count += this.edges[i].active ? 1 : 0;
            }
            return count;
        };
        Squere.prototype.Draw = function () {
            if(!this.active) {
                return;
            }
            if(!this.animated) {
                var steps = 120;
                var i = 0;
                var mode = 0;
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
                    if(mode == 0) {
                        _this.ctx.strokeStyle = 'black';
                        _this.ctx.beginPath();
                        _this.ctx.rect(_this.x - 1, _this.y - 1, _this.width + 2, _this.width + 2);
                        _this.ctx.closePath();
                        _this.ctx.fillStyle = backgroundColor;
                        _this.ctx.fill();
                        _this.ctx.beginPath();
                        _this.ctx.rect(_this.x + i, _this.y, _this.width - (i * 2), _this.width);
                        _this.ctx.closePath();
                        _this.ctx.fillStyle = _this.color;
                        _this.ctx.fill();
                        i += 2;
                        if(i >= _this.width / 2) {
                            mode = 1;
                        }
                    } else {
                        _this.ctx.beginPath();
                        _this.ctx.rect(_this.x + i, _this.y, _this.width - (i * 2), _this.width);
                        _this.ctx.closePath();
                        _this.ctx.fillStyle = _this.color;
                        _this.ctx.fill();
                        i -= 3;
                        if(i <= 0) {
                            clearInterval(interval);
                        }
                    }
                }, 10);
                this.animated = true;
            } else {
                this.ctx.fillStyle = this.color;
                this.ctx.strokeStyle = 'black';
                this.ctx.beginPath();
                this.ctx.rect(this.x, this.y, this.width, this.width);
                this.ctx.closePath();
                this.ctx.fill();
            }
        };
        return Squere;
    })(Drawable);
    BoxR.Squere = Squere;    
    var Game = (function () {
        function Game(canvas) {
            this.finished = false;
            this.ctx = (canvas).getContext('2d');
            this.LeftOffset = canvas.offsetLeft;
            this.TopOffset = canvas.getBoundingClientRect().top;
            this.Width = canvas.clientWidth;
            this.PopupControl = new Popup(document.getElementById("popup"));
        }
        Game.prototype.Init = function (n, selfstart) {
            this.n = n;
            this.Clear();
            this.selfScore = 0;
            this.opponentScore = 0;
            this.UpdateScore();
            this.edges = new Array();
            this.squares = new Array();
            if(selfstart) {
                $("#blueturn").animate({
                    width: "120px",
                    marginLeft: "0px"
                });
            } else {
                $("#redturn").animate({
                    width: "120px",
                    marginLeft: "0px"
                });
            }
            var squereWidthToUnit = 7;
            var unit = this.Width / ((n * squereWidthToUnit) + (n + 1) + 2);
            var verticalOffset = [
                unit, 
                2 * unit
            ];
            var horizontalOffset = [
                2 * unit, 
                unit
            ];
            var squereEdge = squereWidthToUnit * unit;
            var width = [
                squereEdge, 
                unit
            ];
            var height = [
                unit, 
                squereEdge
            ];
            for(var i = 0; i < 2 * n + 1; i++) {
                this.edges[i] = new Array();
                this.squares[i / 2 - 1] = new Array();
                var isAlternateRow = i % 2;
                var m = isAlternateRow == 0 ? n : n + 1;
                for(var j = 0; j < m; j++) {
                    this.edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);
                    if(isAlternateRow == 0 && i > 0) {
                        var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                        this.squares[i / 2 - 1][j] = sq;
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
        };
        Game.prototype.Draw = function () {
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
        };
        Game.prototype.Clear = function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientWidth);
        };
        Game.prototype.Click = function (e) {
            if(!IsSelfRound) {
                return;
            }
            var click_X = e.pageX - this.LeftOffset;
            var click_Y = e.pageY - this.TopOffset;
            if(!e.pageX || !e.pageY) {
                click_X = e.x - this.LeftOffset;
                click_Y = e.y - this.TopOffset;
            }
            var _this = this;
            this.edges.forEach(function (row, i) {
                row.forEach(function (edge, j) {
                    var response = edge.Click(click_X, click_Y);
                    if(response.EdgeActivated) {
                        _this.selfScore += response.SquereActivated;
                        if(response.SquereActivated == 0) {
                            _this.NextRound();
                        } else {
                            _this.UpdateScore();
                        }
                        _this.Draw();
                        return;
                    }
                });
            });
        };
        Game.prototype.MouseMove = function (e) {
            if(!IsSelfRound) {
                return;
            }
            var x = e.clientX - this.LeftOffset;
            var y = e.clientY - this.TopOffset;
            this.edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.MouseOver(x, y);
                });
            });
            this.Draw();
        };
        Game.prototype.EdgeClickFromServer = function (e) {
            var _this = this;
            if(!e.active) {
                var squeractivated = e.Activate();
                _this.opponentScore += squeractivated;
                _this.UpdateScore();
                _this.Draw();
                if(squeractivated == 0) {
                    return false;
                }
                return true;
            }
            return false;
        };
        Game.prototype.UpdateScore = function () {
            var selfScoreDiv = document.getElementById('selfscore');
            selfScoreDiv.textContent = this.selfScore.toString();
            var opponentScoreDiv = document.getElementById('opponentscore');
            opponentScoreDiv.textContent = this.opponentScore.toString();
            if(this.selfScore + this.opponentScore == this.n * this.n) {
                this.finished = true;
                if(this.selfScore > this.opponentScore) {
                    this.PopupControl.Win();
                } else {
                    this.PopupControl.Lose();
                }
            }
        };
        Game.prototype.NextRound = function () {
            IsSelfRound ^= true;
            if(!IsSelfRound) {
                this.MachineClick();
            } else {
            }
        };
        Game.prototype.MachineClick = function () {
            var _this = this;
            var _this = this;
            setTimeout(function () {
                var fourthEdge = _this.FourthClick();
                var nextEdge = _this.CleverClick(0) || _this.CleverClick(1);
                if(nextEdge) {
                    if(fourthEdge) {
                        _this.EdgeClickFromServer(fourthEdge);
                        _this.MachineClick();
                    } else {
                        _this.EdgeClickFromServer(nextEdge);
                        _this.NextRound();
                    }
                } else {
                    var gameState = _this.getGameState();
                    var myWorker = new Worker("js/BoxR.MiniMax.js");
                    myWorker.postMessage({
                        gameState: gameState,
                        depth: 6
                    });
                    myWorker.onmessage = function (e) {
                        var needContinue = _this.EdgeClickFromServer(_this.edges[e.data.nextClick.i][e.data.nextClick.j]);
                        if(needContinue) {
                            _this.MachineClick();
                        } else {
                            _this.NextRound();
                        }
                    };
                }
            }, 1000);
        };
        Game.prototype.CleverClick = function (activeEdges) {
            if(activeEdges == 2) {
                return null;
            }
            var clicked = false;
            var available = new Array();
            for(var i = 0; i < this.edges.length; i++) {
                for(var j = 0; j < this.edges[i].length; j++) {
                    if(!this.edges[i][j].active) {
                        available.push(this.edges[i][j]);
                    }
                }
            }
            while(!clicked && available.length > 0) {
                var random = Math.floor(Math.random() * available.length);
                var edge = available[random];
                if(edge.squeres[0].EdgesChecked() <= activeEdges && (edge.squeres.length == 1 || edge.squeres[1].EdgesChecked() <= activeEdges)) {
                    return edge;
                    clicked = true;
                }
                available.splice(random, 1);
            }
            if(!clicked) {
                return null;
            }
        };
        Game.prototype.FourthClick = function () {
            var find = false;
            var edge;
            for(var i = 0; i < this.squares.length && !find; i++) {
                for(var j = 0; j < this.squares[i].length && !find; j++) {
                    var sq = this.squares[i][j];
                    if(sq.EdgesChecked() == 3) {
                        for(var e = 0; e < sq.edges.length; e++) {
                            if(!sq.edges[e].active) {
                                edge = sq.edges[e];
                                find = true;
                            }
                        }
                    }
                }
            }
            if(find) {
                return edge;
            }
            return null;
        };
        Game.prototype.getGameState = function () {
            var gameState = {
            };
            gameState["edges"] = new Array();
            for(var i = 0; i < this.edges.length; i++) {
                gameState["edges"][i] = new Array();
                for(var j = 0; j < this.edges[i].length; j++) {
                    gameState["edges"][i][j] = this.edges[i][j].active;
                }
            }
            gameState["squares"] = new Array();
            for(var i = 0; i < this.squares.length; i++) {
                gameState["squares"][i] = new Array();
                for(var j = 0; j < this.squares[i].length; j++) {
                    gameState["squares"][i][j] = this.squares[i][j].EdgesChecked();
                }
            }
            gameState["opponentScore"] = this.opponentScore;
            gameState["selfScore"] = this.selfScore;
            gameState["n"] = this.n;
            gameState["turn"] = IsSelfRound;
            return gameState;
        };
        return Game;
    })();
    BoxR.Game = Game;    
})(BoxR || (BoxR = {}));
