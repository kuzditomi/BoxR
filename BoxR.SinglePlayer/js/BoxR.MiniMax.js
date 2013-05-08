onmessage = function (e) {
    // régi kóddal
    //var nextClick = {};
    //var value = minimax(e.data.gameState,e.data.depth,nextClick);
    //postMessage({ nextClick: nextClick, value: value });

    // új kóddal
    var nextClick = runMinimax(e.data.gameState, e.data.depth);
    postMessage({ nextClick: nextClick });
};

var INFINITY = 300;


// copied from here: https://bitbucket.org/hal/dots-and-boxes-ai-assignment/src/7308e80bc128b622749bd6546ba82afa03283206/src/main/java/hal/dotsandboxes/decision/JavaMinimaxDecisionEngine.java
function runMinimax(gameState,depth) {
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
        EmulateClick(gameStateCopy,available[i]);
        var score = minimax(gameStateCopy, depth - 1);
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

function minimax(gameState,depth) {
    if (gameState.n * gameState.n == gameState.opponentScore + gameState.selfScore || depth == 0) {
        //console.log("return: opponent:" + gameState.opponentScore + " self:" + gameState.selfScore + " value:" + this.valueOf(gameState));
        return estimateValue(gameState);
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
        EmulateClick(gameStateCopy,available[i]);
        var score = minimax(gameStateCopy, depth - 1);

        bestscore = gameState.turn ? Math.min(score, bestscore) : Math.max(score, bestscore);
    }
    return bestscore;
}
function EmulateClick(gameState, move) {
    gameState["edges"][move.i][move.j] = true;
    var squereActivated = false;

    if (move.i % 2 == 0) { // ha az el vizszintes
        if (move.i < gameState.n * 2) { // also szomszedos negyzet ellenorzese, ha van
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
    else { // ha az el fuggoleges
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
    if (!squereActivated)
        gameState["turn"] ^= true;
}

function estimateValue(gameState) {
    return gameState.opponentScore - gameState.selfScore; //gameState.turn ? gameState.selfScore - gameState.opponentScore : gameState.opponentScore - gameState.selfScore;
}