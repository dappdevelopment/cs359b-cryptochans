import React from 'react';

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Admin extends React.Component {
  //   constructor(props) {
  //   super(props)

  //   this.state = {
  //     admin: false,
  //     web3: null
  //   }

  // }


  componentWillMount() {
      const { match, contract1, contract2} = this.props;
      // const selectedId = match.params.id;
      console.log(contract2);
      this.ChanCoreContract = contract2;
      this.SaleAuctionCoreContract = contract1;

  }

  handleNameChange(event){
    console.log(event.target.value);
    this.setState({name: event.target.value});
  }

  createGen0Auction(){
    this.ChanCoreContract.createGen0Auction(this.state.name, true);
  }


  render() {


    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
          <span>Create Gen 0 Auction</span>
          <input id="chanName" type="text" onChange={this.handleChange.bind(this)}></input>
          <button id="button" onClick={this.createGen0Auction.bind(this)}>
            Set
          </button>
        </div>
      </div>
    )
  }
}
