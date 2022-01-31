import React from 'react';
import PropTypes from 'prop-types';

import avatar from 'images/defaultProfilePic.webp';

import styles from './styles.module.scss';

export const Participant = (props) => {
  const { user, onUserCall } = props;
  const username = user.split('@')[0];
  const date = new Date();

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
          <div className={styles.callWrapper}>
            <div onClick={() => onUserCall(username)}>Call Me</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participant;
