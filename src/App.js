import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

// NOTATION: Tu n'as pas encore beaucoup avancé, c'est dommage.

// NOTATION: Utilise plutot const ici
let socket = io(`http://localhost:2479`);

class Steak extends React.Component {
  constructor(props) {
    super();
		this.state = {
			meat: [
				{x:0,y:0},
				{x:-1,y:0},
				{x:0,y:-1},
				{x:-1,y:-1}
			]
		};
  }

  render() {
	  // NOTATION: Utilise plutot const ici
		var boutdesteak = []

		// NOTATION: Pour info, à la place du for, tu peux écrire :
		// const boutdesteak = this.state.meat.map(function (meat) {
		//     return <div className="meat" style={{top: 160+meat[i].y*16, left: 160+meat[i].x*16 }}></div>;
		// })
		for(let i=0; i<this.state.meat.length; i++){
			boutdesteak.push(<div className="meat" style={{top: 160+this.state.meat[i].y*16, left: 160+this.state.meat[i].x*16 }}></div>);
		}

		return (
				<div className="steak">
					{boutdesteak}
    		</div>
			);
  }
}

class App extends Component {
  render() {
    return (
      <Steak />
    );
  }
}

export default App;
