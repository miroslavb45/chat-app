import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SidebarItem } from './components/SidebarItem';
import { SidebarSection } from './components/SidebarSection';
import styles from './styles.module.scss';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import cn from 'classnames';
import Modal from 'simple-react-modal';
import { toggleCreateChannelModalAction } from '../Channel/components/CreateChannelModal/actions';

class Sidebar extends Component {
  render() {
    const users = [
      {
        name: 'John Snow',
        id: 'id_1',
        isActive: true,
      },
      {
        name: 'Harry Potter',
        id: 'id_2',
        isActive: false,
      },
      {
        name: 'Miroslav Brnic',
        id: 'id_3',
        isActive: true,
      },
      {
        name: 'Liliana Jaramany',
        id: 'id_4',
        isActive: true,
      },
    ];
    return (
      <div className={styles.wrapper}>
        <div className={styles.channelsWrapper}>
          <SidebarSection
            title={'channels'}
            onClick={() => {
              this.props.dispatch(toggleCreateChannelModalAction());
            }}
          ></SidebarSection>
          {this.props.channels.map((channel) => (
            <SidebarItem
              icon={<LibraryBooksIcon className={styles.icon}></LibraryBooksIcon>}
              name={channel?.name}
              id={channel?.id}
              type="channel"
            />
          ))}

          <SidebarSection title={'messages'}></SidebarSection>
          {users.map((user) => (
            <SidebarItem
              icon={
                <div
                  className={cn([
                    styles.activity,
                    {
                      [styles.active]: user.isActive,
                      [styles.inactive]: !user.isActive,
                    },
                  ])}
                />
              }
              name={user.name}
              id={user.id}
              type="message"
            />
          ))}
        </div>
        <div className={styles.asd}></div>
        {/* <Modal show={this.state.show} onClose={this.close}>
          <div>hey, click outside of me to close me!</div>
        </Modal> */}
      </div>
    );
  }
}
const mapStateToPros = (state) => ({
  channels: state.channel.availableChannels,
});

export default connect(mapStateToPros)(Sidebar);
