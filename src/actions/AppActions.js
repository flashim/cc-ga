import { Reflux } from "../util/Utils";

//var action = Reflux.createAction();
var Action = Reflux.createActions([
    'proceed',
    'editTitle', 'confirmedEditTitle',
    'prev', 'next', 'confirmedPrev',
    'deleteQuestion', 'confirmedDeleteQuestion',
    'draft', 'confirmDraft',
    'save', 'publish',
    'closeError']);

var ChangeComp = Reflux.createActions(['stateTo']);
var Validation = Reflux.createActions(['error', 'changeField',
'changeBulkQuestionField', 'changeQuestionField', 'changeSkillField', 'changeOptionField', 'changeOptionCorrect']);

export { Action, ChangeComp, Validation }

//ChangeComp.stateTo(ComponentStates.EDIT_TITLE);
// Reflux.GlobalState.qBank