import React from 'react';
import getWeb3 from '../../utils/getWeb3'


import ChanCoreContract from '../../../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../../../node_modules/cryptochans/build/contracts/SaleClockAuction.json'

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {DropdownButton, MenuItem, Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class BuyNewChan extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
        admin: false,
        sort:"Sort By Name",
        displayonly:"Display All"
       }

       this.sort=1;
       this.displayonly=3;

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

              // if(isOnAuction){
              //   const chan = {};
              //   self.ChanCoreContract.getChan(id).then( chanData => {
              //   console.log(id);
              //     chan.id = id;
              //     chan.name = chanData[0];
              //     chan.create_time = chanData[1].c[0];
              //     chan.level = chanData[2].c[0];
              //     chan.gender = chanData[3] ? "female" : "male";
              //     chan.url = "https://s3.amazonaws.com/cryptochans/" + id + ".jpg";
              //   }).then( () => {
              //     console.log(chan);
              //     self.SaleAuctionCoreContract.getAuction(i).then( auctionData => {
              //       chan.seller           = auctionData[0];
              //       chan.starting_price   = auctionData[1];
              //       chan.ending_price     = auctionData[2];
              //       chan.auction_duration = auctionData[3];
              //       chan.started_at       = auctionData[4];
              //     });
              //   }).then( () => {
              //     self.SaleAuctionCoreContract.getCurrentPrice(i).then( price => {
              //       chan.current_price = price/1000000000000000+" (milliETH)";
              //       console.log(chan);
              //     self.setState({chan_data:self.state.chan_data.concat([chan])});
              //     });
              //   });
              // }
            });
          }
        });
      });
    });

  }


    buy(chan_id){
        console.log(chan_id);
        self = this;
        // if(!self.checkDBOnAuction(chan_id)){
        //   alert("Someone bought this before you! Good luck next time!");
        //   return;
        // }
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
              }).then(result=>{
                //change owner in db, set aution to be 0
                console.log('here');
                fetch('/api/buychan', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id:chan_id, owner: this.state.account}),
                  }) 

                alert("successful, you may need to wait for a while before the chan appear in MyChans");
                //refresh page
                self.fetch_data_from_db();
              });
            });
          }
          else{
            alert("The chan is not on auction!");
          }
        });
    }

    cancelAuction(chan_id){
        console.log(chan_id);
        self=this;
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
            }).then(result=>{
              fetch('/api/buychan', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id:chan_id, owner: this.state.account}),
                  });
              alert("successful, you may need to wait for a while before the chan appear in MyChans");
              self.fetch_data_from_db();
            });
          }
          else{
            alert("sorry! It's been bought!");
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

        self.setState({chan_data:[]});
        self.fetch_data_from_db();



        // self.setState({chan_data:data});


    }



    fetch_data_from_db(){
      console.log("alice", this.sort, this.displayonly, this.state.account);
        fetch('/api/auctions/'+this.sort+'/'+this.displayonly+ '/'+this.state.account)
        .then(function(response) {
            return response.json();
        }).then(result=>{
          self.setState({chan_data:result});
        })


        // fetch('/api/test')
        // .then(function(response) {
        //     return response.json();
        // }).then(function(data){
        //   console.log(data);
        // });

    }


    // checkDBOnAuction(chan_id){
    //   console.log(chan_id,'????');
    //    fetch('/api/chan_info/:'+chan_id)
    //     .then(function(response) {
    //       console.log('here');
    //         return response.json();
    //     }).then(function(data){
    //       console.log(data,'successfully get chan detail');
    //       return (data[0].auction==1);
    //     });
    // }

  onSelect(eventKey){
    console.log(eventKey,typeof(eventKey));
    const key = parseInt(eventKey);


    switch(key) {
    case 1:
        this.setState({sort:"Sort By Name"});
        this.sort=1;
        break;
    case 2:
        this.setState({sort:"Sort By Id"});
        this.sort=2;
        break;
    case 3:
        this.setState({displayonly:"Female Only"});
        this.displayonly=3;
        break;
    case 4:
        this.setState({displayonly:"Male Only"});
        this.displayonly=4;
        break;
    case 5:
        this.setState({displayonly:"My Chans Only"});
        this.displayonly=5;
        break;
    case 6:
        this.setState({displayonly:"Display All"});
        this.displayonly=6;
        break;
    default:
        console.log("error");
}

    this.fetch_data_from_db();

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
            <div>

            <DropdownButton
              title={this.state.sort}
            >
              <MenuItem header>Sort</MenuItem>
              <MenuItem eventKey="1" onSelect={this.onSelect.bind(this)}>Sort By Name</MenuItem>
              <MenuItem eventKey="2" onSelect={this.onSelect.bind(this)}>Sort By Id</MenuItem>
            </DropdownButton>
            &emsp;
            &emsp;



            <DropdownButton
              title={this.state.displayonly}
            >
              <MenuItem header>Display Only</MenuItem>
              <MenuItem eventKey="3" onSelect={this.onSelect.bind(this)}>Female</MenuItem>
              <MenuItem eventKey="4" onSelect={this.onSelect.bind(this)}>Male</MenuItem>
              <MenuItem eventKey="5" onSelect={this.onSelect.bind(this)}>My Chans</MenuItem>
              <MenuItem eventKey="6" onSelect={this.onSelect.bind(this)}>Display All</MenuItem>
            </DropdownButton>





            </div>

            </Row>
            <Row>
              {this.state.chan_data.map(function(d, idx){
                return (<Col xs={6} md={4}>
                  <Thumbnail src={d.url} alt="Image not available">
                  <h3>Name:{d.name}</h3>
                  <p>Id:{d.id}</p>
                  <p>Gender:{d.gender}</p>
                  <p>Level:{d.level}</p>
                  <p>Price:{d.start}</p>
                  <p>Birth Date:{d.birthday}</p>
                  <p>
                    {(d.owner === account) ? 

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
