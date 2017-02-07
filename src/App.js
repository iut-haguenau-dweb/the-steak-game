import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

let socket = io(`http://localhost:2479`);

class Steak extends React.Component {
  constructor(props) {
    super();
		this.state = {
			meat: props,
			hovered: []
		};
  }
	
	getHoveredPieces = (i,radius) => {
		return this.props.meat.filter((meatPiece) => {
			return (Math.abs(this.props.meat[i].x - meatPiece.x) + Math.abs(this.props.meat[i].y - meatPiece.y) <= radius);
		});
	}
	
	stampHover = (i) => {
		let radius = 2;
		this.setState({hovered: this.getHoveredPieces(i,radius)});
	}
	
	stampClick = (i) => {
		socket.emit("stampOn", {
			meatIndex: i
		});
	}
	
  render() {
		var meat = [];
		
		for(let i=0; i<this.props.meat.length; i++){
			let styleClasses = this.props.meat[i].state;
			for (let j=0; j<this.state.hovered.length; j++) {
				if (this.props.meat[i] === this.state.hovered[j]) {
					styleClasses += " hovered";
				}
			}
			meat.push(<div className={styleClasses} onClick={()=>this.stampClick(i)} onMouseOver={()=>this.stampHover(i)} style={{top: 160+this.props.meat[i].y*16, left: 160+this.props.meat[i].x*16 }}></div>);
		}

		return (
				<div className="steak">
					{meat}
    		</div>
			);
  }
}
	
/*class Panel extends React.Component {
  constructor(props) {
    super();
		this.state = {
			player1: props.player1,
			player2: props.player2,
			queue: props.queue
		};
	}
	
  render() {
		console.log(this.props);
  }
}*/

class App extends Component {
	constructor() {
		super();
		this.state = {
			meat: []
		}
	}
	
  render() {
    return (
      <Steak meat={this.state.meat}/>
    );
  }
	
	componentDidMount() {
		socket.on("initClient", (data)=> {
			this.setState({meat: data.steak});
		});
		
		socket.on("updateGame", (data)=> {
			let wholeNewState = this.state.meat;
			for (let i = 0; i < wholeNewState.length; i++) {
				for(let j = 0; j<data.updatedMeat.length; j++) {
					if((wholeNewState[i].x === data.updatedMeat[j].x) && (wholeNewState[i].y === data.updatedMeat[j].y)){
						let newState = data.updatedMeat[j].state;
						wholeNewState[i].state = newState;
					}
				}
			}
			this.setState({meat: wholeNewState});
		});
	}
}

export default App;
