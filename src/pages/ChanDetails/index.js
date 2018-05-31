import React from 'react';

import Chat from './Chat.js';


import getWeb3 from '../../utils/getWeb3'

// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {Glyphicon,InputGroup,Input,ProgressBar, ButtonGroup,Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail,Badge, Label, Well, Modal,Popover} from 'react-bootstrap';

export default class ChanDetails extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
      intimacy:0,
      fake_data:[]

    };
  }

  // refreshState(){
  //   this.ChanCoreContract.getChan(this.state.selectedId).then(result=> {console.log("ooooooooo",result); console.log("heyyyyyyyyyyyyy", this); this.setState({name:result[0]}); this.setState({create_time:result[1].c[0]});this.setState({level:result[2].c[0]});this.setState({gender:result[3]?"female":"male"});console.log("yyyyyyy",this.state);});
  // }


  levelup(){
    console.log("level up");
    this.ChanCoreContract.ChanLevelup.sendTransaction(this.state.selectedId,{from:this.state.account});
    // this.refreshState();
    this.state.intimacy = 0;
    this.elapsedTime = 0;
    this.setState({level:this.state.level+1});
    this.setState({difficult_level:this.state.level*500});
   }

  checkIn() {
    console.log("Checking in");
    this.ChanCoreContract.checkIn.sendTransaction(this.state.selectedId,{from:this.state.account});
    // this.refreshState();
  }



    sell(){
      this.handleSellClose();
        console.log("sell");
        this.ChanCoreContract.createSaleAuction.sendTransaction(
          this.state.selectedId,
          this.state.high * 1000000000000000,
          this.state.low * 1000000000000000,
          this.state.dur * 3600,
          {from:this.state.account}
        ).then(result=>{
          console.log("db!!!");
          fetch('/api/sellchan', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id:this.state.selectedId}),
                  });
        });
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
      this.ChanCoreContract.checkInTimer().then(checkInTimer => {
        this.ChanCoreContract.getChan(selectedId).then(result=> {console.log(result); 
          console.log("heyyyyyyyyyyyyy", this);
          this.setState({name:result[0]}); 
          this.setState({create_time:result[1].c[0]});
          this.setState({level:result[2].c[0]});
          this.setState({gender:result[3]?"female":"male"});
          this.setState({nextCheckIn:this.timeConverter(result[4].c[0] - checkInTimer)});
          this.setState({checkInDeadline:this.timeConverter(result[4].c[0])});
          this.setState({checkInStreak:result[5].c[0]});
          this.setState({cooldownEndTime:this.timeConverter(result[6].c[0])});
          this.setState({shokanPartnerId:result[7].c[0]});
          console.log("Chan Info:",this.state);
          this.setState({difficult_level:500*(result[2].c[0]+1)});
        });
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
        this.elapsedTime = 0;
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
            self.elapsedTime += spentTime;
            console.log('now:',self.elapsedTime);
            self.setState({intimacy:(self.elapsedTime/self.state.difficult_level)});
            valid=false;
        };

        const beforeunload = function() {
            const endDate = new Date();
            const spentTime = endDate.getTime() - startDate.getTime();
            self.elapsedTime += spentTime;
            console.log('tttttime',self.elapsedTime);
            self.setState({intimacy:(self.elapsedTime/self.state.difficult_level)});
            valid=false;

            // elapsedTime contains the time spent on page in milliseconds
        };

        const refreshIntimacy = function(){
          if (valid) {
          const endDate = new Date();
          const spentTime = endDate.getTime() - startDate.getTime();
          self.elapsedTime += spentTime;
          self.setState({intimacy:(self.elapsedTime/self.state.difficult_level)});
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
    console.log(this.state.level);
        const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );

       
        var formatTime = this.timeConverter(this.state.create_time);

    return (

 <div>
    <h1>Cryptochan Name:{this.state.name}</h1>
    <div>
        <Grid>
            <Row>
                <Col xs={5} md={5}>
                <Image style={{width: 300, height: 300}} src={this.state.fake_img} atl="800x800">
                </Image>
                </Col>
                <Col xs={2} md={2}>
                Unlocked achievements:
                <ButtonGroup vertical>
                    <Button bsStyle='warning'>
                        <Glyphicon glyph="heart" />
                        blink
                    </Button>
                    <br/>
                    <Button bsStyle='warning'>
                        <Glyphicon glyph="heart" />
                        sweet word
                    </Button>
                    <br/>
                    <Button bsStyle='warning'>
                        <Glyphicon glyph="heart" />
                        hug
                    </Button>
                    <br/>
                    <Button bsStyle='warning'>
                        <Glyphicon glyph="heart" />
                        kiss
                    </Button>
                    <br/>
                    <Button bsStyle='warning' disabled>
                        <Glyphicon glyph="heart" />
                        dance
                    </Button>
                </ButtonGroup>
                </Col>
                <Col xs={5} md={5}>
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
                        <Popover
                            id="popover-basic"
                            placement="right"
                            positionLeft={120}
                            positionTop={30}
                            >
                            Currently, only support Chinese=。=
                        </Popover>
                        <br/>
                        Intimacy:
                        <ProgressBar bsStyle="success" now={this.state.intimacy} label={`${this.state.intimacy.toFixed(2)}%`} />
                        <Label bsStyle="info">Unlock More features!</Label>
                        <Button  disabled={this.state.intimacy<100} onClick={this.levelup.bind(this)}>
                        Level me up
                        </Button>
                        <Label bsStyle="info">Check In Streak: {this.state.checkInStreak}</Label>
                        <br/>
                        <Label bsStyle="info">Next Check In: {this.state.nextCheckIn}</Label>
                        <br/>
                        <Label bsStyle="info">Check In Deadline: {this.state.checkInDeadline}</Label>
                        <Button onClick={this.checkIn.bind(this)}>
                        Check In
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
                        Start Price:<input placeholder="millieth" id="low" type="number" onChange={this.handleHighPriceChange.bind(this)}></input>
                        <br/>
                        End Price:<input placeholder="millieth" id="high" type="number" onChange={this.handleLowPriceChange.bind(this)}></input>
                        <br/>
                        Duration:<input placeholder="hour" id="duration" type="number" onChange={this.handleDurChange.bind(this)}></input>
                        <br/>
                        <Button onClick={this.sell.bind(this)}>Put on sell</Button>
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
