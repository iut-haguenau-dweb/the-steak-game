/********************* INITIALISATION SERVEUR ************************/

/* Import des packages de Node */
var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

/* Création du serveur http */
var server = http.createServer();

server.listen(2479);
console.log("Server's up ! :)");

var socket = new io(server);

/********************* INITIALISATION STEAK-GAME ************************/

var pixelSize = 16;
var containerWidth = 20;
var containerHeight = 20;
var totalPlayer = 0;
var nextPlayerId = 1;

var timer = 0; //timer nécessaire à l'animation, pas toucher !!!
var isPaused = true;

var container;
var steak;
var players = []; //players [0] = joueur 1, etc...

var classes = require('./classes');

console.log("Game initialised");

/***************** REAL TIME STUFF ***************************/


timer = setInterval(
function() {
	
}, 10);


/***************** SOCKET EVENT HANDLERS **************************/


socket.on('connection', function(client){
	
	if(totalPlayer <= 0) {
		steak = resetSteak();
	}
	
	var username = "Guest #"+nextPlayerId;
	players.push(new classes.Player(nextPlayerId,username,client.id));
	console.log(username+" connected");
	totalPlayer++;
	nextPlayerId++;
	
	var clientInfo = {
		steak: steak
	};
	
	socket.emit("initClient",clientInfo);
	
	client.on('disconnect', function(data){
		players.forEach(function(player) {
			if(player.clientId === client.id) {
				console.log(player.username+" disconnected");
				delete player;
			}
		});
		totalPlayer--;
	});
	
});


/*********************** FUNCTIONS ****************************/

function resetSteak() {
	var response = new classes.Steak();
	return response;
}