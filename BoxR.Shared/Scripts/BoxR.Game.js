var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoxR;
(function (BoxR) {
    var dummychars = "Ù";
    var IsSelfRound = false;
    "use strict";
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
                this.ctx.fillStyle = "darkslateblue";
            } else {
                if(this.mouseover) {
                    this.ctx.fillStyle = "rgb(27,161,226)";
                } else {
                    this.ctx.fillStyle = "slateblue";
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
            this.Edges = new Array();
        }
        Squere.prototype.EdgeChecked = function () {
            if(this.EdgesChecked() == 4) {
                this.active = true;
                this.color = IsSelfRound ? '27,161,226,' : '290,20,0,';
                return true;
            }
            return false;
        };
        Squere.prototype.EdgesChecked = function () {
            var count = 0;
            for(var i = 0; i < this.Edges.length; i++) {
                count += this.Edges[i].active ? 1 : 0;
            }
            return count;
        };
        Squere.prototype.Draw = function () {
            if(!this.active) {
                return;
            }
            if(!this.animated) {
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
                    if(i === steps) {
                        clearInterval(interval);
                    }
                }, 30);
                this.animated = true;
            } else {
                this.ctx.fillStyle = 'rgba(' + this.color + '1)';
                this.ctx.strokeStyle = 'black';
                this.ctx.beginPath();
                this.ctx.rect(this.x, this.y, this.width, this.width);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            }
        };
        return Squere;
    })(Drawable);
    BoxR.Squere = Squere;    
    var ClickResponse = (function () {
        function ClickResponse(edgeActivated, squereActivated) {
            this.EdgeActivated = edgeActivated;
            this.SquereActivated = squereActivated;
        }
        return ClickResponse;
    })();
    BoxR.ClickResponse = ClickResponse;    
    var Coordinate = (function () {
        function Coordinate(x, y) {
            this.x = x;
            this.y = y;
        }
        return Coordinate;
    })();
    BoxR.Coordinate = Coordinate;    
    var Game = (function () {
        function Game(canvas, issingleplayer) {
            if (typeof issingleplayer === "undefined") { issingleplayer = false; }
            this.ctx = (canvas).getContext('2d');
            this.LeftOffset = canvas.offsetLeft;
            this.TopOffset = canvas.getBoundingClientRect().top;
            this.Width = canvas.clientWidth;
            this.IsSinglePlayer = issingleplayer;
        }
        Game.prototype.Init = function (n, selfstart) {
            this.n = n;
            this.Clear();
            this.Edges = new Array();
            this.Squares = new Array();
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
                this.Edges[i] = new Array();
                this.Squares[i / 2 - 1] = new Array();
                var isAlternateRow = i % 2;
                var m = isAlternateRow == 0 ? n : n + 1;
                for(var j = 0; j < m; j++) {
                    this.Edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);
                    if(isAlternateRow == 0 && i > 0) {
                        var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                        this.Squares[i / 2 - 1][j] = sq;
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
            if(!this.IsSinglePlayer) {
                BoxR.Manager.Server.UpdateRound(IsSelfRound);
            }
        };
        Game.prototype.Draw = function () {
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
            this.Edges.forEach(function (row, i) {
                row.forEach(function (edge, j) {
                    var response = edge.Click(click_X, click_Y);
                    if(response.EdgeActivated) {
                        if(!_this.IsSinglePlayer) {
                            BoxR.Manager.Hub.server.edgeClicked(i, j);
                        }
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
            this.Edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.MouseOver(x, y);
                });
            });
            this.Draw();
        };
        Game.prototype.EdgeClickFromServerByCoordinate = function (i, j) {
            if(!this.Edges[i][j].active) {
                var squeractivated = this.Edges[i][j].Activate();
                this.opponentScore += squeractivated;
                if(squeractivated == 0) {
                    this.NextRound();
                } else {
                    this.UpdateScore();
                }
                this.Draw();
            }
        };
        Game.prototype.EdgeClickFromServerByEdge = function (edge) {
            var _this = this;
            if(!edge.active) {
                var squeractivated = edge.Activate();
                _this.opponentScore += squeractivated;
                if(squeractivated == 0) {
                    _this.Draw();
                    return false;
                } else {
                    _this.UpdateScore();
                    _this.Draw();
                    return true;
                }
            }
            return false;
        };
        Game.prototype.UpdateScore = function () {
            if(!this.IsSinglePlayer) {
                BoxR.Manager.Server.UpdateSelfScore(this.selfScore);
                BoxR.Manager.Server.UpdateOpponentScore(this.opponentScore);
            }
            if(this.selfScore + this.opponentScore == this.n * this.n) {
                if(!this.IsSinglePlayer) {
                    BoxR.Manager.Hub.server.finishGame();
                }
                if(this.selfScore > this.opponentScore) {
                    BoxR.Manager.Client.WinPopup();
                } else {
                    BoxR.Manager.Client.LosePopup();
                }
                return;
            }
        };
        Game.prototype.NextRound = function () {
            IsSelfRound ^= true;
            if(!this.IsSinglePlayer) {
                BoxR.Manager.Server.UpdateRound(IsSelfRound);
            } else {
                if(!IsSelfRound) {
                    this.MachineClick();
                }
            }
        };
        Game.prototype.MachineClick = function () {
            var _this = this;
            setTimeout(function () {
                var nextEdge = _this.FourthClick() || _this.CleverClick(0);
                var needContinue = _this.EdgeClickFromServerByEdge(nextEdge);
                if(needContinue) {
                    _this.MachineClick();
                } else {
                    _this.NextRound();
                }
            }, 1000);
        };
        Game.prototype.CleverClick = function (activeEdges) {
            var clicked = false;
            var available = new Array();
            for(var i = 0; i < this.Edges.length; i++) {
                for(var j = 0; j < this.Edges[i].length; j++) {
                    if(!this.Edges[i][j].active) {
                        available.push(this.Edges[i][j]);
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
                return this.CleverClick(activeEdges + 1);
            }
        };
        Game.prototype.FourthClick = function () {
            var find = false;
            var edge;
            for(var i = 0; i < this.Squares.length && !find; i++) {
                for(var j = 0; j < this.Squares[i].length && !find; j++) {
                    var sq = this.Squares[i][j];
                    if(sq.EdgesChecked() == 3) {
                        for(var e = 0; e < sq.Edges.length; e++) {
                            if(!sq.Edges[e].active) {
                                edge = sq;
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
        return Game;
    })();
    BoxR.Game = Game;    
})(BoxR || (BoxR = {}));
