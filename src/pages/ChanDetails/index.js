import React from 'react';

// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail,Badge, Label, Well} from 'react-bootstrap';

export default class ChanDetails extends React.Component {

  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     admin: false
  //   }
  //   this.result =null;

  // }


    sell(chan_id){
        console.log("bought");
        console.log(chan_id);
        //this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log(result,typeof(result)); const owner = result });
    }
  
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.


      const { match, contract } = this.props;
      const selectedId = match.params.id;
      console.log(selectedId,'id?');
      console.log(contract,'contract?');
      contract.getChan(selectedId).then(result=> {console.log(result); this.setState({name:result[0]}); this.setState({create_time:result[1]});
this.setState({level:result[2]});
this.setState({gender:result?"female":"male"});
    });
      // const name = this.result[0];
      // const create_time = this.result[1];
      // const level = this.result[2];
      // const gender =this.result[3]?"female":"male";

     const i1="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg";
      // const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
      const sell_func = this.sell.bind(this);
      // console.log(this.state.value);

      this.setState({selectedId:selectedId});
      this.setState({fake_img:i1});

  }



  render() {
        let startDate = new Date();
        let elapsedTime = 0;

        const focus = function() {
            startDate = new Date();
        };

        const blur = function() {
            const endDate = new Date();
            const spentTime = endDate.getTime() - startDate.getTime();
            elapsedTime += spentTime;
            console.log(elapsedTime);
        };

        const beforeunload = function() {
            const endDate = new Date();
            const spentTime = endDate.getTime() - startDate.getTime();
            elapsedTime += spentTime;
            console.log(elapsedTime);

            // elapsedTime contains the time spent on page in milliseconds
        };

        window.addEventListener('focus', focus);
        window.addEventListener('blur', blur);
        window.addEventListener('beforeunload', beforeunload);

    return (

      <div>

         <h1>Cryptochan<Badge>{this.state.selectedId}</Badge> Name:{this.state.name}</h1>

        <div>




      <Col xs={10} md={20}>

    <Image style={{width: 800, height: 400}} src={this.state.fake_img} atl="800x800">

    </Image>
        <p>gender:{this.state.gender}</p>



        <Button id="withdraw" onClick={this.sell}>
        Buy!
        </Button>

    </Col>
    </div>
    </div>

    )
  }
}