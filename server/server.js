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

/* CONST */
var STAMPRADIUS = 2;

/* Players related vars */
var totalPlayer = 0;
var nextPlayerId = 1;
var players = []; //players [0] = joueur 1, etc...
var nextMoveFor = -1;

var steak;

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
		steak: steak.revealed
	};
	
	socket.emit("initClient",clientInfo);
	
	client.on('stampOn', function(data){
		var stampedMeat = steak.meat.filter((meatPiece) => {
			return (Math.abs(steak.meat[data.meatIndex].x - meatPiece.x) + Math.abs(steak.meat[data.meatIndex].y - meatPiece.y) <= STAMPRADIUS);
		});
		stampedMeat.forEach(function(stampedPiece) {
			var stillHidden = true;
			for(var i=0; i<steak.bone.length; i++) {
				if((stampedPiece.x === steak.bone[i].x) && (stampedPiece.y === steak.bone[i].y)) {
					stampedPiece.state = "bone";
					stillHidden = false;
				}
			}
			if (stillHidden) {
				stampedPiece.state = "meat";
			}
		});
		console.log(stampedMeat);
		var response = {};
		response.updatedMeat = stampedMeat
		socket.emit('updateGame',response);
	});
	
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