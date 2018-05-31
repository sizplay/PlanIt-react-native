import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Main from './components/Root';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}
