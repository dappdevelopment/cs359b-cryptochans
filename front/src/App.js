import React, { Component} from 'react'
import Chanchancore_contract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuction from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './getweb3'
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';

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
      //this.cur_account = accounts[0];
      });

      chancore_contract.deployed().then((instance) => {
      console.log("success");
      console.log(instance);

      // var chanid = document.getElementById('chanid');

      // console.log(chanid);

      console.log(instance.getChan(0).then(result=> {console.log(result); }));
      console.log(instance.ownerOf(0).then(result=> {console.log(result); }));

      console.log(instance.owner().then(result=> {
        console.log(result);
        console.log(this.state.account);
        console.log(result==this.state.account);
       }));


    });


      saleClockAuction_contract.deployed().then((instance) => {
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


  render() {

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
        <input id="chanid" type="text"></input>
        <button id="button">
        Set
        </button>
        <p id="detail">
        </p>
      </div>
    );
  }
}

export default App;
