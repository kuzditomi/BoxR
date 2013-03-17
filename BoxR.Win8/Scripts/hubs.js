﻿/*!
 * ASP.NET SignalR JavaScript Library v1.0.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/hubs.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                }
                else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies.game = this.createHubProxy('game');
        proxies.game.client = {};
        proxies.game.server = {
            edgeClicked: function (i, j) {
                /// <summary>Calls the EdgeClicked method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                /// <param name=\"i\" type=\"Number\">Server side type is System.Int32</param>
                /// <param name=\"j\" type=\"Number\">Server side type is System.Int32</param>
                return proxies.game.invoke.apply(proxies.game, $.merge(["EdgeClicked"], $.makeArray(arguments)));
            },

            finishGame: function () {
                /// <summary>Calls the FinishGame method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies.game.invoke.apply(proxies.game, $.merge(["FinishGame"], $.makeArray(arguments)));
            },

            getUsers: function () {
                /// <summary>Calls the GetUsers method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies.game.invoke.apply(proxies.game, $.merge(["GetUsers"], $.makeArray(arguments)));
            },

            invite: function (invited) {
                /// <summary>Calls the Invite method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                /// <param name=\"invited\" type=\"String\">Server side type is System.String</param>
                return proxies.game.invoke.apply(proxies.game, $.merge(["Invite"], $.makeArray(arguments)));
            },

            inviteAccepted: function () {
                /// <summary>Calls the InviteAccepted method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies.game.invoke.apply(proxies.game, $.merge(["InviteAccepted"], $.makeArray(arguments)));
            },

            inviteDenied: function () {
                /// <summary>Calls the InviteDenied method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies.game.invoke.apply(proxies.game, $.merge(["InviteDenied"], $.makeArray(arguments)));
            },

            login: function (username, password) {
                /// <summary>Calls the Login method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                /// <param name=\"username\" type=\"String\">Server side type is System.String</param>
                /// <param name=\"password\" type=\"String\">Server side type is System.String</param>
                return proxies.game.invoke.apply(proxies.game, $.merge(["Login"], $.makeArray(arguments)));
            },

            loginExternal: function (provider, token) {
                /// <summary>Calls the LoginExternal method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                /// <param name=\"provider\" type=\"String\">Server side type is System.String</param>
                /// <param name=\"token\" type=\"String\">Server side type is System.String</param>
                return proxies.game.invoke.apply(proxies.game, $.merge(["LoginExternal"], $.makeArray(arguments)));
            },

            logout: function () {
                /// <summary>Calls the Logout method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies.game.invoke.apply(proxies.game, $.merge(["Logout"], $.makeArray(arguments)));
            },

            test: function (token) {
                /// <summary>Calls the Test method on the server-side Game hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                /// <param name=\"token\" type=\"String\">Server side type is System.String</param>
                return proxies.game.invoke.apply(proxies.game, $.merge(["Test"], $.makeArray(arguments)));
            }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));