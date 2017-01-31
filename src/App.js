import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

let socket = io(`http://localhost:2479`);

class Steak extends React.Component {
  constructor(props) {
    super();
		this.state = {
			meat: props
		};
  }
	
  render() {
		console.log(this.props);
		var meat = []
		
		for(let i=0; i<this.props.meat.length; i++){
			meat.push(<div className="meat" style={{top: 160+this.props.meat[i].y*16, left: 160+this.props.meat[i].x*16 }}></div>);
		}

		return (
				<div className="steak">
					{meat}
    		</div>
			);
  }
}

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
			this.setState({meat: data.steak.meat})
		});
	}
}

export default App;
