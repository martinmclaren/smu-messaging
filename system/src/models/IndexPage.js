import * as GlobalServices from "../services/global";
import {message} from "antd";

export default {
  namespace: 'indexPage',
  state: {username:null},
  reducers: {
    localLogin (state, {payload: { token, remember }}) {
        if(remember) {
          if(window.localStorage){
            localStorage.setItem("messagingSystemToken", JSON.stringify(token));
          }
        }
        return { username: token.username };
    },

    logOut (state) {
      localStorage.removeItem("messagingSystemToken");
      return { username:null};
    },

    autoLogIn (state, {payload: token}){
      return { username: token.username};
    }
  },
  effects: {
    *logIn ({payload: {username, password, remember}}, {call, put}) {
      console.log(username);
      try{
        const response = yield call(GlobalServices.login, {username:username, password:password});
        console.log(response);
        yield put(
          {
            type: "localLogin",
            payload: {
              token: { key: response.key, username: username },
              remember: remember
            }
          }
        )
      } catch(e) {
        message.error("Username or password is wrong!");
      }
    }
  }
}
