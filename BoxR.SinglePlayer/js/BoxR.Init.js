"use strict";
(function() {
    window.onload = function() {
        StartGame();
    };
})();

function StartGame() {
    var size = getDocHeight() * 0.65;

    var canvas = document.getElementById("gameCanvas");
    canvas.height = size;
    canvas.width = size;
    
    BoxR.GameInstance = new BoxR.Game(canvas);
    BoxR.GameInstance.Init(3, true);
    BoxR.GameInstance.Draw();

    canvas.addEventListener("click", function (e) { BoxR.GameInstance.Click(e); }, true);
    canvas.addEventListener("mousemove", function (e) { BoxR.GameInstance.MouseMove(e); });
}

function getDocHeight() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
}