import { getAuth } from 'firebase/auth';
import background from 'images/background.png';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectToWebsocket } from '../../shared/services/websocket';
import Topbar from '../../shared/Topbar';
import VideoChat from '../VideoChat/VideoChat';
import { getWorkspaceAction } from '../Workspace/actions';
import { getJoinedChannels } from './actions';
import { Channel } from './components/Channel';
import { CreateChannelModal } from './components/Channel/components/CreateChannelModal';
import DeleteChannelModal from './components/Channel/components/DeleteChannelModal/DeleteChannelModal';
import { RenameChannelModal } from './components/Channel/components/RenameChannelModal';
import { Messaging } from './components/Messaging';
import { getWorkspaceUsers } from './components/Messaging/actions';
import { DeleteMessagingModal } from './components/Messaging/components/DeleteMessagingModal';
import ProfileSettingsModal from './components/ProfileSettingsModal/ProfileSettingsModal';
import { Sidebar } from './components/Sidebar';
import styles from './styles.module.scss';

class Home extends Component {
  state = {
    isChatOpen: true,
    username: null,
    chatMessages: [],
    participants: [],
    pendingMessages: [],
    user: {},
    websocket: null,
    selectedUserEmail: null,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const auth = getAuth();

    this.setState({ user: auth.currentUser });
    dispatch(getWorkspaceAction());
    dispatch(
      getWorkspaceUsers({
        entityId: this.props.workspaceId,
      })
    );

    await connectToWebsocket();

    dispatch(
      getJoinedChannels({
        entityId: this.props.workspaceId,
      })
    );
  }

  toggleChat = () => {
    this.setState({ isChatOpen: !this.state.isChatOpen });
  };

  handleUserCall = (e) => {
    this.setState({ selectedUserEmail: e });
  };

  get activeMainContent() {
    const { activeMainContent } = this.props;
    switch (activeMainContent?.type) {
      case 'channel':
        return <Channel id={activeMainContent.id} />;
      case 'message':
        return <Messaging id={activeMainContent.id} />;
      default:
        return null;
    }
  }
  render() {
    return (
      <>
        <div className={styles.wrapper} style={{ backgroundImage: `url(${background})` }}>
          <div className={styles.overlay}></div>
          <Topbar />
          <div className={styles.sidebarWrapper}>
            <Sidebar></Sidebar>
          </div>

          <div className={styles.mainWrapper}>{this.activeMainContent}</div>

          {this.props.isModalOpen && (
            <>
              <CreateChannelModal></CreateChannelModal>
              <RenameChannelModal></RenameChannelModal>
              <DeleteChannelModal></DeleteChannelModal>

              <DeleteMessagingModal></DeleteMessagingModal>
              <ProfileSettingsModal />
            </>
          )}
        </div>

        <VideoChat></VideoChat>
      </>
    );
  }
}

const mapStateToPros = (state) => ({
  activeMainContent: state.home.activeMainContent,
  workspaceId: state.workspace.activeWorkspace.id || state.workspace.activeWorkspace,
  isModalOpen: state.home.isModalOpen,
});

export default connect(mapStateToPros)(Home);
