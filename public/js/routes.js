
import Login from './login.js';
import Compose from './compose.js';
import Messages from './messages.js';
import MessageDetail from './message_detail.js';

export default {
  "/login": Login,
  "/compose": Compose,
  "/messages": Messages,
  "/message/:id": MessageDetail
};
