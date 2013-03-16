(function () {
    "use strict";

    var controlClass = WinJS.Class.define(
            function (element, options) {
                this.element = element || document.createElement("div");
                this.element.winControl = this;

                this.element.style.display = "none";

                this.element.className = 'messagebox';
                // opacity background
                var bg = document.createElement("div");
                bg.style.position = 'absolute';
                bg.style.top = '0';
                bg.style.left = '0';
                bg.style.width = '100%';
                bg.style.height = '100%';
                bg.style.background = '#000';
                bg.style.opacity = '0.65';

                var section = document.createElement("section");
                var span = document.createElement("span");
                this._span = span;
                var btns = document.createElement("div");
                btns.className = 'buttonContainer';
                section.style.position = 'relative';
                this._btnDiv = btns;

                section.appendChild(span);
                section.appendChild(btns);
                this.element.innerHTML = '';
                this.element.appendChild(bg);
                this.element.appendChild(section);
            }, {
                Show: function () {
                    if(this.element.style.display == "none")
                        this.element.style.display = "-ms-flexbox";
                },
                Hide: function () {
                    this.element.style.display = "none";
                },
                SetBtn: function (btnoptions) {
                    this._btnDiv.innerHTML = '';
                    for (var i = 0; i < btnoptions.length; i++) {
                        var btnOption = btnoptions[i];
                        var btn = document.createElement("button");
                        btn.textContent = btnOption.text || "button";
                        btn.style.background = btnOption.background || "darkslateblue";
                        btn.style.color = btnOption.color || "white";
                        btn.addEventListener('click', btnOption.click);
                        this._btnDiv.appendChild(btn);
                    }
                },
                SetText: function (text) {
                    this._text = text;
                    this._span.textContent = this._text;
                }
            });
    WinJS.Namespace.define("BoxR.UI", {
        PopupControl: controlClass
    });
})();