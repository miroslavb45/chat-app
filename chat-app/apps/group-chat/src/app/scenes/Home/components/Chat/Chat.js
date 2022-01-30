import { getAuth } from 'firebase/auth';
import React, { Component, createRef } from 'react';
import { io } from 'socket.io-client';
import { MessageInput } from './components/MessageInput';
import { Message } from './components/Message';
import styles from './styles.module.scss';

export default class Chat extends Component {
  constructor() {
    super();
    const user = getAuth();
    this.state = {
      websocket: null,
      messages: [],
      user: user,
      message: '',
    };
    this.messageRef = createRef();
  }

  async componentDidMount() {
    const jwt = await this.state.user.currentUser.getIdToken();
    this.setState({ websocket: new io(`http://api.localhost`, { auth: { jwt }, transports: ['websocket'] }) }, () => {
      this.state.websocket.on('message', (message) => {
        this.setState({ messages: [...this.state.messages, message] });
      });
    });
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <>
          <div className={styles.chatHeader}>Group Chat</div>
          <div className={styles.separator}></div>
        </>
        <div className={styles.messagesWrapper}>
          {this.state.messages.map((message, index) => (
            <Message id={index} message={message} />
          ))}
        </div>

        <div className={styles.inputFormWrapper}>
          <MessageInput
            handleSubmit={(e) => {
              this.state.websocket.emit('message', {
                message: e,
                username: this.state.user.currentUser.email.split('@')[0],
              });
            }}
          ></MessageInput>
        </div>
      </div>
    );
  }
}
