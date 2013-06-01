$(function () {
    if (typeof (Storage) !== "undefined") {
        $('body').css("background-color", localStorage["BoxRbg"] || "#16a085");
    }
    $('.container').css('height', $(window).height());
    var $colorDiv = $('#colors');
    var colors = [
        "16a085",			
        "27ae60",			
        "2980b9",
        "8e44ad",
        "f39c12",
        "d35400",
        "c0392b",
        "7f8c8d",
        "2c3e50"
    ];
    for (var i = 0; i < colors.length; i++) {
        var $box = $('<div/>').css({
            width: '10px',
            height: '10px',
            background: '#'+colors[i],
            margin: '10px',
            display: 'inline-block',
            cursor: 'pointer'
        }).click(function() {
            $('body').css("background-color", $(this).css('background-color'));
            if (window.BoxR && BoxR.activeColor && BoxR.GameInstance) {
                BoxR.activeColor = $(this).css('background-color');
                BoxR.GameInstance.Draw();
            }
            if (typeof (Storage) !== "undefined") {
                localStorage["BoxRbg"] = $(this).css('background-color');
            }
        });
        $colorDiv.append($box);
    }
    $(window).resize(function () {
        $('.container').css('height', $(window).height());
    });
});