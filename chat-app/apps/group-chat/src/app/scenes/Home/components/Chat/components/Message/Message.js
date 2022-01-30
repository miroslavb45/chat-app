import React from 'react';
import PropTypes from 'prop-types';

import avatar from 'images/defaultProfilePic.webp';

import styles from './styles.module.scss';
import { parseEmojis } from 'utils/parseEmojis';

export const Message = (props) => {
  const { message, onSendMessage } = props;
  const date = message.timestamp ? new Date(message.timestamp) : new Date();

  return (
    <div onClick={() => onSendMessage({ message: message.message, id: message.id })} className={styles.wrapper}>
      <div className={styles.messageBody}>
        <div className={styles.avatarContainer}>
          <img src={avatar} alt="Avatar" />
        </div>
        <div className={styles.messageContainer}>
          <div className={styles.messageHeader}>
            <div className={styles.playerName}>{message.username}</div>
            <div className={styles.sentDate}>
              {`${date.getHours() < 10 ? 0 : ''}${date.getHours()}:${
                date.getMinutes() < 10 ? 0 : ''
              }${date.getMinutes()}`}
            </div>
          </div>
          <div className={styles.messageText}>{parseEmojis(message.message)}</div>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  onSendMessage: PropTypes.func,
};

export default Message;
