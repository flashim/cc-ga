import React from 'react';
import { Reflux } from "../util/Utils";
import AppStore from "../store/AppStore";
import { Action, Validation } from "../actions/AppActions";


class EditQuestionView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AppStore;
    }

    handleQuestionChange(e) {
        Validation.changeQuestionField(e.target.value);
    }

    handleSkillChange(field, e) {
        Validation.changeField(field, e.target.value);
    }

    handleOptionTextChange(id, e) {
        Validation.changeOptionField(id, e.target.value);
    }

    handleRadioChange(id) {
        Validation.changeOptionCorrect(id);
    }

    render() {
        return (

            <div className="container" id="editquestion">
                <div className="game-auth-nxtpage">
                    <div className="top-header">
                        <h4>Game Authoring - Cricket Challenge</h4>
                        <button className="btn" onClick={() => { Action.editTitle() }}>
                            Edit Title &amp; Description
                        </button>
                    </div>
                    <div className="section">
                        <div className="left-question-panel">
                            <p>Question Number: {this.state.qIndex + 1}</p>
                        </div>
                        <div className="middlecontent-nxtpage">
                            <div className="game-title">
                                <h4>Question Stem</h4>
                                <input type="text" onChange={this.handleQuestionChange.bind(this)}
                                    value={this.state.qBank[this.state.qIndex].qtag} />
                            </div>
                            <div className="game-des">
                                <h4>Instruction to Students</h4>
                                <input type="text"
                                    value={this.state.fields.skill}
                                    onChange={this.handleSkillChange.bind(this, "skill")} />
                            </div>
                            <div className="questionblock">
                                <h4>Answer Choices</h4>
                                <h5>Please also select one choice as the correct answer, by clicking on <input type="radio" /> next to it.</h5>
                            </div>

                            <form>
                                <div className="answer-option">
                                    <ul>
                                        {this.state.qBank[this.state.qIndex].options.map((opt, idx) => (
                                            <div key={idx}>
                                                <input type="radio"
                                                    checked={opt.correctans}
                                                    onChange={this.handleRadioChange.bind(this, idx)}
                                                    disabled={(opt.txt === "") ? true : false} />
                                                <input type="text"
                                                    value={opt.txt}
                                                    onChange={this.handleOptionTextChange.bind(this, idx)} />
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="footer-nxtpage">
                        <div className="nav-btn">
                            <button className={(this.state.qIndex === 0) ? "disabled" : "btn"}
                                onClick={() => { if (this.state.qIndex !== 0) Action.prev() }}>
                                &#706; Previous Question
                            </button>&nbsp;&nbsp;
                            <button className="btn" onClick={() => { Action.next() }}>
                                Next Question &#707;
                            </button>
                        </div>

                        <div className="rightsidebtn">
                            <button className={(this.state.qBank.length > 1) ? "btn" : "hide"}
                                onClick={() => { Action.deleteQuestion() }}>
                                Delete this Question
                            </button>&nbsp;&nbsp;

                            <button className="btn" onClick={() => { Action.draft() }}>
                                Save As Draft
                            </button>&nbsp;&nbsp;
                            <button className="btn" onClick={() => { Action.save() }}>
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

export default EditQuestionView