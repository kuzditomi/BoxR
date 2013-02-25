var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var selfRound = false;
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
; ;
var ClickResponse = (function () {
    function ClickResponse(edgeActivated, squereActivated) {
        this.EdgeActivated = edgeActivated;
        this.SquereActivated = squereActivated;
    }
    return ClickResponse;
})();
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
var Squere = (function (_super) {
    __extends(Squere, _super);
    function Squere(ctx, x, y, width) {
        _super.call(this, ctx, x, y);
        this.edgesChecked = 0;
        this.width = width;
        this.animated = false;
    }
    Squere.prototype.EdgeChecked = function () {
        this.edgesChecked++;
        if(this.edgesChecked == 4) {
            this.active = true;
            return true;
        }
        return false;
    };
    Squere.prototype.Draw = function () {
        if(!this.active) {
            return;
        }
        if(!this.animated) {
            this.color = selfRound ? '27,161,226,' : '290,20,0,';
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
var Game = (function () {
    function Game(canvas) {
        this.ctx = (canvas).getContext('2d');
        this.LeftOffset = canvas.getBoundingClientRect().left;
        this.TopOffset = canvas.getBoundingClientRect().top;
        this.Width = canvas.clientWidth;
    }
    Game.prototype.Init = function (n, selfstart) {
        this.n = n;
        this.Clear();
        this.edges = new Array();
        this.squares = new Array();
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
            var isAlternateRow = i % 2;
            var m = isAlternateRow == 0 ? n : n + 1;
            for(var j = 0; j < m; j++) {
                this.edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);
                if(isAlternateRow == 0 && i > 0) {
                    var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                    this.squares.push(sq);
                    this.edges[i][j].AddSquere(sq);
                    this.edges[i - 1][j + 1].AddSquere(sq);
                    this.edges[i - 2][j].AddSquere(sq);
                    this.edges[i - 1][j].AddSquere(sq);
                }
            }
        }
        selfRound = selfstart;
        this.selfScore = 0;
        this.opponentScore = 0;
        updateRound(selfRound);
    };
    Game.prototype.Draw = function () {
        this.Clear();
        this.edges.forEach(function (row) {
            row.forEach(function (edge) {
                edge.Draw();
            });
        });
        this.squares.forEach(function (sq) {
            sq.Draw();
        });
    };
    Game.prototype.Clear = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientWidth);
    };
    Game.prototype.Click = function (e) {
        if(!selfRound) {
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
                    gameHub.server.edgeClicked(i, j);
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
        if(!selfRound) {
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
    Game.prototype.EdgeClickFromServer = function (i, j) {
        if(!this.edges[i][j].active) {
            var squeractivated = this.edges[i][j].Activate();
            this.opponentScore += squeractivated;
            if(squeractivated == 0) {
                this.NextRound();
            } else {
                this.UpdateScore();
            }
            this.Draw();
        }
    };
    Game.prototype.UpdateScore = function () {
        updateSelfScore(this.selfScore);
        updateOpponentScore(this.opponentScore);
        if(this.selfScore + this.opponentScore == this.n * this.n) {
            if(this.selfScore > this.opponentScore) {
                win_popup();
            } else {
                lose_popup();
            }
            return;
        }
    };
    Game.prototype.NextRound = function () {
        selfRound ^= true;
        updateRound(selfRound);
    };
    return Game;
})();
