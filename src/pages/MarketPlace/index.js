import React from 'react';
import getWeb3 from '../../utils/getWeb3'

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class BuyNewChan extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
         admin: false,
         web3: null
       }

       // this.initialize();

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
              console.log("Starting Price: "+result[1]/1000000000000000+" finney (milliETH)");
              console.log("Ending Price: "+result[2]/1000000000000000+" finney (milliETH)");
              console.log("Duration: "+result[3]/3600 + " hours");
              console.log("Started At: "+result[4]);
            });
            this.SaleAuctionCoreContract.getCurrentPrice(chan_id).then(result=> {console.log("Price:"+result/1000000000000000+" finney (milliETH)");});
            this.SaleAuctionCoreContract.bid.sendTransaction(chan_id,{from:this.state.account});
          }
        });
    }

    // initialize(){
    componentWillMount() {

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
        console.log(contract2);
        this.ChanCoreContract = contract2;
        this.SaleAuctionCoreContract = contract;

        const i1 ="https://s3.amazonaws.com/cryptochans/1.jpg"
        const i2="https://s3.amazonaws.com/cryptochans/2.jpg"
        const i3="https://s3.amazonaws.com/cryptochans/3.jpg";
        // this.ChanCoreContract.().then(result=>{
        //     this.setState({chanlist:result});
        // });


        const self = this;



        self.setState({fake_data:[]});




         this.ChanCoreContract.totalSupply().then(totalChans => {
            console.log('uysfsiofsdfsfsf',totalChans);
          for(const i = 0; i < totalChans+1; i++){

            const id=i;
            this.SaleAuctionCoreContract.isOnAuction(id).then( isOnAuction => {
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
                  this.SaleAuctionCoreContract.getAuction(i).then( auctionData => {
                    chan.seller           = auctionData[0];
                    chan.starting_price   = auctionData[1];
                    chan.ending_price     = auctionData[2];
                    chan.auction_duration = auctionData[3];
                    chan.started_at       = auctionData[4];
                  });
                }).then( () => {
                  this.SaleAuctionCoreContract.getCurrentPrice(i).then( price => {
                    chan.current_price = price/1000000000000000+" finney (milliETH)";
                    console.log(chan);
                  self.setState({fake_data:self.state.fake_data.concat([chan])});
                  });
                });
              }
            });
          }
        });


    }


  render() {
    const buy_func = this.buy.bind(this);


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
           <Button bsStyle="primary" onClick={buy_func.bind(null,d.id)}>
        Buy!
        </Button>
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