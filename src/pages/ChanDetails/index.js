import React from 'react';

// import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';
import {Navbar, Jumbotron, Button, Panel, Grid, Image, Row, Col, Thumbnail} from 'react-bootstrap';

export default class ChanDetails extends React.Component {

  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     admin: false
  //   }

  // }


    sell(chan_id){
        console.log("bought");
        console.log(chan_id);
        //this.ChanCoreContract.ownerOf(chan_id).then(result=> {console.log(result,typeof(result)); const owner = result });
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



        const { match, contract } = this.props;
        const selectedId = match.params.id;
        console.log(selectedId,'id?');
        console.log(contract,'contract?');
        contract.getChan(selectedId).then(result=> {console.log(result);});

        const i1 ="https://s3.amazonaws.com/cryptochans/01.jpg"
        const i2="https://s3.amazonaws.com/cryptochans/02.jpg"
        const fake_data =[{"url":i1},{"url":i2}];
        const sell_func = this.sell.bind(this);
        // console.log(this.state.value);
    return (
      <div>

         <h1>id={selectedId}</h1>
        <div>




      <Col xs={10} md={20}>

    <Image src={i1} atl="800x800">

    </Image>
        <Button id="withdraw" onClick={sell_func}>
        Buy!
        </Button>

    </Col>
    </div>
    </div>

    )
  }
}
