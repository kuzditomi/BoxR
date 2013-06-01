var Popup = function (_element) {
    "use strict";
    var self = this;
    self.Init = function(element) {
        self.element = element;

        self.element.style.display = "none";
        self.element.style.position = "absolute";
        self.element.style.top = "0px";
        self.element.style.left = "0px";
        self.element.style.width = "100%";
        self.element.style.height = "100%";
        self.element.style.zIndex = "11";

        self.element.className = 'messagebox';
        // opacity background
        var bg = document.createElement("div");
        bg.id = "popupBackground";

        var outer = document.createElement("div");
        outer.id = "popupOuter";

        var middle = document.createElement("div");
        middle.id = "popupMiddle";

        var inner = document.createElement("div");
        inner.id = "popupInner";

        var section = document.createElement("section");

        var p = document.createElement("p");

        self.p = p;
        var btns = document.createElement("div");
        self._btnDiv = btns;

        section.appendChild(p);
        section.appendChild(btns);
        inner.appendChild(section);
        middle.appendChild(inner);
        outer.appendChild(middle);

        self.element.innerHTML = '';
        self.element.appendChild(bg);
        self.element.appendChild(outer);
    };

    self.Show = function() {
        if (self.element.style.display == "none")
            self.element.style.display = "table";
    };
    self.Hide = function() {
        self.element.style.display = "none";
    };
    self.SetBtn = function(btnoptions) {
        if (!btnoptions)
            return;
        self._btnDiv.innerHTML = '';
        for (var i = 0; i < btnoptions.length; i++) {
            var btnOption = btnoptions[i];
            var btn = document.createElement("a");
            btn.className = "button";
            btn.textContent = btnOption.text || "button";
            btn.style.background = btnOption.background || "darkslateblue";
            btn.style.color = btnOption.color || "white";
            btn.addEventListener('click', btnOption.click);
            self._btnDiv.appendChild(btn);
        }
    };
    self.SetText = function(text) {
        self.p.textContent = text;
    };

    self.Win = function () {
        var btnSettings = [{
            text: "Ok",
            background: "green",
            click:function() {
                window.location.reload();
            }
        }];
        self.SetBtn(btnSettings);
        self.SetText("Congratulation, you have won the game!");
        self.Show();
    };
    self.Lose = function () {
        var btnSettings = [{
            text: "Ok",
            background: "red",
            click: function () {
                window.location.reload();
            }
        }];
        self.SetBtn(btnSettings);
        self.SetText("You have lost the game.");
        self.Show();
    };
    self.Invite = function (username) {
        var btnSettings = [
            {
                text: "Accept",
                background: "green",
                click: function () {
                    BoxR.Manager.Hub.server.inviteAccepted();
                    self.Hide();
                }
            },
            {
                text: "Deny",
                background: "red",
                click: function () {
                    BoxR.Manager.Hub.server.inviteDenied();
                    self.Hide();
                }
            }
        ];
        self.SetBtn(btnSettings);
        self.SetText(username + " has challenged you!");
        self.Show();
    };
    self.Wait = function (username) {
        var btnSettings = [
            {
                text: "Cancel",
                background: "red",
                click: function () {
                    BoxR.Manager.Hub.server.inviteDenied();
                    self.Hide();
                }
            }
        ];
        self.SetBtn(btnSettings);
        self.SetText("You have challenged " + username + ", please wait for the response.");
        self.Show();
    };
    
   

    self.Init(_element);
    return self;
};