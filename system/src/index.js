import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {
    indexPage: {
      username: null
    },
    userInterface: {
      communications: [],
      select: null,
      message: [],
      imageOnly: false,
      sendDisable: true,
      imageZoom:false,
      zoomedImage:""
    }
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/IndexPage').default);
app.model(require('./models/UserInterface').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
