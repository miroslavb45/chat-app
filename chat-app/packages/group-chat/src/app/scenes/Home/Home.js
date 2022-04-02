import { getAuth } from 'firebase/auth';
import background from 'images/background.png';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectToWebsocket } from '../../shared/services/websocket';
import Topbar from '../../shared/Topbar';
import { getWorkspaceAction } from '../Workspace/actions';
import { getJoinedChannels } from './actions';
import { Channel } from './components/Channel';
import { CreateChannelModal } from './components/Channel/components/CreateChannelModal';
import DeleteChannelModal from './components/Channel/components/DeleteChannelModal/DeleteChannelModal';
import { RenameChannelModal } from './components/Channel/components/RenameChannelModal';
import { PrivateMessage } from './components/PrivateMessage';
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
      getJoinedChannels({
        workspace: this.props.workspaceId,
      })
    );

    await connectToWebsocket();
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
        return <PrivateMessage id={activeMainContent.id} />;
      default:
        return null;
    }
  }
  render() {
    // const { isChatOpen, chatMessages, participants, pendingMessages, user } = this.state;
    return (
      <div className={styles.wrapper} style={{ backgroundImage: `url(${background})` }}>
        <div className={styles.overlay}></div>
        <Topbar />
        <div className={styles.sidebarWrapper}>
          <Sidebar></Sidebar>
        </div>

        <div className={styles.mainWrapper}>{this.activeMainContent}</div>

        {this.props.isModalOpen && (
          // <div className={styles.modalWrapper}>
          <>
            <CreateChannelModal></CreateChannelModal>
            <RenameChannelModal></RenameChannelModal>
            <DeleteChannelModal></DeleteChannelModal>
          </>
          // </div>
        )}

        {/* <div className={styles.componentsWrapper}>
          <CSSTransition
            in={isChatOpen}
            timeout={2000}
            classNames={{
              enter: styles['button-enter'],
              enterActive: styles['button-enter-active'],
              exit: styles['button-exit'],
              exitActive: styles['button-exit-active'],
            }}
            className={cn(styles.toggleChatButton, {
              [styles.isOpen]: isChatOpen,
            })}
            onClick={this.toggleChat}
          >
            <div>
              <div className={styles.toggleChatButtonLabel}>
                {isChatOpen ? (
                  <i
                    className={cn('sis-arrow_down', {
                      [styles.isOpen]: isChatOpen,
                    })}
                  ></i>
                ) : (
                  <i
                    className={cn('sis-arrow_up', {
                      [styles.isOpen]: isChatOpen,
                    })}
                  ></i>
                )}
                chat
              </div>
            </div>
          </CSSTransition>
          {chatMessages && (
            <CSSTransition
              in={isChatOpen}
              timeout={2000}
              unmountOnExit
              classNames={{
                enter: styles['chat-enter'],
                enterActive: styles['chat-enter-active'],
                exit: styles['chat-exit'],
                exitActive: styles['chat-exit-active'],
              }}
              className={styles.chatContainer}
            >
              <div>
                <Chat
                  onCloseChat={this.toggleChat}
                  messages={chatMessages}
                  onSendMessage={this.handleMessageSend}
                  participants={participants}
                  pendingMessages={pendingMessages}
                  user={{}}
                />
              </div>
            </CSSTransition>
          )}

          <div className={styles.videoChatListWrapper}>
            <VideoChatList
              onUserCall={this.handleUserCall}
              participants={[
                ...new Set(
                  this.state.participants.map((item) => {
                    console.log(item.email);
                    return item.email;
                  })
                ),
              ]}
            />
          </div> */}

        {/* <div className={styles.videoChatWrapper}> */}
        {/* <VideoChat partnerPeerId={this.state.selectedUserEmail?.split('@')[0]} /> */}
        {/* </div> */}
        {/* </div> */}
      </div>
    );
  }
}

const mapStateToPros = (state) => ({
  activeMainContent: state.home.activeMainContent,
  workspaceId: state.workspace.activeWorkspace.id || state.workspace.activeWorkspace,
  isModalOpen: state.home.isModalOpen,
});

export default connect(mapStateToPros)(Home);
