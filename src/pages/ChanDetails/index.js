import React from 'react';

import Chat from './Chat.js';


import getWeb3 from '../../utils/getWeb3'
// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {ProgressBar, ButtonGroup,Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail,Badge, Label, Well, Modal,Popover} from 'react-bootstrap';

export default class ChanDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      intimacy:0

    };


     



  }

  refreshState(){
    console.log("here???");
    this.ChanCoreContract.getChan(this.state.selectedId).then(result=> {console.log("ooooooooo",result); console.log("heyyyyyyyyyyyyy", this); this.setState({name:result[0]}); this.setState({create_time:result[1].c[0]});this.setState({level:result[2].c[0]});this.setState({gender:result[3]?"female":"male"});console.log("yyyyyyy",this.state);});
  }


   levelup(){
    console.log("level up");
    this.ChanCoreContract.ChanLevelup.sendTransaction(this.state.selectedId,{from:this.state.account});
    this.refreshState();
   }


    sell(){
        console.log("bought");
        // console.log(this.state.selectedId);
        // console.log(this.SaleAuctionContract);
        // console.log(this.ChanCoreContract);
        console.log('ddddd',this.state.account);
        console.log(this.state.selectedId);
        this.SaleAuctionContract.createAuction.sendTransaction(this.state.selectedId,10,1,10,this.state.account,{from:this.state.account});




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
      this.ChanCoreContract.getChan(selectedId).then(result=> {console.log(result); 
        console.log("heyyyyyyyyyyyyy", this); this.setState({name:result[0]}); 
        this.setState({create_time:result[1].c[0]});this.setState({level:result[2].c[0]});
        this.setState({gender:result[3]?"female":"male"});
        console.log("yyyyyyy",this.state);
        this.setState({difficult_level:2000*(result[2].c[0]+1)});
      });

     //const i1="http://img.im17.com/upload/cimg/2012/09-26/CV4VR32635714142861850668.jpg";
      const i1="https://s3.amazonaws.com/cryptochans/0"+(parseInt(selectedId)+1).toString()+".jpg";
      console.log('iiiiiii',i1);
      const sell_func = this.sell.bind(this);
      // console.log(this.state.value);

      this.setState({selectedId:selectedId});
      this.setState({fake_img:i1});



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



      let startDate = new Date();
        let elapsedTime = 0;
        var valid=true;

        const focus = function() {
            startDate = new Date();
            valid = true;
        };

        console.log('state?????',this.state, this.state.level);
        const self=this;
        const blur = function() {
            const endDate = new Date();
            const spentTime = endDate.getTime() - startDate.getTime();
            elapsedTime += spentTime;
            console.log('now:',elapsedTime);
            self.setState({intimacy:(elapsedTime/self.state.difficult_level)});
            valid=false;
        };

        const beforeunload = function() {
            const endDate = new Date();
            const spentTime = endDate.getTime() - startDate.getTime();
            elapsedTime += spentTime;
            console.log('tttttime',elapsedTime);
            self.setState({intimacy:(elapsedTime/self.state.difficult_level)});
            valid=false;

            // elapsedTime contains the time spent on page in milliseconds
        };

        const refreshIntimacy = function(){
          if (valid) {
          const endDate = new Date();
          const spentTime = endDate.getTime() - startDate.getTime();
          elapsedTime += spentTime;
          self.setState({intimacy:(elapsedTime/self.state.difficult_level)});
          startDate = new Date();}
        };

        window.addEventListener('focus', focus);
        window.addEventListener('blur', blur);
        window.addEventListener('beforeunload', beforeunload);
        setInterval(refreshIntimacy,3000);

  }


  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }


  timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}



  render() {
        const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );

       
        var formatTime = this.timeConverter(this.state.create_time);

    return (

      <div>

         <h1>Cryptochan<Badge>{this.state.selectedId}</Badge> Name:{this.state.name}</h1>

        <div>



      <Grid>
      <Row>
      <Col xs={9} md={16}>

    <Image style={{width: 500, height: 400}} src={this.state.fake_img} atl="800x800">

    </Image>
    </Col>
    <Col>
        <p>Gender:{this.state.gender}</p>
        <p>Level:{this.state.level}</p>
        
        <p>Create Time:{formatTime}</p>     

        <ButtonGroup vertical>
        <Button onClick={this.sell.bind(this)}>
        Sell
        </Button>
        <br/>



        <Button  onClick={this.handleShow.bind(this)}>
          Chat with me
        </Button>
        <br/>
        Intimacy:<ProgressBar now={this.state.intimacy} label={`${this.state.intimacy}%`} />
        <Button  disabled={this.state.intimacy<100} onClick={this.levelup.bind(this)}>
          Level me up
        </Button>



        </ButtonGroup>

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