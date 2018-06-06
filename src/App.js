import React, { Component } from 'react'
import ChanCoreContract from '../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../node_modules/cryptochans/build/contracts/SaleClockAuction.json'
import getWeb3 from './utils/getWeb3'

import logo from './logo.jpg'

import {Alert,Button,Carousel, Grid,Col, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';



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
      web3: null,
      hasAlert:false,
      account: 'Not Logged In'
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
      alert("Error finding web3");
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
    // console.log(this.state.web3.currentProvider);


      this.state.web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          this.setState({eth_detect:true});
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          this.setState({eth_detect:false});
          break
        case "3":
          console.log('This is the ropsten test network.')
          this.setState({eth_detect:false});
          break
        case "4":
          this.setState({eth_detect:true});
          console.log('This is the Rinkeby test network.')
          break
        case "42":
          console.log('This is the Kovan test network.')
          this.setState({eth_detect:false});
          break
        default:
          console.log('This is an unknown network.')
          this.setState({eth_detect:true});
      }
    })

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log({userAccount: accounts[0]});
      if (accounts[0]) { this.setState({account:accounts[0]});}
     

      chanCore.deployed().then((instance) => {
        console.log("successfully deployed ChanCore");
        console.log(instance);
        this.setState({chanCoreInstance : instance});

        // instance.getChan(0).then(result=> {console.log("Chan #0: " + result); });
        // instance.ownerOf(0).then(result=> {console.log("Owner of Chan #0: " + result); });
        // instance.saleAuction().then(result => {console.log("Sale Auction Address: " + result); });

        instance.owner().then(result=> {
          console.log("Contract Owner: " + result);
          console.log("Current Account: " + this.state.account);
          console.log("IsOwner: " + (result===this.state.account));
          this.setState({admin:result===this.state.account});
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

  //this is for get
  // fetch('/api/test')
  // .then(function(response) {
  //     return response.json();
  // }).then(function(data){
  //   console.log(data);
  // });

  // const chanid=18;

  // fetch('/api/chan_info', {
  //                   method: 'POST',
  //                   headers: {
  //                     'Content-Type': 'application/json'
  //                   },
  //                   body: JSON.stringify({id:chanid}),
  //                 }).then(function(response) {
  //                       return response.json();
  //                   }).then(function(data){
  //                     console.log(data);
  //                   });


  

    let AdminDisplay = this.state.admin?        
          <Link to="/cryptochans/Admin"><Button bsStyle="info">Admin</Button></Link>:null;

    const pStyle = {
      'color': '#f4428c'
    };

    const iStyle={
      'width':'30px',
      'height':'30px'
    };

    let eth_detect = this.state.eth_detect?"./on.png":"./off.png";

    var any_alert = this.state.eth_detect?null:<Alert bsStyle="warning">
  <strong>Please use the correct network!(Rinkeby)</strong></Alert>;

    return (

        <div>
        <div>
      {any_alert}
      </div>
        <img style={iStyle} src={require(eth_detect)} alt="img not available"></img>
        <span style={pStyle} >Account Address: {this.state.account}</span>
        
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
                                <p>Buy and Sell your Chans to earn money!</p>
                              </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                              <img width={900} height={500} alt="900x500" src="https://vthumb.ykimg.com/054101015AEDA4148B7B44A5F0C8581E" />
                              <Carousel.Caption>
                                <h3>Cryptochans</h3>
                                <p>Interact with your Chans!</p>
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