import React, { Component } from 'react';
import styles from './styles.module.scss';

export default class DropdownItem extends Component {
  render() {
    const { icon, label, onClick } = this.props;
    return (
      <div className={styles.wrapper} onClick={onClick}>
        {icon}
        <div className={styles.label}>{label}</div>
      </div>
    );
  }
}
