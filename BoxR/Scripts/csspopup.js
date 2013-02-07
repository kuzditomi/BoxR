function invited_popup(user) {
    var el = $('#blanket');
	if (el.css('display') == 'none') {
	    el.css('display','table');
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