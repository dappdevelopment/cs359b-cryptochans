import React, { Component,  PropTypes} from 'react'
import ChanOwnership from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
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
    const ownership = contract(ChanOwnership);
    getWeb3
    .then(results => {
      ownership.setProvider(results.web3.currentProvider);
      console.log(results.web3.currentProvider);

      // const net_id = results.web3.eth.getId();
      // const address = ownership.networks[net_id].address;
      // const contract1 = new results.web3.eth.Contract(ownership.abi, address);


      results.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log({userAccount: accounts[0]});
      });

      ownership.deployed().then((instance) => {
      // console.log(instance.Transfer(1,1,1));
      // console.log(instance.getChan(1).call({from:"0x993406b67fd87715893a47aefb4944b5a5f9c535"}));
      console.log("success");
      console.log(instance.Pause());

      // console.log(instance.balanceOf("0x993406b67fd87715893a47aefb4944b5a5f9c535"));
      // console.log(instance.balanceOf.call({from: "0x993406b67fd87715893a47aefb4944b5a5f9c535"}, 1));
      console.log("?");
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
        <input id="chanid" type="text"></input>
        <button id="button">
        Buy!
        </button>
      </div>
    );
  }
}

export default App;
