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

      this.ChanCoreContract.paused().then( isPaused => {
        console.log("Pause status: " + isPaused);
        this.setState({isPaused: isPaused});
      });

  }

  handleNameChange(event){
    console.log(event.target.value);
    this.setState({name: event.target.value});
  }

  createGen0Auction(){
    self=this;
    console.log(this.state.account);
    this.ChanCoreContract.gen0CreatedCount.call().then(count => {console.log("Gen 0 created:"+count); self.count=count}).then(result=>{
        this.ChanCoreContract.createGen0Auction.sendTransaction(
        this.state.name,
        true,   //gender
        0x0,    //personality
        {from:this.state.account}
      ).then(result => {
        console.log(result);
        const id = parseInt(self.count)+2;
        const image_url = "https://s3.amazonaws.com/cryptochans/"+id+".jpg";
        this.saveDB(id, this.state.name, 0, this.state.account, Date.now(), image_url);
      })
    })
    this.ChanCoreContract.gen0CreationLimit.call().then(count => {console.log("Gen 0 creation limit:"+count);});


  }


  saveDB(given_id,given_name, given_gender, given_owner, given_birthday, given_imgurl){
      fetch('/api/createchan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: given_id, name:given_name,gender:given_gender, auction:1, owner: given_owner, birthday:given_birthday, level:0, url:given_imgurl}),
    }) 
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      let message = 'created!';
      console.log(result);
      if (status === 400) {
        // TODO: handle this...
        message = 'Error in updating claim';
      }
    }.bind(this))
    .catch(console.err);
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

  setAddr(){
    console.log(this.state.setaddr);
    console.log(this.state.chanCoreInstance);
    this.ChanCoreContract.setSaleAuctionAddress.sendTransaction(this.state.setaddr,{from:this.state.account}).then(result=> {console.log(result);});
  }

  handleAddrChange(event){
    console.log(event.target.value);
    this.setState({setaddr: event.target.value});
  }

  levelUpToMax(){
    this.ChanCoreContract.LevelUpToMax.sendTransaction(this.state.chanIdToMax,{from:this.state.account}).then(result=> {console.log(result);});
  }

  handleChanIdToMaxChange(event){
    console.log(event.target.value);
    this.setState({chanIdToMax: event.target.value});
  }

  startBonding(){
    this.ChanCoreContract.bondWith.sendTransaction(
      this.state.bondingChanId1,
      this.state.bondingChanId2,
      {from:this.state.account}).then(result=> {console.log(result);});
  }

  handleBondingChan1Change(event){
    console.log(event.target.value);
    this.setState({bondingChanId1: event.target.value});
  }

  handleBondingChan2Change(event){
    console.log(event.target.value);
    this.setState({bondingChanId2: event.target.value});
  }

  shokan(){
    this.ChanCoreContract.shokan.sendTransaction(
      this.state.shokanChanId,
      this.state.newChanName,
      {from:this.state.account}).then(result=> {console.log(result);});
  }

  handleShokanChanIdChange(event){
    console.log(event.target.value);
    this.setState({shokanChanId: event.target.value});
  }

  handleNewChanNameChange(event){
    console.log(event.target.value);
    this.setState({newChanName: event.target.value});
  }


  render() {

    const isPaused = this.state.isPaused;

    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
          <span>Create Gen 0 Auction</span>
          <br/>
          <span>Name</span>
          <input id="chanName" type="text" onChange={this.handleNameChange.bind(this)}></input>
          <Button bsStyle="primary" id="button" onClick={this.createGen0Auction.bind(this)}>
            Create
          </Button>
        </div>
        <br/>
        <div>
          <Button bsStyle="primary" id="pauseButton" onClick={this.togglePause.bind(this)}>
            {isPaused ? "Unpause" : "Pause"}
          </Button>
        </div>
        <br/>
        <div>
          <Button bsStyle="primary" id="checkButton" onClick={this.checkBalance.bind(this)}>
            Check Balance
          </Button>
          <Button bsStyle="primary" id="withdrawButton" onClick={this.withdrawBalance.bind(this)}>
            Withdraw Balance
          </Button>
        </div>
        <br/>
        <div>
          <span>Set SaleClockAuction's address</span>
          <input id="addr" type="text" onChange={this.handleAddrChange.bind(this)}></input>
          <Button bsStyle="primary" id="setButton" onClick={this.setAddr.bind(this)}>
            Set
          </Button>
        </div>
        <div>
          <span>Max out a Chan's Level</span>
          <input id="chanId" type="text" onChange={this.handleChanIdToMaxChange.bind(this)}></input>
          <Button bsStyle="primary" id="maxLevelButton" onClick={this.levelUpToMax.bind(this)}>
            Max Level
          </Button>
        </div>
        <div>
          <span>Bond 2 Chans</span>
          <input id="bondingChanId1" type="text" onChange={this.handleBondingChan1Change.bind(this)}></input>
          <input id="bondingChanId2" type="text" onChange={this.handleBondingChan2Change.bind(this)}></input>
          <Button bsStyle="primary" id="startBonding" onClick={this.startBonding.bind(this)}>
            Bond
          </Button>
        </div>
        <div>
          <span>Shokan: (ChanID; New Chan Name)</span>
          <input id="shokanChanId" type="text" onChange={this.handleShokanChanIdChange.bind(this)}></input>
          <input id="newChanName" type="text" onChange={this.handleNewChanNameChange.bind(this)}></input>
          <Button bsStyle="primary" id="shokan" onClick={this.shokan.bind(this)}>
            Shokan
          </Button>
        </div>
      </div>
    )
  }
}
