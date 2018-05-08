import React from 'react';

import { Link } from 'react-router-dom';
import Card from 'material-ui/Card';
import Grid from 'material-ui/Grid';

import { getAccount } from 'data/web3';


// import CryptoChan from 'components/CryptoChan';

const randomChan = () => {
  return {
    eyesSize: Math.round(-20 + 40 * Math.random()),
    eyesAsymmetricity: Math.round(-15 + 30 * Math.random()),
    eyesTilt: Math.round(-30 + 60 * Math.random()),
    legsSize: Math.round(-30 + 60 * Math.random()),
    mouthSize: Math.round(-30 + 60 * Math.random()),
    mouthTilt: Math.round(-30 + 60 * Math.random()),
    bodyWidth: Math.round(-100 + 200 * Math.random()),
    bodyColor: Math.round(-180 + 360 * Math.random()),
    mouthColor: Math.round(-180 + 360 * Math.random()),
    eyesColor: Math.round(-180 + 360 * Math.random()),
    legsColor: Math.round(-180 + 360 * Math.random()),
  };
}

export default class BuyNewChan extends React.Component {
  web3 = null;
  cryptoChansContract = null;

  state = {
    tokenId: null,
    Chans: [],
    loadingChan: false,
    confirmed: null,
  }

  async componentDidMount() {
    this.cryptoChansContract = this.props.contract;

    const myChans = await this.cryptoChansContract.getMyChans();
    const metadataPromises = myChans.map(this.cryptoChansContract.getChanMetadata);
    const metadata = await Promise.all(metadataPromises);

    this.setState({Chans: myChans, metadata});
  }

  getChanMetadata = async (ChanId) => {
    const metadata = await this.cryptoChansContract.getChanMetadata(ChanId);
    const Chan = JSON.parse(metadata);
    this.setState({ Chan });
  }

  buyChan = async () => {
    const Chan = randomChan();
    const address = await getAccount();

    // buildTokenId is a view function, that we can call for free. This allows
    // to save gas when actually buying the Chan:
    const id = await this.cryptoChansContract.buildTokenId(Chan, address);

    this.setState({ tokenId: id });

    try {

      const tx = this.cryptoChansContract.growNewChan(address, id, Chan)

      tx.on('confirmation', (confirmationNumber) => {
        this.setState({ confirmed: confirmationNumber });
      })
      .then(() => {
        localStorage.setItem('token_id', id); // TODO: Get rid of this
        //this.getChanMetadata(id);  // This fails because the promise returns when tx is submitted not mined.
      });
    } catch(er) {
      console.error(er);
    }
  }

  render() {
    return (
      <div>
        <h1>Your Chans</h1>

        {
          this.state.loadingChan && "Your Chan is growing..."
        }

        <Grid container spacing={16}>
          {
            !this.state.loadingChan && this.state.Chans && this.state.Chans && this.state.metadata && this.state.Chans.map((t, i) => {
              const Chan = this.state.metadata[i];
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={t}>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{width: 300, display: 'flex', justifyContent: 'center'}}>
                      <Link to={`/${t}`} style={{display: 'block', textAlign: 'center'}}>
                        <CryptoChan Chan={Chan} size={245} />
                        <h4>Cardinal #{t}</h4>
                      </Link>
                    </Card>
                  </div>
                </Grid>
              );
            })
          }
        </Grid>

        {
          this.state.confirmed &&
            <div>confirmed {this.state.confirmed} times</div>
        }

        <div style={{marginBottom: 32, textAlign: 'center'}}>
          <button onClick={this.buyChan} style={{margin: '2em 0', padding: '1em 4em'}}>Buy a new Chan</button>
        </div>
      </div>
    )
  }
}
