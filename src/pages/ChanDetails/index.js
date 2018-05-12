import React from 'react';

import Chat from './Chat.js';

// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail,Badge, Label, Well, Modal,Popover} from 'react-bootstrap';

export default class ChanDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };

  }


    sell(){
        console.log("bought");
        // console.log(this.state.selectedId);
        // console.log(this.SaleAuctionContract);
        // console.log(this.ChanCoreContract);
        console.log(this.ChanCoreContract.ownerOf(0).then(result=> {console.log(result); }));
        
        console.log(this.state.owner);
        this.SaleAuctionContract.createAuction.sendTransaction(10,1,10,this.state.owner,{from:this.state.account});




    //      function createSaleAuction(
    //     uint256 _chanId,
    //     uint256 _startingPrice,
    //     uint256 _endingPrice,
    //     uint256 _duration
    // )
        //this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log(result,typeof(result)); const owner = result });
    }
  
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.


      const { match, contract,contract2} = this.props;
      const selectedId = match.params.id;
      console.log(selectedId,'id?');
      console.log(contract,'contract?');
      

      this.ChanCoreContract = contract;
      this.SaleAuctionContract = contract2;
      this.ChanCoreContract.getChan(selectedId).then(result=> {console.log(result); console.log("heyyyyyyyyyyyyy", this); this.setState({name:result[0]}); this.setState({create_time:result[1]});this.setState({level:result[2]});this.setState({gender:result?"female":"male"});});

     const i1="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg";
      // const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
      const sell_func = this.sell.bind(this);
      // console.log(this.state.value);

      this.setState({selectedId:selectedId});
      this.setState({fake_img:i1});

  }


  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }



  render() {
        const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );

        // let startDate = new Date();
        // let elapsedTime = 0;

        // const focus = function() {
        //     startDate = new Date();
        // };

        // const blur = function() {
        //     const endDate = new Date();
        //     const spentTime = endDate.getTime() - startDate.getTime();
        //     elapsedTime += spentTime;
        //     console.log(elapsedTime);
        // };

        // const beforeunload = function() {
        //     const endDate = new Date();
        //     const spentTime = endDate.getTime() - startDate.getTime();
        //     elapsedTime += spentTime;
        //     console.log(elapsedTime);

        //     // elapsedTime contains the time spent on page in milliseconds
        // };

        // window.addEventListener('focus', focus);
        // window.addEventListener('blur', blur);
        // window.addEventListener('beforeunload', beforeunload);

    return (

      <div>

         <h1>Cryptochan<Badge>{this.state.selectedId}</Badge> Name:{this.state.name}</h1>

        <div>



      <Grid>
      <Row>
      <Col xs={9} md={16}>

    <Image style={{width: 800, height: 400}} src={this.state.fake_img} atl="800x800">

    </Image>
    </Col>
    <Col>
        <p>gender:{this.state.gender}</p>



        <Button bsStype="primary" onClick={this.sell.bind(this)}>
        Sell
        </Button>
        <br/>



        <Button bsStyle="primary" onClick={this.handleShow.bind(this)}>
          Chat with me
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Chat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Chat/>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>








    </Col>
    </Row>
    </Grid>
    </div>
    </div>

    )
  }
}