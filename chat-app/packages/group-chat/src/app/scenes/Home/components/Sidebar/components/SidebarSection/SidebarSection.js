import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { Component } from 'react';
import styles from './styles.module.scss';

export default class SidebarSection extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{this.props.title}</div>
          {this.props.addIcon && (
            <div className={styles.addButton}>
              <AddCircleOutlineIcon className={styles.addButton} onClick={this.props.onClick} />
            </div>
          )}
        </div>
        <div className={styles.separator}></div>
      </div>
    );
  }
}
