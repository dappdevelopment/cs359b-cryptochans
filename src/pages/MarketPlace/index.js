import React from 'react';
import getWeb3 from '../../utils/getWeb3'


import ChanCoreContract from '../../../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../../../node_modules/cryptochans/build/contracts/SaleClockAuction.json'

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class BuyNewChan extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
         admin: false,
       }

       // this.initialize();

    }



    instantiateContract() {
    self= this;
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

    chanCore.deployed().then((instance) => {
        console.log("successfully deployed ChanCore");
        // this.setState({ChanCoreContract : instance});
        self.ChanCoreContract=instance;
      }).then(()=>{
        saleClockAuction.deployed().then((instance) => {
        // this.setState({SaleAuctionCoreContract:instance});
        self.SaleAuctionCoreContract = instance;
        console.log("successfully deployed SaleClockAuction");
                 self.ChanCoreContract.totalSupply().then(totalChans => {
            console.log('uysfsiofsdfsfsf',totalChans.c[0]);
            totalChans = totalChans.c[0];
          for(const i = 0; i < totalChans+1; i++){
            console.log(i);

            const id=i;
            self.SaleAuctionCoreContract.isOnAuction(id).then( isOnAuction => {
                console.log(id,isOnAuction);

              if(isOnAuction){
                const chan = {};
                self.ChanCoreContract.getChan(id).then( chanData => {
                console.log(id);
                  chan.id = id;
                  chan.name = chanData[0];
                  chan.create_time = chanData[1].c[0];
                  chan.level = chanData[2].c[0];
                  chan.gender = chanData[3] ? "female" : "male";
                  chan.url = "https://s3.amazonaws.com/cryptochans/" + id + ".jpg";
                }).then( () => {
                  console.log(chan);
                  self.SaleAuctionCoreContract.getAuction(i).then( auctionData => {
                    chan.seller           = auctionData[0];
                    chan.starting_price   = auctionData[1];
                    chan.ending_price     = auctionData[2];
                    chan.auction_duration = auctionData[3];
                    chan.started_at       = auctionData[4];
                  });
                }).then( () => {
                  self.SaleAuctionCoreContract.getCurrentPrice(i).then( price => {
                    chan.current_price = price/1000000000000000+" (milliETH)";
                    console.log(chan);
                  self.setState({fake_data:self.state.fake_data.concat([chan])});
                  });
                });
              }
            });
          }
        });
      });
    });

  }


    buy(chan_id){
        console.log(chan_id);
        this.ChanCoreContract.balanceOf(this.state.account).then(result=> {console.log("Account Balance:"+result);});
        this.ChanCoreContract.balanceOf(this.SaleAuctionCoreContract.address).then(result=> {console.log("Contract Balance:"+result);});
        this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log("Owner:"+result); const owner = result });
        this.SaleAuctionCoreContract.isOnAuction(chan_id).then(isOnAuction => {
          if(isOnAuction){
            this.SaleAuctionCoreContract.getAuction(chan_id).then(result => {
              console.log("Seller: "+result[0]);
              console.log("Starting Price: "+result[1]/1000000000000000+" (milliETH)");
              console.log("Ending Price: "+result[2]/1000000000000000+" (milliETH)");
              console.log("Duration: "+result[3]/3600 + " hours");
              console.log("Started At: "+result[4]);
            });
            this.SaleAuctionCoreContract.getCurrentPrice(chan_id).then(priceInWei => {
              console.log("Price:"+priceInWei/1000000000000000+" (milliETH)");
              this.SaleAuctionCoreContract.bid.sendTransaction(chan_id, {
                from:this.state.account,
                to:this.SaleAuctionCoreContract.address,
                value:priceInWei,
                gas:1000000
              });
            });
          }
        });
    }

    cancelAuction(chan_id){
        console.log(chan_id);
        this.ChanCoreContract.balanceOf(this.state.account).then(result=> {console.log("Account Balance:"+result);});
        this.ChanCoreContract.balanceOf(this.SaleAuctionCoreContract.address).then(result=> {console.log("Contract Balance:"+result);});
        this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log("Owner:"+result); const owner = result });
        this.SaleAuctionCoreContract.isOnAuction(chan_id).then(isOnAuction => {
          if(isOnAuction){
            this.SaleAuctionCoreContract.getAuction(chan_id).then(result => {
              console.log("Seller: "+result[0]);
              console.log("Starting Price: "+result[1]/1000000000000000+" (milliETH)");
              console.log("Ending Price: "+result[2]/1000000000000000+" (milliETH)");
              console.log("Duration: "+result[3]/3600 + " hours");
              console.log("Started At: "+result[4]);
            });
            this.SaleAuctionCoreContract.cancelAuction.sendTransaction(chan_id, {
                from:this.state.account,
                gas:1000000
            });
          }
        });
    }

    // initialize(){
    componentWillMount() {
        const self=this;

        getWeb3
        .then(results => {
          this.setState({
            web3: results.web3
          });
          // Get accounts.
          results.web3.eth.getAccounts((error, accounts) => {
            this.setState({account:accounts[0]});
          });

          this.instantiateContract();        
        })

        // const { match, contract, contract2} = this.props;
        // console.log(contract2);
        // this.ChanCoreContract = contract2;
        // this.SaleAuctionCoreContract = contract;

        self.setState({fake_data:[]});

    }


  render() {
    const buy_func = this.buy.bind(this);
    const cancel_func = this.cancelAuction.bind(this);
    const account = this.state.account;


    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
          <Grid>
            <Row>
              {this.state.fake_data.map(function(d, idx){
                return (<Col xs={6} md={4}>
                  <Thumbnail src={d.url} alt="Image not available">
                  <h3>Chan:{d.id}</h3>
                  <p>Name:{d.name}</p>
                  <p>Gender:{d.gender}</p>
                  <p>Level:{d.level}</p>
                  <p>Price:{d.current_price}</p>
                  <p>
                    {(d.seller === account) ? 

                        <Button bsStyle="primary" onClick={cancel_func.bind(null,d.id)}>
                          Cancel!
                        </Button>
                        :
                        <Button bsStyle="primary" onClick={buy_func.bind(null,d.id)}>
                          Buy!
                        </Button>
                    }
                  </p>
                  </Thumbnail>
                </Col>)
              })}
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}
