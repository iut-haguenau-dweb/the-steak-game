module.exports = {
	
	//**************** STEAK ******************
	
	Steak: function () {
		this.meat = [
				{x:0,y:0},
				{x:-1,y:0},
				{x:0,y:-1},
				{x:-1,y:-1}
		];
	},
	
	//*************** PLAYER ******************

	Player: function(id,username,clientId) {
		
		this.id = id;
		this.username = username;
		this.clientId = clientId;
		this.score = 0;
		
	}
};

/****************** INTERNAL FUNCTIONS *******************/



	



