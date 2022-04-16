import React, { Component } from 'react';
import styles from './styles.module.scss';

export default class CallAction extends Component {
  render() {
    return (
      <div onClick={this.props.onClick} className={styles.wrapper} style={{ background: this.props.disable && '#ED3232' }}>
        <div className={styles.icon}>{this.props.icon}</div>
      </div>
    );
  }
}
