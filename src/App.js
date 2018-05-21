import React, { Component } from 'react'
import ChanCoreContract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './utils/getWeb3'

import logo from './logo.jpg'
import PropTypes from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Toolbar from 'material-ui/Toolbar'

import {Alert,Navbar, Jumbotron, Button, Panel,Carousel, Grid,Col, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';



import ChanDetails from './pages/ChanDetails';
import BuyNewChan from './pages/MarketPlace'
import Mychans from './pages/Mychans'
import Admin from './pages/Admin'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'




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

        instance.getChan(0).then(result=> {console.log("Chan #0: " + result); });
        instance.ownerOf(0).then(result=> {console.log("Owner of Chan #0: " + result); });
        instance.saleAuction().then(result => {console.log("Sale Auction Address: " + result); });

        instance.owner().then(result=> {
          console.log("Contract Owner: " + result);
          console.log("Current Account: " + this.state.account);
          console.log("IsOwner: " + (result==this.state.account));
          this.setState({admin:result==this.state.account});
        });
      });

      saleClockAuction.deployed().then((instance) => {
        this.setState({saleClockAuctionInstance:instance});

        console.log("successfully deployed SaleClockAuction");
        console.log(instance);
  

      });
    })
  }

  change(){




  }

  render() {

    fetch('/api/test')
  .then(function(response) {
      return response.json();
  }).then(function(data){
    console.log(data);
  });

    let AdminDisplay = this.state.admin?        
          <Link to="/cryptochans/Admin"><Button bsStyle="info">Admin</Button></Link>:null;

    return (
        <div>
          <Router basename={'/cryptochans/'}>
            <div className="App">
              <header>
                <img src={logo} className="App-logo" alt="logo.jpg" />
                <h1 className="App-title">Cryptochans</h1>
              </header>
              <div>
                <Link to="/"><Button  bsStyle="info">Main Page</Button></Link>
                &emsp;
                <Link to="/cryptochans/Marketplace"><Button  bsStyle="info">MarketPlace</Button></Link> 
                &emsp;
                <Link to="/cryptochans/MyChans"><Button bsStyle="info">My Chans</Button></Link>
                &emsp;
                {AdminDisplay}
        

                <Switch>
                  <Route path="/cryptochans/Admin" render={(props) => <Admin {...props} contract={this.state.saleClockAuctionInstance} contract2={this.state.chanCoreInstance} />} />
                  <Route path="/cryptochans/Mychans" render={(props) => <Mychans {...props} contract={this.state.chanCoreInstance} contract2={this.state.chanCoreInstance}/>} />
                  <Route path="/cryptochans/Marketplace" render={(props) => <BuyNewChan {...props} />} />
                  <Route path="/cryptochans/:id" render={(props) => <ChanDetails {...props} contract={this.state.chanCoreInstance} contract2={this.state.saleClockAuctionInstance}/>} />
                  <Route path="/" render={(props)=>
                    <Grid>
                      <Col xs={14} md={20}>
                        <Row xs={10} md={10}>
                          <Carousel>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.wxcha.com/file/201711/28/0ba7b1180e.jpg?down" />
                              <Carousel.Caption>
                                <h3>Cryptochans</h3>
                              </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg" />
                              <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>Cryptochans</p>
                              </Carousel.Caption>
                            </Carousel.Item>
                          </Carousel>
                        </Row>
                      </Col>
                    </Grid>
                  }/>
                </Switch>
              </div>
            </div>
          </Router>
        </div>

    );
  }
}
export default App