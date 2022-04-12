import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { getDefaultKeyBinding, ContentState, SelectionState, Modifier } from 'draft-js';
import { clearEditorContent, insertNewUnstyledBlock } from 'draftjs-utils';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import { Message } from '@mui/icons-material';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      editing: false,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.editingMessage && !prevState.editing) {
      this.setState({ editorState: EditorState.createWithContent(convertFromHTML(this.props.editingMessage.content)) });
      this.setState({ editing: true });
    }
  };
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleKeyCommand = (command) => {
    if (command === 'myeditor-save') {
      if (this.state.editing) {
        this.props.onEdit({
          content: convertToHTML(this.state.editorState.getCurrentContent()),
          messageId: this.props.editingMessage._id,
        });
        this.setState({ editing: false });
      } else {
        this.props.onSubmit(convertToHTML(this.state.editorState.getCurrentContent()));
      }

      this.setState({ editorState: clearEditorContent(this.state.editorState) });

      return 'handled';
    }
    return 'not-handled';
  };

  keyBindingFn = (e) => {
    if (e.keyCode === 13) {
      return 'myeditor-save';
    }
    return getDefaultKeyBinding(e);
  };
  render() {
    const { editorState } = this.state;

    return (
      <Editor
        editorState={editorState}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={this.onEditorStateChange}
        preserveSelectionOnBlur={true}
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={this.keyBindingFn}
        placeholder="Start typing..."
      />
    );
  }
}

const mapStateToProps = (state) => ({
  editingMessage: state.channel.activeChannel?.editingMessage || state.messaging.activeMessaging?.editingMessage,
});

export default connect(mapStateToProps)(MessageInput);
