import React, { Component } from 'react';
import { AuthenticatedRoute } from '../../app';
import { Create } from './components/Create';
import Select from './components/Select/Select';

export default class Workspace extends Component {
  render() {
    return (
      <>
        <AuthenticatedRoute exact path="/workspaces/new" component={Create} />
        <AuthenticatedRoute exact path="/workspaces" component={Select} />
      </>
    );
  }
}
