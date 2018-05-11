import React, { Component } from 'react'
import ChanCoreContract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './utils/getWeb3'
import logo from './logo.svg'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Toolbar from 'material-ui/Toolbar'

import {Navbar, Jumbotron, Button, Panel} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';



import ChanDetails from './pages/ChanDetails';
import BuyNewChan from './pages/MarketPlace'


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

//import ChanDetails from './pages/ChanDetails';

class App extends Component {
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

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')

    //Extract contract ABI
    const chanCore = contract(ChanCoreContract);
    const saleClockAuction = contract(SaleClockAuctionContract);

    //Set Web3 Providers
    chanCore.setProvider(this.state.web3.currentProvider);
    saleClockAuction.setProvider(this.state.web3.currentProvider);
    console.log(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log({userAccount: accounts[0]});
      this.setState({account:accounts[0]});

      chanCore.deployed().then((instance) => {
        console.log("successfully deployed ChanCore");
        console.log(instance);
        this.setState({chanCoreInstance : instance});

        console.log(instance.getChan(0).then(result=> {console.log(result); }));
        console.log(instance.ownerOf(0).then(result=> {console.log(result); }));
        console.log(instance.saleAuction().then(result=> {console.log(result); }));

        console.log(instance.owner().then(result=> {
          console.log(result);
          console.log(this.state.account);
          console.log(result==this.state.account);
          this.setState({admin:true});
        }));
      });

      saleClockAuction.deployed().then((instance) => {
        this.setState({saleClockAuctionInstance:instance});

        console.log("successfully deployed SaleClockAuction");
        console.log(instance);
        console.log(instance.isSaleClockAuction().then(result=> {console.log(result); }));
        console.log(instance.ownerCut().then(result=> {console.log(result); }));

      });
    })
  }

  setAddr(){
    console.log(this.state.setaddr);
    console.log(this.state.chanCoreInstance);
    this.state.chanCoreInstance.setSaleAuctionAddress.sendTransaction(this.state.setaddr,{from:this.state.account}).then(result=> {console.log(result);});
  }

  handleChange(event){
    console.log(event.target.value);
    this.setState({setaddr: event.target.value});
  }

  withdraw(){
      console.log(this.state.saleClockAuctionInstance.withdrawBalance.sendTransaction({from:this.state.account}).then(result=> {console.log(result); }));
  }

  change(){




  }

  render() {
    let AdminDisplay = this.state.admin?        
         <div style={{width:'300px'}}>
            <Panel>
              <Panel.Heading>Admin Content</Panel.Heading>
              <Panel.Body></Panel.Body>
            </Panel>
        </div> : null;

    return (

     <Router>
      <div className="App">
        <header className="App-header">
          // <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Test</h1>
        </header>
        <p className="App-intro">
          Test
        </p>
        <span>set the SaleClockAuction's address </span>
        <input id="chanid" type="text" onChange={this.handleChange.bind(this)}></input>
        <button id="button" onClick={this.setAddr.bind(this)}>
        Set
        </button>
        <p id="detail">
        </p>
        <button id="withdraw" onClick={this.withdraw.bind(this)}>
        Withdraw
        </button>
        {AdminDisplay}


        <div>
        <Link to="/0">My Chans</Link>
        <Link to="/Marketplace">MarketPlace</Link>
        
        <Switch>
              <Route path="/Marketplace" render={(props) => <BuyNewChan {...props} contract={this.state.saleClockAuctionInstance} contract2={this.state.chanCoreInstance} />} />

        </Switch>
        </div>
      </div>
              </Router>
    );
  }
}
export default App