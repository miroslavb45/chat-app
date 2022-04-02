import React, { Component } from 'react';

import avatar from 'images/defaultProfilePic.webp';

import styles from './styles.module.scss';
import { parseEmojis } from 'utils/parseEmojis';

export default class ChannelMessage extends Component {
  render() {
    const { createdAt, content, username } = this.props.message;
    const date = new Date(createdAt);
    return (
      <div className={styles.wrapper}>
        <div className={styles.messageBody}>
          <div className={styles.avatarContainer}>
            <img src={`https://i.pravatar.cc/150?u=${username}`} alt="Avatar" />
          </div>
          <div className={styles.messageContainer}>
            <div className={styles.messageHeader}>
              <div className={styles.playerName}>{username}</div>
              <div className={styles.sentDate}>
                {`${date.getHours() < 10 ? 0 : ''}${date.getHours()}:${
                  date.getMinutes() < 10 ? 0 : ''
                }${date.getMinutes()}`}
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} className={styles.messageText}></div>
          </div>
        </div>
      </div>
    );
  }
}
