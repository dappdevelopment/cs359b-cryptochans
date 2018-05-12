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

    }

    buy(chan_id){
        console.log("bought");
        console.log(chan_id);
        //auction.seller,
        //    auction.startingPrice,
        //    auction.endingPrice,
        //    auction.duration,
        //    auction.startedAt
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
          } else {
            console.log("Not on Auction");
          }
        });  
        this.SaleAuctionCoreContract.getCurrentPrice(chan_id).then(result=> {console.log("Price:"+result);});
        this.SaleAuctionCoreContract.bid.sendTransaction(chan_id,{from:this.state.account});
    }


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
        // const selectedId = match.params.id;
        console.log(contract2);
        this.ChanCoreContract = contract2;
        this.SaleAuctionCoreContract = contract;

        // const myChans = this.cryptotreesContract.getMyChans();
        const i1 ="https://s3.amazonaws.com/cryptochans/01.jpg"
        const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
        const i3="https://s3.amazonaws.com/cryptochans/01.jpg";
        // this.ChanCoreContract.().then(result=>{
        //     this.setState({chanlist:result});
        // });



        this.setState({fake_data:[{"url":i1, "name":"Alice"},{"url":i2,"name":"Holly"},{"url":i3, "name":"Bella"}]});
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
      <Thumbnail src={d.url} alt="242x200">
        <h3>Chan:{idx}</h3>
        <p>Name:{d.name}</p>
        <p>
           <Button bsStyle="primary" id="withdraw" onClick={buy_func.bind(null,idx)}>
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
