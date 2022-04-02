import React, { Component } from 'react';
import styles from './styles.module.scss';

export default class DaySeparator extends Component {
  render() {
    const { date } = this.props;
    return (
      <div className={styles.separatorWrapper}>
        <div className={styles.separator}></div>
        <div className={styles.label}>{date.toString()}</div>
        <div className={styles.separator}></div>
      </div>
    );
  }
}
