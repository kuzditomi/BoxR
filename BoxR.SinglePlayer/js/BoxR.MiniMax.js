onmessage = function (e) {
    var nextClick = { };
    var value = minimax(e.data.gameState,e.data.depth,nextClick);
    postMessage({ nextClick: nextClick, value: value });
};

//minimax algorithm
function minimax(gameState, depth, click){
    //console.log("minimax start, depth: " + depth);
    // if the game is finished, or max depth reached
    if (gameState.n * gameState.n == gameState.opponentScore + gameState.selfScore || depth == 0) {
        //console.log("return: opponent:" + gameState.opponentScore + " self:" + gameState.selfScore + " value:" + this.valueOf(gameState));
        return this.valueOf(gameState, depth);
    }
    else {
        var alpha = -100;
        // available edges to click next
        var available = [];
        for (var i = 0; i < gameState["edges"].length; i++) {
            for (var j = 0; j < gameState["edges"][i].length; j++) {
                if (!gameState["edges"][i][j]) {
                    available.push({ i: i, j: j });
                }
            }
        }

        for (var i = 0; i < available.length ; i++) {
            var gameCopy = JSON.parse(JSON.stringify(gameState));
            //console.log("click in depth("+depth+"): " + available[i].i + ":" +  available[i].j);
            this.EmulateClick(gameCopy, available[i]);
            var bestclick = {};
            var res = this.minimax(gameCopy, depth - 1, bestclick);
            if(res > alpha){
                alpha = res;
                click.i = available[i].i;
                click.j = available[i].j;
            }
        }
        return alpha;
    }
}

function valueOf(gameState, depth) {
    return (gameState.opponentScore * depth) - gameState.selfScore ; // AI's advantage
}

function EmulateClick(gameState, move) {
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
