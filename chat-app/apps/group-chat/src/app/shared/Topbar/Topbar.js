import { getAuth } from 'firebase/auth';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

function Topbar() {
  const auth = getAuth();

  return (
    <div className={styles.wrapper}>
      <div className={styles.email}>
        Welcome, <span>{auth.currentUser.email}</span>
      </div>
      <div className={styles.appTitle}>CHAT APPLICATION</div>
      <div className={styles.logout}>
        <Link to="/logout">Logout</Link>
      </div>
    </div>
  );
}

export default Topbar;
