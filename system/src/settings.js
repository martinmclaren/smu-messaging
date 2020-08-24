let DEBUG = false;
let HOST_URL = HOST_URL = "http://140.184.230.209:8000";
let SOCKET_URL = "ws://140.184.230.209:8000";
if (DEBUG) {
  HOST_URL = "http://127.0.0.1:8000";
  SOCKET_URL = "ws://127.0.0.1:8000";
}

export { HOST_URL, SOCKET_URL };
