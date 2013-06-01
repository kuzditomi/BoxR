$(document).ready(function () {

    $(".username").focus();

    $(".username").keydown(function (event) {
        if (event.which == 13) {
            var form = $(this).closest("form");
            form.submit();
        }

    });
    $(".password").keydown(function (event) {
        if (event.which == 13) {
            var form = $(this).closest("form");
            form.submit();
        }
    });
    $('.backbutton').show();
    
    var $backbutton = $('.backbutton');
    if ($backbutton) {
        $backbutton.on('click', function () {
            document.location.href = "/";
        });
        $backbutton.show();
    }
});