import React, { Component } from 'react';
import styles from './styles.module.scss';

import { LibraryBooks } from '@mui/icons-material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default class SidebarSection extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.addButton}>
            <AddCircleOutlineIcon className={styles.addButton} onClick={this.props.onClick} />
          </div>
        </div>
        <div className={styles.separator}></div>
      </div>
    );
  }
}
