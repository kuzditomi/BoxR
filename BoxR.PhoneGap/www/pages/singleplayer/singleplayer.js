function initSinglePlayer() {
    //$('.container').css('height', getDocHeight());
    var size = $('canvas').parent().width(); //getDocHeight() * 0.65;

    var canvas = $('canvas')[0];
    canvas.height = size;
    canvas.width = size;

    BoxR.Manager.Game = new BoxR.Game(canvas, true, true);
    BoxR.Manager.Game.Init(3, true);
    BoxR.Manager.Game.Draw();

    canvas.addEventListener("click", function(e) { BoxR.Manager.Game.Click(e); }, true);
    canvas.addEventListener("mousemove", function(e) { BoxR.Manager.Game.MouseMove(e); });
    if (typeof(Storage) !== "undefined") {
        var bgcolor = localStorage["BoxRbg"] || "rgba(255, 46, 18, .8)";

        BoxR.activeColor = bgcolor;
        BoxR.Manager.Game.Draw();
    }
    var $backbutton = $('#backbutton');
    if ($backbutton) {
        $backbutton.on('click', function() {
            document.location.href = "/";
        });
        $backbutton.show();
    }
    $(window).resize(function() {
        $('.container').css('height', getDocHeight());
        var newWidth = $('canvas').parent().width();
        BoxR.Manager.Game.Resize(newWidth);
        BoxR.Manager.Game.Draw();
    });
}

function getDocHeight() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
}
