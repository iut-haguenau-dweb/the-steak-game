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
var players = []; //Player 1 and 2 are players[0] and [1]. Others are considered in queue
var nextMoveFor = -1; //-1 = pause, 0 = player 1, 1 = player 2;

var steak;

var classes = require('./classes');

console.log("Game initialised");

/***************** REAL TIME STUFF ***************************/

//Not actually used
// NOTATION: A supprimer
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

	/*** If a second player connects, start the game ***/
	if((nextMoveFor === -1) && (totalPlayer >= 2)) {
		nextMoveFor = 0;
	}
	socket.emit("initClient",clientInfo);

	client.on('stampOn', function(data){

		/*** Check if there is 2 players connected ***/
		if(nextMoveFor === -1){
			// NOTATION: Rajouter des return permet d'avoir moins de else if imbriqués
			socket.emit('printErrorMessage',"There isn't enough players to start the game");
		}

		/*** If so, check if it's the turn of the player who clicked ***/
		else if(client.id === players[nextMoveFor].clientId) {
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

			// NOTATION: Simplifiable avec un ternaire
			// Ou même nextMoveFor = 1 - nextMoveFor (mais je préfère le ternaire pour que ce soit plus simple à comprendre)
			if(nextMoveFor === 0) {
				nextMoveFor = 1;
			}
			else if(nextMoveFor === 1) {
				nextMoveFor = 0;
			}

			var response = {};
			response.updatedMeat = stampedMeat
			socket.emit('updateGame',response);
		}

		/*** Else, it's not the current player turn ***/
		else{
			socket.emit('printErrorMessage',"It is not your turn");
		}
	});

	client.on('disconnect', function(data){
		for(var i = 0; i<players.length; i++) {
			// NOTATION: Enlève les console.log inutiles quand tu as fini
			console.log("boop "+i);
			console.log(players[i]);
			if(players[i].clientId === client.id) {
				console.log(players[i].username+" disconnected");

				//Shifting the players array
				// NOTATION: C'est un peu bizarre. En utilisant un tableau, et par exemple
				// filter, tu devrais ne pas avoir a faire ce genre de choses.
				delete players[i];
				for(var j = i; j<players.length; j++) {
					if (players[j+1] != undefined) {
						players[j] = players[j+1];
					}
					else {
						players.pop();
					}
				}
				console.log(players);
			}
		}
		totalPlayer--;
		/*** If there is less than 2 players, pause the game ***/
		if(totalPlayer < 2) {
			nextMoveFor = -1;
		}
	});

});


/*********************** FUNCTIONS ****************************/

function resetSteak() {
// NOTATION: Simplifiable
	var response = new classes.Steak();
	return response;
}
