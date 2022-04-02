import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MessageInput } from '../../../../shared/MessageInput';
import { sendChannelMessage } from './actions';
import { ChannelMessage } from './components/ChannelMessage';
import styles from './styles.module.scss';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { toggleRenameChannelModalAction } from './components/RenameChannelModal/actions';
import DeleteIcon from '@mui/icons-material/Delete';
import { DaySeparator } from '../../../../shared/DaySeparator'
import PersonIcon from '@mui/icons-material/Person';

import moment from 'moment';
import { createRef } from 'react';
import { toggleDeleteChannelModalAction } from './components/DeleteChannelModal/actions';

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

  get messages() {
    const groups = this.props.messages?.reduce((acc, message) => {
      const date = message.createdAt; // create a composed key: 'year-week'

      const today = moment(new Date());

      const dayDiff = today.diff(moment(date), 'days');

      console.log(`${dayDiff === 0 ? 'TODAY' : dayDiff === 1 ? 'YESTERDAY' : 'ELSE'}`);

      const stringDate = `${
        dayDiff === 0
          ? 'TODAY'
          : dayDiff === 1
          ? 'YESTERDAY'
          : `${moment(date).year()}-${
              moment(date).month() + 1 < 10 ? `0${moment(date).month() + 1}` : moment(date).month() + 1
            }-${moment(date).date() < 10 ? `0${moment(date).date()}` : moment(date).date()}`
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
        a.push(...groups[c].map((item) => <ChannelMessage key={item._id} message={item}></ChannelMessage>));
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
          </div>
          <div className={styles.separator}></div>
        </div>

        <div ref={this.messagesRef} className={styles.messagesWrapper}>
          {this.messages?.map((item) => item)}
        </div>
        <div className={styles.messageInputWrapper}>
          <MessageInput onSubmit={this.handleMessageSubmit}></MessageInput>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  channelName: state.channel?.activeChannel?.name || '',
  channelId: state.channel?.activeChannel?.id || '',
  messages: state.channel.channelMessages[state.channel?.activeChannel?.id],
  joinedUserNumber: state.channel?.activeChannel?.joinedUserNumber
});

export default connect(mapStateToProps)(Channel);
