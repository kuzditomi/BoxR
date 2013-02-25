/************* onload ****************/
$(function () {
    gameHub = $.connection.game;

    initHub();

    $.connection.hub.start().done(function () {
        gameHub.server.getUsers();
    });
});

/************* Game specific functions ******************/
function startGame(selfStart, name, opponentname) {
    close_popup();
    $("#quitGame").show();

    var height = $("#blanket").height();

    var newsize = height * 0.65;
    var container = $('#container');
    $.ajax({
        url: '/Home/StartGame',
        data: {
            name: name,
            opponent: opponentname,
            selfstart: selfStart,
            cwidth: newsize,
        }
    }).done(function(res) {
        container.html(res);
        var canvas = $(container).find("canvas")[0];
        game = new Game(canvas);
        game.Init(3, selfStart);
        game.Draw();

        canvas.addEventListener("click", function(e) { game.Click(e); }, true);
        canvas.addEventListener("mousemove", function(e) { game.MouseMove(e); });
    });
}

/************** Popups *******************/
function invited_popup(user) {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(".challenger").html(user.UserName);
        $(el).find(".invited").show();
        //$("#inner .accept").click(function () {
        //    gameHub.server.inviteAccepted();
        //    close_popup();
        //});
        //$("#inner .deny").click(function () {
        //    gameHub.server.inviteDenied();
        //    close_popup();
        //});
    }
}

function wait_popup(username) {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(".challenger").html(username);
        $(el).find(".wait").show();
        //$("#inner .deny").click(function () {
        //    gameHub.server.inviteDenied();
        //    close_popup();
        //});
    }
}

function quit_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".quit").show();
    }
}

function disconnect_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".disconnect").show();
    }
}

function win_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".win").show();
    }
}

function lose_popup() {
    var el = $('#blanket');
    if (el.css('display') == 'none') {
        el.css('display', 'table');
        $(el).find(".lose").show();
    }
}

function close_popup() {
    var el = $('#blanket');
    el.find("section").hide();
    el.hide();
}