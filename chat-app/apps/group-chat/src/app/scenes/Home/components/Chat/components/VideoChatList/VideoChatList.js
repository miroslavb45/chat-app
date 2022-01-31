import React, { Component } from 'react';

import cn from 'classnames';

import styles from './styles.module.scss';
import { CSSTransition } from 'react-transition-group';
import { Participant } from './components/Participant';
export default class VideoChatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVideoChatListOpen: true,
    };
  }

  toggleVideoChat = () => {
    this.setState({ isVideoChatListOpen: !this.state.isVideoChatListOpen });
  };

  render() {
    const { isVideoChatListOpen } = this.state;
    return (
      <div>
        <CSSTransition
          in={isVideoChatListOpen}
          timeout={2000}
          classNames={{
            enter: styles['button-enter'],
            enterActive: styles['button-enter-active'],
            exit: styles['button-exit'],
            exitActive: styles['button-exit-active'],
          }}
          className={cn(styles.toggleChatButton, {
            [styles.isOpen]: isVideoChatListOpen,
          })}
          onClick={this.toggleVideoChat}
        >
          <div>
            <div className={styles.toggleChatButtonLabel}>
              {isVideoChatListOpen ? (
                <i
                  className={cn('sis-arrow_down', {
                    [styles.isOpen]: isVideoChatListOpen,
                  })}
                ></i>
              ) : (
                <i
                  className={cn('sis-arrow_up', {
                    [styles.isOpen]: isVideoChatListOpen,
                  })}
                ></i>
              )}
              VideoChat
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={isVideoChatListOpen}
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
            <div className={styles.listWrapper}>
              <div className={styles.chatHeader}>Available Users</div>
              <div className={styles.separator}></div>
            </div>

            <div className={styles.participantsWrapper}></div>

            {this.props.participants?.map((item, idx) => (
              <Participant onUserCall={this.props.onUserCall} user={item} id={idx}></Participant>
            ))}
          </div>
        </CSSTransition>
      </div>
    );
  }
}
