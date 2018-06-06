import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';

import getWeb3 from '../../utils/getWeb3'
import {Glyphicon,Button, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';


import ChanCoreContract from '../../../node_modules/cryptochans/build/contracts/ChanCore.json'
import SaleClockAuctionContract from '../../../node_modules/cryptochans/build/contracts/SaleClockAuction.json'

export default class Mychans extends React.Component {
    constructor(props) {
    super(props)

    this.state = {
      chan_data:[],
      loading:false

    }

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

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
          console.log(accounts[0],"I am owner");
          this.setState({account:accounts[0]});
          self.ChanCoreContract.tokensOfOwner(accounts[0]).then(result=>{
            if (result.length==0){
            alert("You don't have any Chans, You will be redirected to Marketplace");
            window.location="/cryptochans/cryptochans/Marketplace"
            }
            else{
          const chanIdList=result;
        self.setState({chan_data:[]});
        for (var i = chanIdList.length - 1; i >= 0; i--) {
            const id = chanIdList[i].c[0];
            self.ChanCoreContract.getChan(id).then(result=> { 
            var cur_chan={"id":id};
            cur_chan.create_time = result[1].c[0];
            cur_chan.name = result[0];
            cur_chan.level = result[2].c[0];
            cur_chan.gender = result[3]?"female":"male";
            cur_chan.maxLevel= (result[3].c[0] + 1) * 10;
            cur_chan.url = "https://s3.amazonaws.com/cryptochans/"+(id)+".jpg";
            self.setState({chan_data:self.state.chan_data.concat([cur_chan])});
          });
        }
      }




          });
        })
      }








      );
    });

  }



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

        self.setState({chan_data:[]});



    }





    // componentWillMount() {
    //     const { match, contract1, contract2} = this.props;
    //     // const selectedId = match.params.id;
    //     console.log(contract2);
    //     this.ChanCoreContract = contract2;
    //     this.SaleAuctionCoreContract = contract1;

    //     // const myChans = this.cryptotreesContract.getMyChans();
    //     const i1 ="https://s3.amazonaws.com/cryptochans/1.jpg";
    //     const i2="https://s3.amazonaws.com/cryptochans/2.jpg";
    //     const i3="https://s3.amazonaws.com/cryptochans/3.jpg";



    //     getWeb3
    //   .then(results => {
    //     this.setState({
    //       web3: results.web3
    //     })

    //     const self = this;

    //     // Get accounts.
    //     results.web3.eth.getAccounts((error, accounts) => {
    //       console.log(accounts[0],"I am owner");
    //       this.setState({account:accounts[0]});
    //       self.ChanCoreContract.tokensOfOwner(accounts[0]).then(result=>{
    //         console.log("???",result);
    //         if (result.length==0){
    //         alert("You don't have any Chans");
    //         }
    //         else{
    //       const chanIdList=result;
    //     self.setState({chan_data:[]});



    //     for (var i = chanIdList.length - 1; i >= 0; i--) {
    //         const id = chanIdList[i].c[0];
    //         self.ChanCoreContract.getChan(id).then(result=> {
    //         console.log(result); 
    //         var cur_chan={"id":id};
    //         cur_chan.create_time = result[1].c[0];
    //         cur_chan.name = result[0];
    //         cur_chan.level = result[2].c[0];
    //         cur_chan.gender = result[3]?"female":"male";
    //         console.log(id,typeof(id));
    //         cur_chan.url = "https://s3.amazonaws.com/cryptochans/"+(id)+".jpg";
    //         console.log(cur_chan.url);
    //         self.setState({chan_data:self.state.chan_data.concat([cur_chan])});
    //       });
    //     }
    //   }




    //       });
    //     })
    //   }).catch(() => {
    //     console.log('Error finding web3.')
    //   })

    //     // function tokensOfOwner(address _owner) 
    //     // this.setState({chan_data:[{"id":0,"url":i1, "name":"Alice"},{"id":1,"url":i2,"name":"Holly"},{"id":2,"url":i3, "name":"Bella"}]});
    // }


      startBonding(){
    this.ChanCoreContract.bondWith.sendTransaction(
      this.state.bondingChanId1,
      this.state.bondingChanId2,
      {from:this.state.account}).then(result=> {


          this.SaleAuctionCoreContract.allEvents( { filter: {fromBlock: 0, toBlock: 'latest', address: result} },async function(error, log){
  if (!error){
    await console.log(log,'transaction complete');
    alert("Transaction successful submitted, you may need to wait for a while before the chan appears in MyChans");
  }
  else{
    alert("Transaction failed!");
  }
});



      }).catch(()=>{
        alert("Shokan fail");
      })
  }

  handleBondingChan1Change(event){
    this.setState({bondingChanId1: event.target.value});
  }

  handleBondingChan2Change(event){
    this.setState({bondingChanId2: event.target.value});
  }


  render() {

    const bstyle={
        'background-color':'pink'
    };

    const tstyle={
      'box-shadow':'0px 0px 8px #000'
    }





    return (
<div>
    <h1>{this.contract2}</h1>
    <div>




        <Grid>



        <Col xs={8} md={8}>
            <Row>
                {this.state.chan_data.map(function(d, idx){
                return (
                <Col xs={6} md={4}>
                <Link to={"/cryptochans/" + d.id.toString()}>
                <Thumbnail src={d.url} alt="242x200" style={tstyle}>
                    <h3>Name:{d.name}</h3>
                    <p>Chan:{d.id}</p>
                    <p>Gender:{d.gender}</p>
                    <p>Level:{d.level}/{d.maxLevel}</p>
                </Thumbnail>
                </Link> 
                </Col>)
                })}
            </Row>
            </Col>
                    <Col xs={6} md={4}>
            <div>
          <span>Bond 2 Chans</span>
          <br/>
          <input placeholder="First Chan ID" id="bondingChanId1" type="text" onChange={this.handleBondingChan1Change.bind(this)}></input>
          <input placeholder="Second Chan ID" id="bondingChanId2" type="text" onChange={this.handleBondingChan2Change.bind(this)}></input>
          <br/>
          <Button style={bstyle} id="startBonding" onClick={this.startBonding.bind(this)}>
            Bond and Shokan
            <Glyphicon glyph="heart" />
          </Button>
        </div>
        </Col>
        </Grid>
    </div>
</div>
    )
  }
}
