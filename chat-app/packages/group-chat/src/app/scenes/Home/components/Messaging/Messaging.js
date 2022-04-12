import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DaySeparator } from '../../../../shared/DaySeparator';
import { MessageInput } from '../../../../shared/MessageInput';
import { getPrivateMessaging, modifyPrivateMessage, sendPrivateMessage } from './actions';
import { PrivateMessage } from './components/PrivateMessage';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './styles.module.scss';
import { toggleDeleteMessagingModalAction } from './components/DeleteMessagingModal/actions';

class Messaging extends Component {
  componentDidMount() {
    this.props.dispatch(
      getPrivateMessaging({
        entityId: this.props.id,
      })
    );
  }

  handleMessageSubmit = (content) => {
    console.log(content);
    this.props.dispatch(
      sendPrivateMessage({
        userId: this.props.id,
        message: content,
      })
    );
  };

  handleDeleteClick = () => {
    this.props.dispatch(toggleDeleteMessagingModalAction());
  };

  handleMessageEdit = ({ messageId, content }) => {
    console.log(messageId, content);
    this.props.dispatch(modifyPrivateMessage({ messageId: messageId, content: content }));
  };

  shouldRenderMessageActions = (message) => {
    return this.props.userRole === 'Admin' || message.author === this.props.userId;
  };

  get messages() {
    const groups = this.props.messages?.reduce((acc, message) => {
      const todaysDate = new Date();
      const givenDate = new Date(message.createdAt);
      givenDate.setUTCHours(0, 0, 0, 0, 0);
      todaysDate.setUTCHours(0, 0, 0, 0);

      const today = moment(todaysDate);
      const date = moment(givenDate);

      const dayDiff = today.diff(date, 'days');

      const stringDate = `${
        dayDiff === 0
          ? 'TODAY'
          : dayDiff === 1
          ? 'YESTERDAY'
          : `${moment(message.createdAt).year()}-${
              moment(message.createdAt).month() + 1 < 10
                ? `0${moment(message.createdAt).month() + 1}`
                : moment(message.createdAt).month() + 1
            }-${
              moment(message.createdAt).date() < 10
                ? `0${moment(message.createdAt).date()}`
                : moment(message.createdAt).date()
            }`
      }`;

      if (!acc[stringDate]) {
        acc[stringDate] = [];
      }

      acc[stringDate].push(message);

      return acc;
    }, {});

    const doneObj =
      groups &&
      Object.keys(groups).reduce((a, c) => {
        a.push(<DaySeparator date={c}></DaySeparator>);
        a.push(
          ...groups[c].map((item) => (
            <PrivateMessage
              id={item._id}
              shouldShowAction={this.shouldRenderMessageActions(item)}
              key={item._id}
              message={item}
            ></PrivateMessage>

          ))
        );
        return a;
      }, []);

    return doneObj;
  }

  render() {
    return (
      <div className={styles.channelWrapper}>
        <div className={styles.topWrapper}>
          <div className={styles.headerWrapper}>
            <div className={styles.info}>
              <div>{this.props.partnerName}</div>
              <div className={styles.joinedUsersWrapper}>
                {/* <PersonIcon></PersonIcon> {this.props.joinedUserNumber} */}
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.delete} onClick={this.handleDeleteClick}>
                <DeleteIcon />
                Delete conversation
              </div>
            </div>
          </div>
          <div className={styles.separator}></div>
        </div>

        <div ref={this.messagesRef} className={styles.messagesWrapper}>
          {this.messages?.map((item) => item)}
        </div>
        <div className={styles.messageInputWrapper}>
          <MessageInput onSubmit={this.handleMessageSubmit} onEdit={this.handleMessageEdit}></MessageInput>
        </div>
      </div>
    );
  }
}

const mapStateToPros = (state, props) => ({
  messages: state.messaging.privateMessages[props.id],
  me: state.user.workspaceUser,
  author: state.channel?.activeChannel?.author,
  userId: state.user.workspaceUser._id,
  userRole: state.user.workspaceUser?.role,
  partnerName: state.messaging.activeMessaging?.name,
});

export default connect(mapStateToPros)(Messaging);
