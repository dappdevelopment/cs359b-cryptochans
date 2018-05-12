import React from 'react';

// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';


import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Mychans extends React.Component {
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
                const i1 ="https://s3.amazonaws.com/cryptochans/01.jpg"
        const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
        const fake_data =[{"url":i1},{"url":i2}];
        const buy_func = this.buy.bind(this);


    return (
      <div>
        <h1>{this.contract2}</h1>
        <div>
        <Grid>
  <Row>
      {fake_data.map(function(d, idx){
        console.log(buy_func);
         return (<Col xs={6} md={4}>
      <Thumbnail src={d.url} alt="242x200">
        <h3>Chan</h3>
        <p>Chan Details//Todo</p>
        <p>
           <Button id="withdraw" onClick={buy_func.bind(null,idx)}>
        Buy!
        </Button>
          <Button bsStyle="default">Button</Button>
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
