import React from 'react';
import { Reflux } from "../util/Utils";
import AppStore from "../store/AppStore";
import { Action, Validation } from "../actions/AppActions";


class DefaultView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AppStore;
    }

    handleChange(field, e) {
        Validation.changeField(field, e.target.value);
    }

    handleBulkQuestionChange(field, e) {
        Validation.changeBulkQuestionField(field, e.target.value);
    }

    render() {
        return (

            <div className="container" id="default">
                <div className="game-auth">
                    <div className="top-header">
                        <h4>Game Authoring - Cricket Challenge</h4>
                    </div>
                    <div className="middlecontent">
                        <div className="game-title">
                            <h4>Game Title</h4>
                            <div className="requiredfields">(Required)</div>
                            <input refs="gTitle" type="text"
                                onChange={this.handleChange.bind(this, "gTitle")}
                                value={this.state.fields["gTitle"]} />
                        </div>
                        <div className="game-des">
                            <h4>Game Description</h4>
                            <div className="requiredfields">(Required)</div>
                            <textarea refs="gDesc" type="text"
                                onChange={this.handleChange.bind(this, "gDesc")}
                                value={this.state.fields["gDesc"]}
                                rows="5" cols="70">
                            </textarea>
                        </div>

                        <div className={(this.state.editGame) ? "hide" : "questionblock"}>
                            <h4>Enter or Copy-Paste all your Questions.</h4>
                            <div className="optionalfields">(Optional)</div>

                            <div className="copypastearea">
                                <div className="num-stepper">
                                    <ol>
                                        {this.state.qArr.map((opt, idx) => (
                                            <li key={idx}></li>
                                        ))}
                                    </ol>
                                </div>

                                <textarea type="text" name="message"
                                    onChange={this.handleBulkQuestionChange.bind(this, "qData")}
                                    value={this.state.fields["qData"]}
                                    rows="5" cols="100"></textarea>

                            </div>

                            <h5>(You can collectively enter all your questions and click Proceed to select the distractors and correct
                                    answer.)</h5>
                        </div>


                    </div>
                    <div className="footer">
                        <button className="btn" onClick={(e) => { Action.proceed(e) }}>
                            Proceed &#707;
                        </button>
                    </div>

                </div>
            </div>
        );
    }

}

export default DefaultView;

