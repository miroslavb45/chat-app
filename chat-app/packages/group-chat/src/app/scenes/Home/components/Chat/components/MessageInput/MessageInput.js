import React, { Component, createRef } from 'react';
import cn from 'classnames';

import { parseEmojis } from 'utils/parseEmojis';

import styles from './styles.module.scss';

export class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageForm: {
        message: '',
      },
      textAreaHeight: '14px',
      isSendButtonDisabled: false,
    };

    this.textAreaRef = createRef(null);
  }

  resetForm() {
    let messageForm = { ...this.state.messageForm };
    messageForm.message = '';
    this.setState({ messageForm: messageForm });
    this.textAreaRef.current.value = '';
    this.setState({ textAreaHeight: '14px' });
  }

  onChangeHandler = (event) => {
    this.setState({ textAreaHeight: '14px' });
    let messageForm = { ...this.state.messageForm };
    messageForm.message = event.target.value;
    this.setState({ messageForm: messageForm });
  };

  handleFormSubmit = (values, _actions) => {
    values.message = parseEmojis(values.message);
    this.setState({ isSendButtonDisabled: true }, () => {
      setTimeout(() => {
        this.setState({ isSendButtonDisabled: false });
      }, 1000);
    });
    this.props.onSendMessage(values);

    this.resetForm(_actions.resetForm);
  };

  handleEnterPressed = (e) => {
    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.props.handleSubmit(this.state.messageForm.message);
      this.resetForm();
    }
  };

  componentDidUpdate(_prevProps, prevState) {
    const {
      messageForm: { message },
    } = this.state;

    if (prevState.messageForm.message !== message) {
      this.setState({ textAreaHeight: `${this.textAreaRef.current.scrollHeight - 18}px` });
    }
  }

  render() {
    const { messageForm, textAreaHeight } = this.state;
    const { onFocus, handleSubmit } = this.props;
    return (
      <div className={styles.inputWrapper}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(this.state.messageForm.message);
            this.resetForm();
          }}
          className={styles.inputContainer}
        >
          <textarea
            onFocus={onFocus}
            onChange={(e) => this.onChangeHandler(e)}
            onKeyPress={(e) => this.handleEnterPressed(e)}
            name="message"
            className={styles.messageTextArea}
            rows={1}
            placeholder="New message to other players"
            maxLength={200}
            value={parseEmojis(this.state.messageForm.message)}
            ref={this.textAreaRef}
            style={{ height: textAreaHeight }}
          ></textarea>
          <button type="submit" className={cn(styles.sendButton)}>
            <i className="fas fa-share"></i>
          </button>
        </form>

        <div
          className={cn(styles.inputCounter, {
            [styles.isEmpty]: messageForm.message.length === 0,
            [styles.isFull]: messageForm.message.length === 200,
          })}
        >
          {messageForm.message.length > 0 ? `${messageForm.message.length}/200` : ''}
        </div>
      </div>
    );
  }
}

export default MessageInput;
