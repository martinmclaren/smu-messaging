import React from 'react';
import {Layout, Avatar, Dropdown, Menu, Icon, Badge} from 'antd';
import CommonStyles from './UserInterface.css'
import ValerieStyles from './ValerieUserInterface.css';
import MayStyles from './MayUserInterface.css';
import BobStyles from './BobUserInterface.css';
import {connect} from "dva";
import Communication from "./Communication";

const { Header, Sider, Content } = Layout;

class UserInterface extends React.Component {
  getCommunications(username) {
    this.props.dispatch({
      type: 'userInterface/getCommunications',
      payload: username
    });
  }

  getMessages(from) {
    this.props.dispatch({
      type: 'userInterface/getMessages',
      payload: from
    });
  }

  componentDidMount() {
    this.getCommunications(this.props.username);
/*    this.intervalId = setInterval(() => {
      this.getCommunications(this.props.username);
    }, 500); */
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleClick(e) {
    this.props.dispatch({
      type: 'userInterface/selectCommunication',
      payload: e
    });
  }

  render() {
    let styles;
    switch (this.props.nickName) {
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

    const userMenu = (
      <Menu className={styles.dropdown}>
        <Menu.Item key="logout">
          <a onClick={() =>
          {
            this.props.dispatch({
              type: 'indexPage/logOut'
            });
          }
          }><Icon className={styles.accountIcon} type='logout' />Log Out</a>
        </Menu.Item>
      </Menu>
    );

    return <Layout>
      <Header className={styles.userInterfaceHeader}>
        <Dropdown overlay={userMenu} placement="bottomRight">
        <a className={styles.user}>
          <Avatar size={50} icon="user" />
          <span className={styles.username}>{this.props.username}</span>
        </a>
        </Dropdown>
      </Header>
      <Layout>
        <Sider className={styles.userInterfaceSider} theme={'light'} width={'30%'}>
          <Menu className={styles.userInterfaceMenu} mode="inline">
            {this.props.userInterface.communications.map((e,i,arr)=>
              <Menu.Item key={e.chatId} className={styles.menuItems} onClick={()=>this.handleClick(e)}>
                <a className={styles.communication}>
                    <Avatar size={50} icon="user" />
                  <span className={styles.userName}>{e.from}</span>
                </a>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        {(this.props.userInterface.select === null)?
          <div className={styles.userInterfaceBlank}/>:
          <Communication username={this.props.username} chat={this.props.userInterface.select}/>}
      </Layout>
    </Layout>
  }
}

export default  connect(({userInterface, loading}) =>
  ({userInterface, loading: loading.models.userInterface}))(UserInterface);
