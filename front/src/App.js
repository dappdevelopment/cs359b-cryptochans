import React, { Component,  PropTypes} from 'react'
import Chanchancore_contract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuction from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './getweb3'
import logo from './logo.svg';
import './App.css';


class App extends Component {
  state = {
    address: null,
    contract: null,
    loading: false,
  }


  render() {
    const contract = require('truffle-contract');
    const chancore_contract = contract(Chanchancore_contract);
    const saleClockAuction_contract = contract(SaleClockAuction);
    getWeb3
    .then(results => {
      chancore_contract.setProvider(results.web3.currentProvider);
      console.log(results.web3.currentProvider);
      saleClockAuction_contract.setProvider(results.web3.currentProvider);

      results.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log({userAccount: accounts[0]});
      });

      chancore_contract.deployed().then((instance) => {
      console.log("success");
      console.log(instance);

      var chanid = document.getElementById('chanid');

      console.log(chanid);

      console.log(instance.getChan(0).then(result=> {console.log(result); }));
      console.log(instance.ownerOf(0).then(result=> {console.log(result); }));

    });


      saleClockAuction_contract.deployed().then((instance) => {
      console.log("success");
      console.log(instance);

      console.log(instance.isSaleClockAuction().then(result=> {console.log(result); }));
      console.log(instance.ownerCut().then(result=> {console.log(result); }));

    });


        
      });





    return (

      <div className="App">
        <header className="App-header">
          // <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Test</h1>
        </header>
        <p className="App-intro">
          Test
        </p>
        <span>Chan id: </span>
        <input id="chanid" type="int"></input>
        <button id="button">
        Find
        </button>
        <p id="detail">
        </p>
      </div>
    );
  }
}

export default App;
