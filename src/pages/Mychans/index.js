import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';
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


    componentWillMount() {
        const { match, contract1, contract2} = this.props;
        // const selectedId = match.params.id;
        console.log(contract2);
        this.ChanCoreContract = contract2;
        this.SaleAuctionCoreContract = contract1;

        // const myChans = this.cryptotreesContract.getMyChans();
        const i1 ="https://s3.amazonaws.com/cryptochans/01.jpg"
        const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
        // this.ChanCoreContract.().then(result=>{
        //     this.setState({chanlist:result});
        // });
        this.setState({fake_data:[{"id":0,"url":i1, "name":"Alice"},{"id":1,"url":i2,"name":"Holly"}]});
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
         <Link to={"/cryptochans/" + d.id.toString()}>
      <Thumbnail src={d.url} alt="242x200">
        <h3>Chan:{idx}</h3>
        <p>Name:{d.name}</p>

        <p>
        Gender

        </p>
      </Thumbnail>
      </Link> 
    </Col>)
       })}
         </Row>
</Grid>
      </div>





      </div>
    )
  }
}
