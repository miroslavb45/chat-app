import React, { Component } from 'react';
import Topbar from '../../shared/Topbar';
import { getAuth } from 'firebase/auth';
import { Chat } from './components/Chat';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';

import background from 'images/background.png';

import styles from './styles.module.scss';

export default class Home extends Component {
  state = {
    isChatOpen: true,
    username: null,
    chatMessages: [],
    participants: [],
    pendingMessages: [],
    user: {}
  };

  async componentDidMount() {
    const auth = getAuth();

    this.setState({ user: auth.currentUser });
  }

  toggleChat = () =>{
    this.setState({isChatOpen: !this.state.isChatOpen})
  }
  render() {
    const { isChatOpen, chatMessages, participants, pendingMessages, user} = this.state;
    return (
      <div className={styles.wrapper} style={{ backgroundImage: `url(${background})` }}>
        <Topbar />
        

        <CSSTransition
              in={isChatOpen}
              timeout={2000}
              classNames={{
                enter: styles['button-enter'],
                enterActive: styles['button-enter-active'],
                exit: styles['button-exit'],
                exitActive: styles['button-exit-active'],
              }}
              className={cn(styles.toggleChatButton, {
                [styles.isOpen]: isChatOpen,
              })}
              onClick={this.toggleChat}
            >
              <div>
                <div className={styles.toggleChatButtonLabel}>
                  {isChatOpen ? (
                    <i
                      className={cn('sis-arrow_down', {
                        [styles.isOpen]: isChatOpen,
                      })}
                    ></i>
                  ) : (
                    <i
                      className={cn('sis-arrow_up', {
                        [styles.isOpen]: isChatOpen,
                      })}
                    ></i>
                  )}
                  chat
                </div>
              </div>
            </CSSTransition>
            {chatMessages && (
              <CSSTransition
                in={isChatOpen}
                timeout={2000}
                unmountOnExit
                classNames={{
                  enter: styles['chat-enter'],
                  enterActive: styles['chat-enter-active'],
                  exit: styles['chat-exit'],
                  exitActive: styles['chat-exit-active'],
                }}
                className={styles.chatContainer}
              >
                <div>
                  <Chat
                    onCloseChat={this.toggleChat}
                    messages={chatMessages}
                    onSendMessage={this.handleMessageSend}
                    participants={participants}
                    pendingMessages={pendingMessages}
                    user={{}}
                  />
                </div>
              </CSSTransition>
            )}
      </div>
    );
  }
}
