import React from 'react';

import Chat from './Chat.js';


import getWeb3 from '../../utils/getWeb3'
// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {InputGroup,Input,ProgressBar, ButtonGroup,Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail,Badge, Label, Well, Modal,Popover} from 'react-bootstrap';

export default class ChanDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      intimacy:0,
      fake_data:[]

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
        console.log("sell");
        this.ChanCoreContract.createSaleAuction.sendTransaction(
          this.state.selectedId,
          this.state.high,
          this.state.low,
          this.state.dur,
          {from:this.state.account}
        );
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
      const i1="https://s3.amazonaws.com/cryptochans/"+(parseInt(selectedId)).toString()+".jpg";
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


  handleSellClose() {
    this.setState({ sellshow: false });
  }

  handleSellShow() {
    this.setState({ sellshow: true });
  }


  handleLowPriceChange(event){
    console.log(event.target.value);
    this.setState({low: event.target.value});
  }

  handleHighPriceChange(event){
    console.log(event.target.value);
    this.setState({high: event.target.value});
  }


  handleDurChange(event){
    console.log(event.target.value);
    this.setState({dur: event.target.value});
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
      <Col xs={6} md={6}>

    <Image style={{width: 300, height: 300}} src={this.state.fake_img} atl="800x800">

    </Image>
    </Col>
    <Col xs={6} md={6}>
    <Panel>
        <p>Gender:{this.state.gender}</p>
        <p>Level:{this.state.level}</p>
        
        <p>Birth Date:{formatTime}</p>     

        <ButtonGroup vertical>
        <Button onClick={this.handleSellShow.bind(this)}>
        Sell
        </Button>
        <br/>



        <Button  onClick={this.handleShow.bind(this)}>
          Chat with me
        </Button>
        <br/>
        Intimacy:<ProgressBar bsStyle="success" now={this.state.intimacy} label={`${this.state.intimacy}%`} />
        <Label bsStyle="info">Unlock More features!</Label>

        <Button  disabled={this.state.intimacy<100} onClick={this.levelup.bind(this)}>
          Level me up
        </Button>


        </ButtonGroup>
        <br/>
        </Panel>

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



          <Modal show={this.state.sellshow} onHide={this.handleSellClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Sell</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           Start Price:<input id="low" type="text" onChange={this.handleHighPriceChange.bind(this)}></input>
           <br/>
          End Price:<input id="high" type="text" onChange={this.handleLowPriceChange.bind(this)}></input>
          <br/>
           Duration:<input id="duration" type="text" onChange={this.handleDurChange.bind(this)}></input>
           <br/>

           <Button onClick={this.sell.bind(this)}>Sell now</Button>


          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSellClose.bind(this)}>Close</Button>
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
