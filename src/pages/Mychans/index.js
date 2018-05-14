import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from 'react-router-dom';
// import Card from 'material-ui/Card';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';

import getWeb3 from '../../utils/getWeb3'
import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class Mychans extends React.Component {
    constructor(props) {
    super(props)

    this.state = {
      fake_data:[]

    }

  }

    componentWillMount() {
        const { match, contract1, contract2} = this.props;
        // const selectedId = match.params.id;
        console.log(contract2);
        this.ChanCoreContract = contract2;
        this.SaleAuctionCoreContract = contract1;

        // const myChans = this.cryptotreesContract.getMyChans();
        const i1 ="https://s3.amazonaws.com/cryptochans/1.jpg";
        const i2="https://s3.amazonaws.com/cryptochans/2.jpg";
        const i3="https://s3.amazonaws.com/cryptochans/3.jpg";



        getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        const self = this;

        // Get accounts.
        results.web3.eth.getAccounts((error, accounts) => {
          console.log(accounts[0],"I am owner");
          this.setState({account:accounts[0]});
          self.ChanCoreContract.tokensOfOwner(accounts[0]).then(result=>{
            console.log("???",result);
            if (result.length==0){
              console.log("you have no chans");
            }
            else{
          const chanIdList=result;
        self.setState({fake_data:[]});



        for (var i = chanIdList.length - 1; i >= 0; i--) {
            const id = chanIdList[i].c[0];
            self.ChanCoreContract.getChan(id).then(result=> {
            console.log(result); 
            var cur_chan={"id":id};
            cur_chan.create_time = result[1].c[0];
            cur_chan.name = result[0];
            cur_chan.level = result[2].c[0];
            cur_chan.gender = result[3]?"female":"male";
            console.log(id,typeof(id));
            cur_chan.url = "https://s3.amazonaws.com/cryptochans/"+(id)+".jpg";
            console.log(cur_chan.url);
            self.setState({fake_data:self.state.fake_data.concat([cur_chan])});
          });
        }
      }




          });
        })
      }).catch(() => {
        console.log('Error finding web3.')
      })

        // function tokensOfOwner(address _owner) 
        // this.setState({fake_data:[{"id":0,"url":i1, "name":"Alice"},{"id":1,"url":i2,"name":"Holly"},{"id":2,"url":i3, "name":"Bella"}]});
    }


  render() {



    return (
<div>
    <h1>{this.contract2}</h1>
    <div>
        <Grid>
            <Row>
                {this.state.fake_data.map(function(d, idx){
                return (
                <Col xs={6} md={4}>
                <Link to={"/cryptochans/" + d.id.toString()}>
                <Thumbnail src={d.url} alt="242x200">
                    <h3>Chan:{d.id}</h3>
                    <p>Name:{d.name}</p>
                    <p>Gender:{d.gender}</p>
                    <p>Level:{d.level}</p>
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
