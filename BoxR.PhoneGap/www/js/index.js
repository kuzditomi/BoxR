/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var currentPage = '';
var hub;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    loadPage: function (url,onready) {
        var xmlhttp = new XMLHttpRequest();

        // Callback function when XMLHttpRequest is ready
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    document.getElementById('container').innerHTML = xmlhttp.responseText;
                    if (onready)
                        onready();
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        //if(window.Worker)
        //BoxR.Manager.Client = new BoxR.PhoneGapClient();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
		app.loadPage('pages/start/start.html');
        console.log('Received Event: ' + id);
		
    }
};

function loadSinglePlayer() {
    currentPage = "single";
    app.loadPage('pages/singleplayer/singleplayer.html', initSinglePlayer);
}
function loadMultiPlayer() {
    currentPage = "multi";
    app.loadPage('pages/multiplayer/multiplayer.html', initMultiPlayer);
}
function loadUsers() {
    currentPage = "users";
    app.loadPage('pages/users/users.html', initUsers);
}
function gyerunk(){
	hub.server.login('kuzditomi', 'kuzditomi').done(function (success) {
        alert(success);
        //$("#loginprogress").hide();
    }).fail(function(hiba){
		alert('hiba:'+hiba);
	});;
}