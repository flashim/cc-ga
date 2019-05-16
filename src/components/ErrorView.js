import React from 'react';
import { Reflux } from "../util/Utils";
import AppStore from "../store/AppStore";
import { Action } from "../actions/AppActions";

class ErrorView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AppStore;
    }

    okClick(e) {
        //console.log("ok clicked ", this.state.error.okFunc);
        Action[this.state.error.okFunc]();
    }

    cancelClick(e) {
        //console.log("cancel clicked");
        Action[this.state.error.cancelFunc]();
    }

    render() {
        if (this.state.error.show) {
            return (
                <div className="popup-window">
                    <div className={this.state.error.theme}>
                        <h5>{this.state.error.msg}</h5>
                        <div className="bottom-btn">
                            <button className="okbtn" onClick={this.okClick.bind(this)}>
                                Ok
                            </button>
                            <button className={(this.state.error.cancel) ? "cancelbtn" : "hide"}
                                onClick={this.cancelClick.bind(this)}>
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            );
        } else {
            return null
        }
    }

}

export default ErrorView;