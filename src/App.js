import React, { Component } from 'react'
import ChanCoreContract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './utils/getWeb3'
import logo from './logo.svg'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Toolbar from 'material-ui/Toolbar'

import {Navbar, Jumbotron, Button, Panel,Carousel, Grid} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';



import ChanDetails from './pages/ChanDetails';
import BuyNewChan from './pages/MarketPlace'
import Mychans from './pages/Mychans'

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
      <div>
           <Router basename={'/cryptochans/'}>
      <div className="App">
            <header className="App-header">
          <img src={logo} className="App-logo" alt="logo.jpg" />
          <h1 className="App-title">Cryptochans</h1>
        </header>



        <div>

      <Link to="/0"><Button  bsStyle="info">Chan Detail page</Button></Link> 
      &emsp;

        <Link to="/cryptochans/Marketplace"><Button  bsStyle="info">MarketPlace</Button></Link> 
&emsp;
       <Link to="/cryptochans/MyChans"><Button  bsStyle="info">See My Chans</Button></Link>
&emsp;
        <Link to="/"><Button  bsStyle="info">Go Back</Button></Link>

        <Switch>

              <Route path="/cryptochans/Mychans" render={(props) => <Mychans {...props} contract={this.state.chanCoreInstance}/>} />
              <Route path="/cryptochans/Marketplace" render={(props) => <BuyNewChan {...props} contract={this.state.saleClockAuctionInstance} contract2={this.state.chanCoreInstance} />} />
              <Route path="/cryptochans/:id" render={(props) => <ChanDetails {...props} contract={this.state.chanCoreInstance}/>} />
                            <Route path="/" render={(props)=><Carousel>
  <Carousel.Item>
    <img width={900} height={500} alt="900x500" src="http://img.wxcha.com/file/201711/28/0ba7b1180e.jpg?down" />
    <Carousel.Caption>
      <h3>First slide label</h3>
      <p>Cryptochans</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img width={900} height={500} alt="900x500" src="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg" />
    <Carousel.Caption>
      <h3>Second slide label</h3>
      <p>Cryptochans</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>}           />



        </Switch>
        </div>
      </div>
      
              </Router>


        
                     





</div>



    );
  }
}
export default App