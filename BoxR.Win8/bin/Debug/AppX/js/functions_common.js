var game;
var gameHub;
var connection;

function initHub() {

    gameHub.client.alertDuplicate = function() {
        $('header').append('<span class="error">Sajnálom, úgy néz ki másik ablakkal be vagy lépve. Használd azt!</span>');
    };

    gameHub.client.receiveUsers = function(users) {
        for (var i in users) {
            if (users[i].ConnectionId != connection.id) {
                var div = $('<div/>', {
                    id: users[i].ConnectionId,
                    class: "user",
                    html: $('<span/>', { text: users[i].UserName })
                });

                div.click(function() {
                    gameHub.server.invite(this.id);
                });

                div.appendTo("#userList");
            }
        }
    };

    gameHub.client.receiveUser = function(user, connectionId) {
        var div = $('<div/>', {
            id: connectionId,
            class: "user",
            html: $('<span/>', { text: user.UserName })
        });
        div.click(function() {
            gameHub.server.invite(this.id);
        });
        div.appendTo("#userList");
    };

    gameHub.client.removeUser = function(connectionId) {
        $('#userList').find('#' + connectionId).remove();
    };

    gameHub.client.invited = function(user) {
        invited_popup(user);
    };

    gameHub.client.waitInvite = function(username) {
        wait_popup(username);
    };

    gameHub.client.inviteDenied = function() {
        close_popup();
    };

    gameHub.client.startGame = function(selfStart, name, opponentname) {
        close_popup();
        startGame(selfStart, name, opponentname);
    };

    gameHub.client.edgeClicked = function(i, j) {
        game.EdgeClickFromServer(i, j);
    };

    gameHub.client.alertDisconnect = function() {
        disconnect_popup();
    };
}

function updateRound(selfround) {
    $('#roundcounter').html(selfround ? 'YOUR TURN' : "OPPONENT'S TURN!");
}

function updateSelfScore(score) {
    $('.selfscore').html(score);
}

function updateOpponentScore(score) {
    $('.opponentscore').html(score);
}

function tabify() {
    $('#tabified').each(function() {
        var $active, $content, $links = $(this).find('a');
        $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('active');
        $content = $($active.attr('href'));
        $links.not($active).each(function() {
            $($(this).attr('href')).hide();
        });
        $(this).on('click', 'a', function(e) {
            $active.removeClass('active');
            $content.hide();
            $active = $(this);
            $content = $($(this).attr('href'));
            $active.addClass('active');
            $content.show();
            e.preventDefault();
        });
    });
}