import React from 'react';
import {Avatar, Upload, Icon, Form, Input, Button, Modal} from 'antd';
import CommonStyles from './Communication.css'
import ValerieStyles from './ValerieCommunication.css';
import MayStyles from './MayCommunication.css';
import BobStyles from './BobCommunication.css';
import {connect} from "dva";
import moment from "moment";
import WebSocketInstance from "../websocket";


class Communication extends React.Component {
  state = {
    messages: [],
    gotMessage: false
  };
  
  constructor(props) {
    super(props);
    this.initialiseChat();
    WebSocketInstance.addCallbacks(
      messages => {
        this.setState({...this.state, messages: messages.reverse()});
        if(!this.state.gotMessage) {
          this.navigateToBottom();
          this.setState({...this.state, gotMessage: true});
        }
      },
      message => {
        console.log(message);
        this.setState({...this.state, messages:[...this.state.messages, message]});
        if(message.author !== this.props.chat.from){
          this.navigateToBottom();
        }
      }
    );
  }
  
  initialiseChat() {
    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(
        this.props.username,
        this.props.chat.chatId
      );
    });
    WebSocketInstance.connect(this.props.chat.chatId);
  }
  
  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }
  
  navigateToBottom() {
    let lastMessage = document.getElementById("lastMessage");
    if(lastMessage){
      lastMessage.scrollIntoView(true);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.chat.chatId !== prevProps.chat.chatId) {
      WebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(
          this.props.username,
          this.props.chat.chatId
        );
      });
      WebSocketInstance.connect(this.props.chat.chatId);
      this.setState({...this.state, gotMessage: false});
    }
  }

  handleImageOnly() {
    this.props.dispatch({
      type: 'userInterface/imageOnly'
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const messageObject = {
          from: this.props.username,
          content: values.message,
          chatId: this.props.chat.chatId,
          isImage: false,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'userInterface/disableSend'
        });
      }
    });
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onChange = e => {
    if (e.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(e.file.originFileObj, imageUrl =>
        {
          const messageObject = {
            from: this.props.username,
            content: imageUrl,
            chatId: this.props.chat.chatId,
            isImage: true
          };
          WebSocketInstance.newChatMessage(messageObject);
        }
      );
    }
  };

  handleInputChange = e => {
    let allSpace = /^\s*$/;
    console.log(e.target.value);
    if(allSpace.test(e.target.value)) {
      this.props.dispatch({
        type: 'userInterface/disableSend'
      })
    } else if(this.props.userInterface.sendDisable){
      this.props.dispatch({
        type: 'userInterface/enableSend'
      })
    }
  };

  changeTimeFormatByTime(time) {
    if(time > moment().subtract(1, 'minutes')) {
      return time.startOf('second').fromNow();
    } else if(time > moment().subtract(1, 'hours')) {
      return time.startOf('minute').fromNow();
    } else if(time > moment().subtract(1, 'days')) {
      return time.format('h:mm:ss a');
    } else if(time > moment().subtract(1, 'years')) {
      return time.format("MMM Do");
    } else {
      return time.format("MMM Do YYYY");
    }
  }

  handleImageZoom(imageUrl) {
    this.props.dispatch({
      type: 'userInterface/changeImageZoomState',
      payload: imageUrl
    })
  }

  render() {
    let styles;
    switch (this.props.username) {
      case "May":
        styles = MayStyles;
        break;
      case "Valerie":
        styles = ValerieStyles;
        break;
      case "Bob":
        styles = BobStyles;
        break;
      default:
        styles = CommonStyles;
        break;
    }
    
    let messages = this.state.messages.map(e =>
      ({ isImage:e.isImage, send:e.author !== this.props.chat.from, content:e.content, time:e.time}));
    messages = (this.props.userInterface.imageOnly)? messages.filter(e=>(e.isImage)):messages;
    
    const { getFieldDecorator } = this.props.form;

    return <main className={styles.communicationMain}>
      <div className={styles.communicationHeader}>
        <span className={styles.communicationFrom}>{this.props.chat.from}</span>
        <a className={(this.props.userInterface.imageOnly)? styles.pictureOnlyActive:styles.pictureOnlyInactive}
           onClick={()=>this.handleImageOnly()}><Icon type="picture" /></a>
      </div>
      <div className={styles.communicationContent} id={"messages"}>
      {messages.map((e,i,arr)=>(
        <div className={(e.send)? styles.messageRight:styles.messageLeft} key={"message" + i}
             id={(i === arr.length-1)? "lastMessage":"message" + i}>
          {(e.isImage)?
            <img className={styles.image} src={e.content} alt={'missing'}
                 onClick={() => this.handleImageZoom(e.content)
                 }/>:
            <span>{e.content}</span>}
          <br/>
          <span className={styles.time}>{this.changeTimeFormatByTime(moment(e.time))}</span>
        </div>
      ))}
      </div>
      <div className={styles.communicationBottom}>
        <Upload accept={"image/*"}
                name="image"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                onChange={this.onChange}>
          <Button type="primary" shape={"round"} size={"large"} className={styles.sendImage}>
            <Icon type="file-image" />
          </Button>
        </Upload>
        <Form hideRequiredMark onSubmit={this.handleSubmit} className={styles.sendForm}>
          <Form.Item className={styles.textInput}>
            {getFieldDecorator('message')(
              <Input onChange={this.handleInputChange} placeholder = "Type message and hit Send"/>
            )}
          </Form.Item>
          <Form.Item className={styles.sendButton}>
            <Button type="primary" htmlType="submit" loading={this.props.loading}
                    disabled={this.props.userInterface.sendDisable}>Send</Button>
          </Form.Item>
        </Form>
      </div>
      <Modal className={styles.modal}
             visible={this.props.userInterface.imageZoom}
             onCancel={() => this.handleImageZoom("")}
             maskClosable={true}
             centered={true}
             width={"auto"}
             footer={null}>
        <img className={styles.zoomedImage} src={this.props.userInterface.zoomedImage} alt={'missing'}
             height={window.innerHeight - 150} onClick={() => this.handleImageZoom("")}/>
      </Modal>
    </main>
  }
}

export default Form.create()(connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(Communication));
