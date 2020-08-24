import React from 'react';
import { connect } from 'dva';
import Login from "../components/Login";
import UserInterface from "../components/UserInterface";

class IndexPage extends React.Component {
  componentDidMount() {
    let token;
    if(window.localStorage){
      token = JSON.parse(window.localStorage.getItem("messagingSystemToken"));
    }
    if(token !== null){
      this.props.dispatch({
        type: 'indexPage/autoLogIn',
        payload: token
      });
    }
  }

  render() {
    return (this.props.indexPage.username === null)? <Login/>:
      <UserInterface username={this.props.indexPage.username}/>;
  }
}

export default connect(({indexPage, loading}) => ({indexPage, loading: loading.models.indexPage}))(IndexPage);
