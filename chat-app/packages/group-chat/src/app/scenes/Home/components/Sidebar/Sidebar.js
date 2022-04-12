import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleCreateChannelModalAction } from '../Channel/components/CreateChannelModal/actions';
import { SidebarItem } from './components/SidebarItem';
import { SidebarSection } from './components/SidebarSection';
import styles from './styles.module.scss';

class Sidebar extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.channelsWrapper}>
          <SidebarSection
            title={'channels'}
            onClick={() => {
              this.props.dispatch(toggleCreateChannelModalAction());
            }}
            addIcon={true}
          ></SidebarSection>
          {this.props.channels.map((channel) => (
            <SidebarItem
              icon={<LibraryBooksIcon className={styles.icon}></LibraryBooksIcon>}
              name={channel?.name}
              id={channel?.id}
              type="channel"
              showNotification={channel.notification}
              key={channel?.id}
            />
          ))}

          <SidebarSection title={'messages'}></SidebarSection>
          {this.props.users
            .filter((i) => i.id !== this.props.myWorkspaceUserId)
            .map((user) => (
              <SidebarItem
                icon={
                  <div
                    className={cn([
                      styles.activity,
                      {
                        [styles.active]: user.availability === 'Online',
                        [styles.inactive]: user.availability === 'Offline',
                        [styles.inCall]: user.availability === 'InCall',
                      },
                    ])}
                  />
                }
                name={user.name}
                id={user.id}
                type="message"
                showNotification={user.notification}
                key={user.id}
              />
            ))}
        </div>
      </div>
    );
  }
}
const mapStateToPros = (state) => ({
  channels: state.channel.availableChannels,
  users: state.messaging.availableUsers,
  myWorkspaceUserId: state.user.workspaceUser._id,
});

export default connect(mapStateToPros)(Sidebar);
