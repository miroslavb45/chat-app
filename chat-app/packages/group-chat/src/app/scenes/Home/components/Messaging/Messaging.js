import DeleteIcon from '@mui/icons-material/Delete';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DaySeparator } from '../../../../shared/DaySeparator';
import { MessageInput } from '../../../../shared/MessageInput';
import { toggleOutgoingVideoCallModal } from '../../../VideoChat/actions';
import { getPrivateMessaging, modifyPrivateMessage, sendPrivateMessage } from './actions';
import { toggleDeleteMessagingModalAction } from './components/DeleteMessagingModal/actions';
import { PrivateMessage } from './components/PrivateMessage';
import styles from './styles.module.scss';


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

  handleStartVideoCall = () => {
    this.props.dispatch(
      toggleOutgoingVideoCallModal({ partnerId: this.props.partnerId, partnerName: this.props.partnerName })
    );
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
            </div>

            <div className={styles.actions}>
              {this.props.partnerAvailability !== 'InCall' && (
                <div className={styles.delete} onClick={this.handleStartVideoCall}>
                  <VideoCallIcon />
                  start video call
                </div>
              )}

              <div className={styles.delete} onClick={this.handleDeleteClick}>
                <DeleteIcon />
                delete conversation
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
  partnerId: state.messaging.activeMessaging?.id,
  partnerAvailability: state.messaging?.availableUsers?.find((item) => item.id === state.messaging.activeMessaging?.id)
    ?.availability,
});

export default connect(mapStateToPros)(Messaging);
