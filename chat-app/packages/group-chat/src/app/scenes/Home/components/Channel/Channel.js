import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PersonIcon from '@mui/icons-material/Person';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { DaySeparator } from '../../../../shared/DaySeparator';
import { MessageInput } from '../../../../shared/MessageInput';
import { modifyChannelMessage, sendChannelMessage } from './actions';
import { ChannelMessage } from './components/ChannelMessage';
import { toggleDeleteChannelModalAction } from './components/DeleteChannelModal/actions';
import { toggleRenameChannelModalAction } from './components/RenameChannelModal/actions';
import styles from './styles.module.scss';

class Channel extends Component {
  messagesRef = createRef();
  handleMessageSubmit = (content) => {
    this.props.dispatch(
      sendChannelMessage({
        channel: this.props.channelId,
        message: content,
      })
    );
  };

  handleMessageEdit = ({ messageId, content }) => {
    this.props.dispatch(modifyChannelMessage({ messageId: messageId, content: content }));
  };

  handleRenameClick = () => {
    this.props.dispatch(toggleRenameChannelModalAction());
  };

  handleDeleteClick = () => {
    this.props.dispatch(toggleDeleteChannelModalAction());
  };

  componentDidMount() {
    this.messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  componentDidUpdate() {
    this.messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  get shouldRenderAction() {
    return this.props.userRole === 'Admin' || this.props.author === this.props.userId;
  }

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
        a.push(<DaySeparator key={c} date={c}></DaySeparator>);
        a.push(
          ...groups[c].map((item, idx) => (
            <ChannelMessage
              id={item._id}
              shouldShowAction={this.shouldRenderMessageActions(item)}
              key={`${item._id}-${idx}`}
              message={item}
            ></ChannelMessage>
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
              <div># {this.props.channelName}</div>
              <div className={styles.joinedUsersWrapper}>
                <PersonIcon></PersonIcon> {this.props.joinedUserNumber}
              </div>
            </div>
            {this.shouldRenderAction && (
              <div className={styles.actions}>
                <div className={styles.rename} onClick={this.handleRenameClick}>
                  <DriveFileRenameOutlineIcon />
                  Rename channel
                </div>

                <div className={styles.delete} onClick={this.handleDeleteClick}>
                  <DeleteIcon />
                  Delete channel
                </div>
              </div>
            )}
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

const mapStateToProps = (state) => ({
  channelName: state.channel?.activeChannel?.name || '',
  channelId: state.channel?.activeChannel?.id || '',
  messages: state.channel.channelMessages[state.channel?.activeChannel?.id],
  joinedUserNumber: state.channel?.activeChannel?.joinedUserNumber,
  author: state.channel?.activeChannel?.author,
  userId: state.user.workspaceUser._id,
  userRole: state.user.workspaceUser?.role,
});

export default connect(mapStateToProps)(Channel);
