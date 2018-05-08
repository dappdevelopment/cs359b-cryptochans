import React, { Component} from 'react'
import Chanchancore_contract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuction from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './getweb3'
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';


import { Navbar, Jumbotron, Button, Panel } from 'react-bootstrap';


class App extends Component {

  instantiateContract(){
      const contract = require('truffle-contract');
      const chancore_contract = contract(Chanchancore_contract);
      const saleClockAuction_contract = contract(SaleClockAuction);

      chancore_contract.setProvider(this.state.web3.currentProvider);
      console.log(this.state.web3.currentProvider);
      saleClockAuction_contract.setProvider(this.state.web3.currentProvider);

      this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log({userAccount: accounts[0]});
      this.setState({account:accounts[0]});
      });

      chancore_contract.deployed().then((instance) => {
      console.log("success");
      console.log(instance);
      this.setState({contract_1:instance});

      console.log(instance.getChan(0).then(result=> {console.log(result); }));
      console.log(instance.ownerOf(0).then(result=> {console.log(result); }));

      console.log(instance.owner().then(result=> {
        console.log(result);
        console.log(this.state.account);
        console.log(result==this.state.account);
        this.setState({admin:true});
       }));


    });


      saleClockAuction_contract.deployed().then((instance) => {
      this.setState({contract_2:instance});

      console.log("success");
      console.log(instance);

      console.log(instance.isSaleClockAuction().then(result=> {console.log(result); }));
      console.log(instance.ownerCut().then(result=> {console.log(result); }));

    });

  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  setAddr(){
    console.log(this.state.setaddr);
    console.log(this.state.contract_2);
    // this.state.contract_2.setSaleAuctionAddress(this.state.setaddr).then(result=> {console.log(result);});
  }

  handleChange(event){
    console.log(event.target.value);
    this.setState({setaddr: event.target.value});
  }

  withdraw(){
      console.log(this.state.contract_2);
      console.log(this.state.contract_2.withdrawBalance().then(result=> {console.log(result); }));
  }

  change(){




  }


  constructor(props) {
    super(props)

    this.state = {
      admin: false
    }

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
      </div>


    );
  }
}

export default App;
