(function() {
    window.onload = function () {
        var name = HtmlEncode(window.location.search.replace("?name=", ""));
        document.getElementById('selfname').textContent = name || "You";
        document.getElementById('name').textContent = name || "You";
        var size = getDocHeight() * 0.65;
        
        var canvas = document.getElementById("gameCanvas");
        canvas.height = size;
        canvas.width = size;
        var game = new BoxR.Game(canvas);
        game.Init(3, true);
        game.Draw();

        canvas.addEventListener("click", function (e) { game.Click(e); }, true);
        canvas.addEventListener("mousemove", function (e) { game.MouseMove(e); });
    };
})();

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function HtmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}