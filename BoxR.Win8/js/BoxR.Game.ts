/// <reference path="BoxR.IClient.ts"/>
/// <reference path="BoxR.Server.ts"/>

module BoxR {
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
        private squeres: Squere[];
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
        private edgesChecked: number;
        private width: number;
        private animated: bool;
        private color: string;

        constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
            super(ctx, x, y);
            this.edgesChecked = 0;
            this.width = width;
            this.animated = false;
        }

        public EdgeChecked(): bool {
            this.edgesChecked++;
            if (this.edgesChecked == 4) {
                this.active = true;
                return true;
            }
            return false;
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

    export class Game {
        ctx: CanvasRenderingContext2D;
        private edges: Edge[][];
        private squares: Squere[];

        n: number;
        LeftOffset: number;
        TopOffset: number;
        Width: number;
        selfScore: number;
        opponentScore: number;


        constructor(canvas: HTMLElement) {
            this.ctx = (<HTMLCanvasElement>canvas).getContext('2d');
            this.LeftOffset = canvas.getBoundingClientRect().left;
            this.TopOffset = canvas.getBoundingClientRect().top;
            this.Width = canvas.clientWidth;
        }

        public Init(n: number, selfstart: bool) {
            this.n = n;
            this.Clear();
            this.edges = new Edge[][];
            this.squares = new Squere[];

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
                var isAlternateRow = i % 2; // 0,2,4 is alternative, these are for the horizontal edges
                var m = isAlternateRow == 0 ? n : n + 1;
                for (var j = 0; j < m; j++) {
                    this.edges[i][j] = new Edge(this.ctx, horizontalOffset[isAlternateRow] + j * (squereEdge + unit), verticalOffset[isAlternateRow] + Math.floor(i / 2) * (squereEdge + unit), width[isAlternateRow], height[isAlternateRow], isAlternateRow == 0);

                    if (isAlternateRow == 0 && i > 0) {
                        var sq = new Squere(this.ctx, horizontalOffset[0] + j * (unit + squereEdge) + unit / 2, verticalOffset[1] + (i - 2) / 2 * (squereEdge + unit) + unit / 2, squereEdge - unit);
                        this.squares.push(sq);
                        this.edges[i][j].AddSquere(sq);
                        this.edges[i - 1][j + 1].AddSquere(sq);
                        this.edges[i - 2][j].AddSquere(sq);
                        this.edges[i - 1][j].AddSquere(sq);
                    }
                }
            }

            IsSelfRound = selfstart;
            this.selfScore = 0;
            this.opponentScore = 0;
             BoxR.Manager.Server.UpdateRound(IsSelfRound);
        }
        public Draw() {
            this.Clear();
            this.edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.Draw();
                });
            });
            this.squares.forEach(function (sq) {
                sq.Draw();
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

            this.edges.forEach(function (row) {
                row.forEach(function (edge) {
                    edge.MouseOver(x, y);
                });
            });

            this.Draw();
        }
        public EdgeClickFromServer(i: number, j: number) {
            if (!this.edges[i][j].active) {
                var squeractivated = this.edges[i][j].Activate();
                this.opponentScore += squeractivated;
                if (squeractivated == 0)
                    this.NextRound();
                else
                    this.UpdateScore();
                this.Draw();
            }
        }

        private UpdateScore() {
            BoxR.Manager.Server.UpdateSelfScore(this.selfScore);
            BoxR.Manager.Server.UpdateOpponentScore(this.opponentScore);
            if (this.selfScore + this.opponentScore == this.n * this.n) {
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
            BoxR.Manager.Server.UpdateRound(IsSelfRound);
        }
    }
}