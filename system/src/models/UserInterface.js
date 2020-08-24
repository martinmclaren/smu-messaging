import * as GlobalServices from "../services/global";
import WebSocketInstance from "../websocket";

export default {
  namespace: 'userInterface',
  state: {communications:[], select:null, message:[], imageOnly:false, sendDisable:true, imageZoom:false, zoomedImage:""},
  reducers: {
    showCommunications (state, {payload: {chat}}) {
      return {...state, communications: chat}
    },

    selectCommunication (state, {payload: chat}) {
      return {...state, select: chat, imageOnly:false}
    },

    imageOnly (state) {
      return {...state, imageOnly:!state.imageOnly};
    },

    disableSend (state) {
      return {...state, sendDisable:true};
    },

    enableSend (state) {
      return {...state, sendDisable:false};
    },

    changeImageZoomState (state, {payload: imageUrl}) {
      return {...state, imageZoom:!state.imageZoom, zoomedImage:imageUrl};
    }
  },
  effects: {
    *getCommunications({payload: username}, {call, put}) {
      const response = yield call(GlobalServices.getChat, username);
      console.log(response);
      yield put(
        {
          type: "showCommunications",
          payload: {
            chat: response.map(e => ({ chatId: e.id, from: e.participants.filter(e => e !== username)[0]}))
          }
        }
      )
    }
  },
  subscriptions: {
    openSocket ({ dispatch }) {
      return WebSocketInstance.connect()
    }
  }
}
