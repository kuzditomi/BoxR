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
});