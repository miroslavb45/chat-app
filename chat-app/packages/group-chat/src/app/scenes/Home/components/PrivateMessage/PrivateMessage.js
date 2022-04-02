import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPrivateMessagingAction } from './actions';
import styles from './styles.module.scss';

class PrivateMessage extends Component {
  componentDidMount() {
    this.props.dispatch(getPrivateMessagingAction(this.props.id));
  }

  render() {
    return <div className={styles.wrapper}>{this.props.messaging}</div>;
  }
}

const mapStateToPros = (state, props) => ({
  messaging: state?.messaging[props.id],
});

export default connect(mapStateToPros)(PrivateMessage);
