import React from 'react';

import AppStates from "./constants/AppStates";
import AppStore from "./store/AppStore";

import DefaultView from "./components/DefaultView";
import EditQuestionView from "./components/EditQuestionView";
import ErrorView from './components/ErrorView';

var Reflux = require('reflux');

class App extends Reflux.Component {

  constructor(props) {
    super(props);
    this.store = AppStore;
  }

  getComponent() {

    let comp;

    switch (this.state.compState) {
      case AppStates.EDIT_TITLE:
        comp = <DefaultView />
        break;

      case AppStates.EDIT_QUESTION:
        comp = <EditQuestionView />
        break;

      default:
        comp = <DefaultView />
    }
    return comp
  }

  render() {
    return (
      <div className="App">
        {/* <div><p>Currently using React<code>{React.version} and ENV is {process.env.NODE_ENV}</code>.</p></div> */}
        <div>{this.getComponent()}</div>
        <ErrorView />
      </div>
    );
  }
}

export default App;
