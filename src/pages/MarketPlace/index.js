import React from 'react';
import getWeb3 from '../../utils/getWeb3'


import ChanCoreContract from '../../../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../../../node_modules/cryptochans/build/contracts/SaleClockAuction.json'

import { FadeLoader } from 'react-spinners';


// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import { Glyphicon,Button,  Grid, Row, Col, Thumbnail} from 'react-bootstrap';

export default class BuyNewChan extends React.Component {
    constructor(props) {
       super(props)

       this.state = {
        admin: false,
        loading:false,
        chan_data:[]
       }

    }



    instantiateContract() {
      console.log('once?');
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


    chanCore.deployed().then(async (instance) => {
        console.log("successfully deployed ChanCore");
        // this.setState({ChanCoreContract : instance});
        self.ChanCoreContract=await instance;
      }).then(()=>{
        saleClockAuction.deployed().then(async (instance) => {
        console.log("successfully deployed SaleClockAuction");
        self.SaleAuctionCoreContract=await instance;





                 self.ChanCoreContract.totalSupply().then(totalChans => {
            totalChans = totalChans.c[0];
          for(const i = 0; i < totalChans+1; i++){

            const id=i;
            self.SaleAuctionCoreContract.isOnAuction(id).then( isOnAuction => {

              if(isOnAuction){
                const chan = {};
                self.ChanCoreContract.getChan(id).then( chanData => {
                  chan.id = id;
                  chan.name = chanData[0];
                  chan.create_time = chanData[1].c[0];
                  chan.level = chanData[2].toNumber();
                  chan.gender = chanData[4] ? "female" : "male";
                  chan.url = "https://s3.amazonaws.com/cryptochans/" + id + ".jpg";
                  chan.maxLevel= (chanData[3].toNumber() + 1) * 10;
                }).then( () => {
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
                  self.setState({chan_data:self.state.chan_data.concat([chan])});
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
      this.setState({loading:true});
        console.log('buy:',chan_id);
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

                console.log(result);
                alert("Transaction successful submitted, wait for a while for the transaction to go through");
                this.SaleAuctionCoreContract.AuctionSuccessful({filter:{ fromBlock: 0 , toBlock: 'latest', address: result}}).watch(async function(error, log){
                  if (!error){
                    await console.log(log,'transaction complete');
                    if(log.args.winner==self.state.account){
                      alert('Congrats! You got the chan! Wait for a while before you can see your chan in MyChans');
                    }
                    else{
                      alert('Sad news...Someone else got the chan before you!');
                    }

                    self.setState({loading:false});
                    console.log(log.args.tokenId.c[0],'work?');
                    self.setState({chan_data: []});
                    self.instantiateContract();
                  } else {
                    alert("Transaction failed!");
                    self.setState({loading:false});
                  }
                });
              }).catch(()=>{
                alert("Transaction failed!");
    self.setState({loading:false});
                
              })
            });
          }
          else{
            alert("The chan is not on auction!");
            self.setState({loading:false});
          }
        });
    }

    cancelAuction(chan_id){
      this.setState({loading:true});

        console.log('cancel:',chan_id);
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
              console.log(result,'addr???????');

              alert("Transaction successful submitted, wait for a while for the transaction to go through");
              this.SaleAuctionCoreContract.AuctionCancelled( { filter: {fromBlock: 0, toBlock: 'latest', address: result} }).watch(async function(error, log){
                if (!error){
                  alert('Congrats! You got the chan! Wait for a while before you can see your chan in MyChans');


                  await console.log(log,'transaction complete!');
                  self.setState({loading:false});
                  self.setState({chan_data: []});
                  self.instantiateContract();
                } else {
                  alert("Transaction fails! ");
                  self.setState({loading:false});
                }
              });
              // fetch('/api/buychan', {
              //       method: 'POST',
              //       headers: {
              //         'Content-Type': 'application/json'
              //       },
              //       body: JSON.stringify({id:chan_id, owner: this.state.account}),
              //     });
              
              // self.fetch_data_from_db();
            }).catch(()=>{
              alert("Transaction fails! ");
              self.setState({loading:false});
            })
          }
          else{
            alert("sorry! It's been bought!");
            self.setState({loading:false});
          }
        });
    }

    // initialize(){
    componentWillMount() {


                getWeb3
        .then(async results => {
          this.setState({
            web3: results.web3
          });
          // Get accounts.
          results.web3.eth.getAccounts((error, accounts) => {
            this.setState({account:accounts[0]});
          });

          await this.instantiateContract();  
     
        })


    }



    // fetch_data_from_db(){
    //   console.log("alice", this.sort, this.displayonly, this.state.account);
    //     fetch('/api/auctions/'+this.sort+'/'+this.displayonly+ '/'+this.state.account)
    //     .then(function(response) {
    //         return response.json();
    //     }).then(result=>{
    //       self.setState({chan_data:result});
    //     })


        // fetch('/api/test')
        // .then(function(response) {
        //     return response.json();
        // }).then(function(data){
        //   console.log(data);
        // });

    // }


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

//   onSelect(eventKey){
//     console.log(eventKey,typeof(eventKey));
//     const key = parseInt(eventKey);


//     switch(key) {
//     case 1:
//         this.setState({sort:"Sort By Name"});
//         this.sort=1;
//         break;
//     case 2:
//         this.setState({sort:"Sort By Id"});
//         this.sort=2;
//         break;
//     case 3:
//         this.setState({displayonly:"Female Only"});
//         this.displayonly=3;
//         break;
//     case 4:
//         this.setState({displayonly:"Male Only"});
//         this.displayonly=4;
//         break;
//     case 5:
//         this.setState({displayonly:"My Chans Only"});
//         this.displayonly=5;
//         break;
//     case 6:
//         this.setState({displayonly:"Display All"});
//         this.displayonly=6;
//         break;
//     default:
//         console.log("error");
// }

//     this.fetch_data_from_db();

//   }


  render() {
    const buy_func = this.buy.bind(this);
    const cancel_func = this.cancelAuction.bind(this);
    const account = this.state.account;

    const tstyle={
      'box-shadow':'0px 0px 10px #000'
    }

     const bstyle={
        'background-color':'pink'
    };





    return (
      <div>
        <h1>{this.contract2}</h1>


        <div className='sweet-loading' style={{display: 'flex', justifyContent: 'center'}}>
        <FadeLoader
          color={'#123abc'} 
          loading={this.state.loading} 
        >
        Transaction pending...
        </FadeLoader>
      </div>



        <div>



          <Grid>
            <Row>
              {this.state.chan_data.map(function(d, idx){
                return (<Col xs={6} md={4}>
                  <Thumbnail src={d.url} alt="Image not available" style={tstyle}>
                  <h3>Name:{d.name}</h3>
                  <p>Id:{d.id}</p>
                  <p>Gender:{d.gender}</p>
                  <p>Level:{d.level}/{d.maxLevel}</p>
                  <p>Price:{d.current_price}</p>
                  <p>
                    {(d.seller === account) ? 
                        <Button style={bstyle} onClick={cancel_func.bind(null,d.id)}>
                          Take me back home
                          <Glyphicon glyph="heart" />
                        </Button>
                        :
                        <Button style={bstyle} onClick={buy_func.bind(null,d.id)}>
                          Take me home
                          <Glyphicon glyph="heart" />
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
