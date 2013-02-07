var game;
var gameHub;
var connectionId;

$(function () {
    gameHub = $.connection.game;
    
    gameHub.client.alertDuplicate = function () {
        $('header').append('<span class="error">Sajnálom, úgy néz ki másik ablakkal be vagy lépve. Használd azt!</span>');
    };

    gameHub.client.receiveUsers = function(users) {
        for (var i in users) {
            var div = $('<div/>', { 
                id : users[i].ConnectionId, 
                class: "user",
                html: $('<span/>', { text: users[i].UserName })
            });
            
            div.click(function() {
                gameHub.server.invite(this.id);
            });
            
            div.appendTo("#userList");
        }
    };

    gameHub.client.receiveUser = function(user,connectionId) {
        var div = $('<div/>', {
            id: connectionId,
            class: "user",
            html: $('<span/>', { text: user.UserName })
        });
        div.click(function () {
            gameHub.server.invite(this.id);
        });
        div.appendTo("#userList");
    };

    gameHub.client.removeUser = function(connectionId) {
        $('#userList').find('#' + connectionId).remove();
    };

    gameHub.client.invited = function (user) {
        invited_popup(user);
    };
    
    gameHub.client.waitInvite = function (username) {
        wait_popup(username);
    };
    
    gameHub.client.inviteDenied = function () {
        close_popup();
    };

    gameHub.client.startGame = function (selfStart, name, opponentname) {
        close_popup();
        $("#quitGame").show();

        var height = $("#blanket").height();

        var newsize = height * 0.65;

        var canvas = document.createElement('canvas');
        canvas.width = newsize;
        canvas.height = newsize;

        var div = document.createElement('div');
        div.id = 'roundcounter';

        var selfcounter = document.createElement('aside');
        selfcounter.innerHTML = '<div class="namecontrainer"><div class="selfname">'+ (selfStart ? name : opponentname) +'</div></div><div class="selfscore">0</div>';
        selfcounter.className = 'selfcounter';
        
        var opponentcounter = document.createElement('aside');
        opponentcounter.innerHTML = '<div class="namecontrainer"><div class="opponentname">' + (selfStart ? opponentname : name) + '</div></div><div class="opponentscore">0</div>';
        opponentcounter.className = 'opponentcounter';

        $('#container').html(canvas);
        $('#container').append(div);
        $('#container').append(selfcounter);
        $('#container').append(opponentcounter);

        game = new Game(canvas);
        game.Init(3, selfStart);
        game.Draw();
        
        canvas.addEventListener("click", function (e) { game.Click(e); }, true);
        canvas.addEventListener("mousemove", function (e) { game.MouseMove(e);});
    };

    $.connection.hub.start();
    
    gameHub.client.edgeClicked = function (i, j) {
        game.EdgeClickFromServer(i, j);
    };
    
    gameHub.client.alertDisconnect = function () {
        disconnect_popup();
    };
});

function updateRound(selfround) {
    $('#roundcounter').html(selfround ? 'YOUR TURN' : "OPPONENT'S TURN!");
}

function updateSelfScore(score) {
    $('.selfscore').html(score);
}

function updateOpponentScore(score) {
    $('.opponentscore').html(score);
}