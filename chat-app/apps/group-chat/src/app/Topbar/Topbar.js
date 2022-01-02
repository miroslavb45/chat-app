import React from 'react';
import { Link } from 'react-router-dom';


function Topbar() {
  return (
    <div>
      <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/logout">Logout</Link>
      {/* <Link to="/signup">SignUp</Link> */}
    </div>
  );
}

export default Topbar;
