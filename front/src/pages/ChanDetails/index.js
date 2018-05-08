import React from 'react';

import Grid from 'material-ui/Grid';

// import AsyncCryptoChan from 'components/AsyncCryptoChan';

export default class ChanDetails extends React.Component {
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

    return (
      <div>
        <h1>My Chan Detail</h1>
        <Grid container spacing={24}>
          <Grid item xs={12} md={6} lg={4}>
            <AsyncCryptoChan contract={contract} id={selectedId} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div style={{float: 'right'}}>
              <button>Level up!</button>
            </div>
            <ul>
              <li><strong>Level:</strong> 666</li>
            </ul>
          </Grid>
        </Grid>
      </div>
    )
  }
}
