import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import './chat.css';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


// const Message = styled.div`
//   background-color: #77f442;
//   padding: 15px;
//   border-radius: 3px;
//   align-self: flex-end;
//   max-width: 80%;
//   `;

// const Response =styled.div`
//   background-color: #f2f2f2;
//   padding: 15px;
//   border-radius: 3px;
//   align-self: flex-start;
//   margin: 2px;
//   max-width: 80%;
// `

export default class Chat extends React.Component {













  constructor() {
    super()
    this.state = {
      meg: '',
      respon: [],
      megArray: []
    }
  }
  handleData(e) {
    this.setState({
      meg: e.target.value
    })
  }
  sendMessage() {
    var message = this.state.meg
    if (message === '') {
      alert('不能发送空白消息哦')
    } else {
      this.setState({
        megArray: [...this.state.megArray, message]
      })
      var that = this
      var func = fetch('http://www.tuling123.com/openapi/api?key=f0d11b6cae4647b2bd810a6a3df2136f&info=' + message, {
        method: 'POST',
        type: 'cors'
      }).then(function(response) {
        return response.json()
      }).then(function(detail) {
        return (that.setState({
          respon: [...that.state.respon, detail.text]
        }, () => {
          var el = ReactDOM.findDOMNode(that.refs.msgList);
          el.scrollTop = el.scrollHeight;
        }))
      })
      this.state.meg = ''
    }
  }
  render() {
    var meg = this.state.meg
    var megArray = this.state.megArray
    var respon = this.state.respon

    return (
      <div className="content">
       
        <div className="msg-list" ref="msgList">
          {megArray.map((elem,index) => (

            <div className="container" key={index}>
              <div className="message">{elem}</div>
              <div className="response">{respon[index]}</div>
            </div>


            )
           )}
        </div>
         <div className="fixedBottom">
           <input className="input" value={meg} onChange={this.handleData.bind(this)} />
           <button className="button" onClick={this.sendMessage.bind(this)}>发送</button>
         </div>
      </div>
    )
  }
}


