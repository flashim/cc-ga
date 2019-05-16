import { Action, ChangeComp, Validation } from "../actions/AppActions";
import AppStates from "../constants/AppStates";
import ErrorMsg from "../constants/ErrorMsg";
import GameConst from "../constants/GameConst";
import { ArrayUtil, Reflux, XMLWriter } from "../util/Utils";

class AppStore extends Reflux.Store {
    constructor() {
        super();
        this.state = {

            editGame: false,
            compState: AppStates.DEFAULT,

            qIndex: 0,
            qBank: [],
            qArr: [''],

            fields: {
                "skill": "",
                "gTitle": "",
                "gDesc": "Score the maximum number of runs as quickly as you can to win the cricket championship! You need to play two innings. Simply choose the correct option from the ones given and click Strike. For a correct response, you score runs. The faster you respond, the more runs you score. For an incorrect response, you lose a wicket. Are you a cricket star? Let's find out!",
                "qData": ""
            },
            error: {
                "theme": "popup-box-orange",
                "show": false,
                "msg": "",
                "ok": true,
                "okFunc": "",
                "cancel": false,
                "cancelFunc": ""
            }
        };
        this.listenables = [Action, ChangeComp, Validation];
    }

    //.. Validations--------------------------------------------------------------------------
    isFormValid(formName) {
        let formIsValid = true;
        if (this.state.fields[formName] === "") {
            formIsValid = false;
            let fieldName = (formName === "gTitle") ? ErrorMsg.GAME_TITLE : ErrorMsg.GAME_DESC;
            Validation.error(fieldName);
        }
        return formIsValid
    }

    isQuestionValid(showError) {
        let formIsValid = true;
        if (this.state.qBank[this.state.qIndex].qtag === "") {
            formIsValid = false;
            if (showError) {
                Validation.error(ErrorMsg.QUESTION);
            }
        }
        return formIsValid
    }

    isOptionsValid(showError) {
        let formIsValid = true;

        let _qbank = this.state.qBank;
        let hasAnswer = false;
        let optArr = [];

        _qbank[this.state.qIndex].options.forEach((opt, id) => {
            if (opt.txt !== "") {
                optArr.push(opt.txt);
            }
            if (opt.correctans) {
                hasAnswer = true;
            }
        });

        if (optArr.length < GameConst.OPTIONS_REQUIRED) {
            formIsValid = false;
            if (showError) {
                Validation.error(ErrorMsg.OPTION_MIN);
            }
            return formIsValid
        }

        if (!hasAnswer) {
            formIsValid = false;
            if (showError) {
                Validation.error(ErrorMsg.OPTION_CORRECT + (this.state.qIndex + 1));
            }
            return formIsValid
        }

        if (ArrayUtil.hasDuplicates(optArr)) {
            formIsValid = false;
            if (showError) {
                Validation.error(ErrorMsg.OPTION_DIFF);
            }
            return formIsValid
        }

        return formIsValid
    }

    isQuestionSetValid(param) {
        return (this.isQuestionValid(param) && this.isOptionsValid(param))
    }
    //.. Validations ends ---------------------------------------------------------------------

    //.. create question object
    createQuestionObject() {

        let _qtag = (this.state.qIndex < this.state.qArr.length) ? this.state.qArr[this.state.qIndex] : "";

        return {
            "qtag": unescape(_qtag),
            "options": [
                {
                    "txt": "",
                    "correctans": false
                }, {
                    "txt": "",
                    "correctans": false
                }, {
                    "txt": "",
                    "correctans": false
                }, {
                    "txt": "",
                    "correctans": false
                }
            ]
        }
    }

    addBlankQuestionToBank() {
        let q = this.state.qBank;
        q.push(this.createQuestionObject());
        this.setState({ qBank: q });
    }

    setErrorObject(_msg = "", _okFunc = "closeError", _cancel = false, _cancelFunc = "", _theme = "popup-box-orange") {
        this.setState({
            error: {
                "theme": _theme,
                "show": true,
                "msg": _msg,
                "ok": true,
                "okFunc": _okFunc,
                "cancel": _cancel,
                "cancelFunc": _cancelFunc
            }
        });
    }

    deleteUnsavedQuestion() {
        let q = this.state.qBank;
        q.pop();
        this.setState({ qBank: q });
    }

    saveXMLFile(fileName, xmlstr) {
        var file = new Blob([xmlstr], {
            type: 'text/xml'
        });

        var link = document.createElement("a"); // Or maybe get it from the current document
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        //link.innerHTML = "Click here to download the file";
        //document.body.appendChild(link); // Or append it whereever you want
        //window.open(URL.createObjectURL(file)); //opening file in browser 
        window.open(link);
        link.click();
    }

    //.. EVENT CALLS ----------------------------------------------------------------------------

    onProceed(e) {

        e.preventDefault();

        if (this.isFormValid("gTitle") && this.isFormValid("gDesc")) {
            if ((this.state.qBank.length === 0) && (this.state.qBank[0] === undefined)) {
                this.setState({ editGame: true });
                this.addBlankQuestionToBank();
            }
            ChangeComp.stateTo(AppStates.EDIT_QUESTION);
        }
    }

    onEditTitle() {
        if (!this.isQuestionSetValid(false) && !(this.state.qIndex === 0)) {
            //this.setErrorObject(ErrorMsg.UNSAVED_QUESTION, 'confirmedEditTitle', true, 'closeError');
            this.setErrorObject(ErrorMsg.UNSAVED_QUESTION);
            return
        } //else { 
        ChangeComp.stateTo(AppStates.EDIT_TITLE);
        //}
    }

    onConfirmedEditTitle() {
        /* this.deleteUnsavedQuestion();
        this.onCloseError();
        ChangeComp.stateTo(AppStates.EDIT_TITLE); */
    }

    onPrev() {

        /* let qs = this.isQuestionSetValid(true);

        if (qs) {
            this.setState({
                qIndex: --this.state.qIndex
            });
        } */

        if (!this.isQuestionSetValid(false)) {
            this.setErrorObject(ErrorMsg.UNSAVED_QUESTION);
            return
        }

        this.setState({
            qIndex: --this.state.qIndex
        });
    }

    onConfirmedPrev() {
        /* this.deleteUnsavedQuestion();
        this.onCloseError();
        this.setState({
            qIndex: --this.state.qIndex
        }); */
    }

    onNext() {

        if (this.isQuestionSetValid(true)) {
            this.setState({
                qIndex: ++this.state.qIndex
            });
            if (this.state.qIndex === this.state.qBank.length) {
                this.addBlankQuestionToBank();
            }
        }
    }

    onDeleteQuestion() {
        this.setErrorObject(ErrorMsg.DELETE_QUESTION, 'confirmedDeleteQuestion', true, 'closeError');
    }

    onConfirmedDeleteQuestion() {
        let new_state = Object.assign({}, this.state);
        ArrayUtil.removeAtIndex(new_state.qBank, new_state.qIndex);
        if (new_state.qIndex !== 0) {
            new_state.qIndex--;
        }
        this.setState(new_state);
        this.onCloseError();
    }

    onDraft() {
        this.setErrorObject(ErrorMsg.DRAFT_GAME, 'confirmDraft', true, 'closeError', 'popup-box-green');
    }

    onConfirmDraft() {
        this.onCloseError();
    }

    onSave() {

        //console.log("qArr-", this.state.qArr.length, " qBank-", this.state.qBank.length, this.isQuestionSetValid(false))

        let qs = this.isQuestionSetValid(true);
        if (qs) {

            if (this.state.qBank.length < this.state.qArr.length) {
                this.setErrorObject(ErrorMsg.UNEDITED_QUESTION);
                return
            }

            if (this.state.qBank.length < GameConst.QUESTIONS_REQUIRED) {
                this.setErrorObject(ErrorMsg.PUBLISH_QUESTION);
                return
            }
            this.setErrorObject(ErrorMsg.PUBLISH_GAME, 'publish', true, 'closeError', 'popup-box-green');
        }
    }

    onPublish() {

        this.onCloseError();

        let xw = new XMLWriter();

        xw.startDocument();

        //.. Game Content
        xw.startElement('GameContent');
        xw.writeAttribute('id', 'game-498c6f09-fa75-474b-99d0-9bbfe97c78d6');
        xw.writeAttribute('gameTemplateId', 'GT-cc001-en');
        xw.writeAttribute('skinId', 'bb001');

        //.. metatdata
        xw.startElement('metadata');

        xw.startElement('keywords');
        xw.text('Algebraic expressions, polynomials, operations on polynomials, binomial, degree, product, coefficient, expansion, zero');
        xw.endElement();


        xw.startElement('title');
        xw.text(this.state.fields.gTitle);
        xw.endElement();


        xw.startElement('description');
        xw.text('Completing sentences');
        xw.endElement();

        xw.startElement('language');
        xw.text('English');
        xw.endElement();

        xw.startElement('gameRules');
        xw.writeAttribute('teamMode', 'true');
        xw.writeAttribute('timerMode', 'true');
        xw.writeAttribute('passMode', 'false');
        xw.writeAttribute('randamizeQmode', 'false');
        xw.endElement();


        xw.startElement('dependent');
        xw.startElement('file');
        xw.writeAttribute('src', ' ');
        xw.endElement();
        xw.endElement();
        xw.endElement();
        //.. end of metadata

        //.. start of gamedata
        xw.startElement('Gamedata');
        xw.startElement('GameEdge');
        xw.startElement('descriptionTxt');
        xw.writeCData(this.state.fields.gDesc);
        xw.endElement();

        xw.startElement('game');
        xw.writeAttribute('template', ' ');
        xw.writeAttribute('variation', 'addbubbles');
        xw.startElement('templatesettings');
        xw.endElement();


        xw.startElement('questions');

        //.. add questions
        //console.log("qBank ", this.state.qBank);
        this.state.qBank.forEach((el, id) => {
            xw.startElement('question');
            xw.writeAttribute('skill', this.state.fields.skill);

            //.. qtag
            xw.startElement('qtag');
            xw.writeCData(el.qtag);
            xw.endElement();

            //.. options

            el.options.forEach((opt) => {
                //console.log(opt);
                if (opt.txt !== "") {
                    xw.startElement('option');
                    if (opt.correctans) {
                        xw.writeAttribute('correctans', 'true');
                    }
                    xw.writeCData(opt.txt);
                    xw.endElement();
                }
            });

            xw.endElement();
            //console.log(id, el);
        });


        xw.endElement();

        xw.endDocument();

        this.saveXMLFile("cricketchallenge.xml", xw.toString());
    }


    onCloseError() {
        let err = this.state.error;
        err["show"] = false;
        this.setState(err);
    }

    onError(value) {
        this.setErrorObject(value);
    }

    onStateTo(value) {
        this.setState({ compState: value });
    }

    onChangeField(key, value) {
        let fields = this.state.fields;
        fields[key] = value;
        this.setState(fields);
    }

    onChangeBulkQuestionField(key, value) {
        let new_state = Object.assign({}, this.state);
        new_state.fields = this.state.fields;
        new_state.fields[key] = value;
        new_state.qArr = escape(this.state.fields.qData).split('%0A');
        this.setState(new_state);
    }


    onChangeQuestionField(value) {
        let _qbank = this.state.qBank;
        _qbank[this.state.qIndex].qtag = value;
        this.setState(_qbank);
    }

    onChangeOptionField(index, value) {
        let _qbank = this.state.qBank;
        _qbank[this.state.qIndex].options[index].txt = value;
        this.setState(_qbank);
    }

    onChangeOptionCorrect(index) {
        let _qbank = this.state.qBank;
        _qbank[this.state.qIndex].options.forEach((opt, id) => {
            opt.correctans = (id === index) ? true : false
        });
        this.setState(_qbank);
    }

    //.. EVENT CALLS ENDS -----------------------------------------------------------------------
}

//AppStore.id = 'qBank';

export default AppStore;