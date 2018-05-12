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

        const i1 ="https://s3.amazonaws.com/cryptochans/0"+selectedId+"1.jpg"
        
        const i2="https://s3.amazonaws.com/cryptochans/01.jpg"
        const fake_data =[{"url":i1},{"url":i2}];
        const sell_func = this.sell.bind(this);
        // console.log(this.state.value);
    return (
      <div>

         <h1>id={selectedId}</h1>
        <div>
        <Grid>
  <Row>
      {fake_data.map(function(d, idx){
        console.log(sell_func);
         return (<Col xs={6} md={4}>
      <Thumbnail src={d.url} alt="242x200">
        <h3>Chan:{idx}</h3>
        <p>Chan Details//Todo</p>
        <p>
           <Button id="sell" onClick={sell_func.bind(null,idx)}>
        Sell!
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
