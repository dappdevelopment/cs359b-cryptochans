import React from 'react';

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel} from 'react-bootstrap';

export default class BuyNewChan extends React.Component {
  //   constructor(props) {
  //   super(props)

  //   this.state = {
  //     admin: false,
  //     web3: null
  //   }

  // }

    buy(chan_id){
        console.log("bought");
        console.log(chan_id);
        this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log(result,typeof(result)); const owner = result });
    }


  render() {
        const { match, contract1, contract2} = this.props;
        // const selectedId = match.params.id;
        console.log(contract2);
        this.ChanCoreContract = contract2;
        this.SaleAuctionCoreContract = contract1;

        // const myChans = this.cryptotreesContract.getMyChans();
        const i1 ="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg"
        const i2="http://img.wxcha.com/file/201711/28/0ba7b1180e.jpg?down"
        const fake_data =[{"url":i1},{"url":i2}];
        const buy_func = this.buy.bind(this);


    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
      {fake_data.map(function(d, idx){
        console.log(buy_func);
         return (<li><img height="200" width="200" src={d.url} key={idx}/>
          <button id="withdraw" onClick={buy_func.bind(null,idx)}>
        Buy!
        </button>


         </li>)
       })}
      </div>
      </div>
    )
  }
}
