import React from 'react';
import getWeb3 from '../../utils/getWeb3'

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Admin extends React.Component {
  constructor(props) {
     super(props)

     this.state = {
       admin: false,
       web3: null
     }

  }


  componentWillMount() {
      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.

      getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Get accounts.
        results.web3.eth.getAccounts((error, accounts) => {
          this.setState({account:accounts[0]});
        })
      }).catch(() => {
        console.log('Error finding web3.')
      })

      const { match, contract, contract2} = this.props;
      // const selectedId = match.params.id;
      console.log(contract2);
      this.ChanCoreContract = contract2;
      this.SaleAuctionCoreContract = contract;

  }

  handleNameChange(event){
    console.log(event.target.value);
    this.setState({name: event.target.value});
  }

  createGen0Auction(){
    console.log(this.state.account);
    this.ChanCoreContract.gen0CreatedCount.call().then(count => {console.log("Gen 0 created:"+count);});
    this.ChanCoreContract.gen0CreationLimit.call().then(count => {console.log("Gen 0 creation limit:"+count);});
    this.ChanCoreContract.createGen0Auction.sendTransaction(this.state.name,true,{from:this.state.account});
  }

  togglePause(){
    console.log(this.state.account);
    this.ChanCoreContract.paused().then( isPaused => {
      console.log(isPaused);
      if(isPaused){
        this.ChanCoreContract.unpause.sendTransaction({from:this.state.account});
      } else {
        this.ChanCoreContract.pause.sendTransaction({from:this.state.account});
      }
    });
    this.ChanCoreContract.gen0CreatedCount.call().then(count => {console.log("Gen 0 created:"+count);});
    this.ChanCoreContract.gen0CreationLimit.call().then(count => {console.log("Gen 0 creation limit:"+count);});
    this.ChanCoreContract.createGen0Auction.sendTransaction(this.state.name,true,{from:this.state.account});
  }

  checkBalance(){
    this.ChanCoreContract.checkAuctionBalances().then( balance => {
      console.log("Contract Balance: " + balance.toNumber()/1000000000000000000 + "ETH");
    });
  }

  withdrawBalance(){
    this.ChanCoreContract.withdrawAuctionBalances.sendTransaction({from:this.state.account});
  }


  render() {


    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
          <span>Create Gen 0 Auction</span>
          <input id="chanName" type="text" onChange={this.handleNameChange.bind(this)}></input>
          <button id="button" onClick={this.createGen0Auction.bind(this)}>
            Create
          </button>
        </div>
        <div>
          <button id="button" onClick={this.togglePause.bind(this)}>
            Pause/Unpause
          </button>
        </div>
        <div>
          <button id="button" onClick={this.checkBalance.bind(this)}>
            Check Balance
          </button>
          <button id="button" onClick={this.withdrawBalance.bind(this)}>
            Withdraw Balance
          </button>
        </div>
      </div>
    )
  }
}
