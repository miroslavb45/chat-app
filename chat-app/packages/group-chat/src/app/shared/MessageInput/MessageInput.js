import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { getDefaultKeyBinding, ContentState, SelectionState, Modifier } from 'draft-js';
import { clearEditorContent } from 'draftjs-utils';
import styles from './styles.module.scss'

export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    // if (!this.state.clearing) {
    this.setState({
      editorState,
    });
    // }
  };

  handleKeyCommand = (command) => {
    if (command === 'myeditor-save') {
      this.props.onSubmit(convertToHTML(this.state.editorState.getCurrentContent()));
      //   this.setState({
      //     editorState: EditorState.push(this.state.editorState, ContentState.createFromText('')),
      //   });

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
