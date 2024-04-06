import React, { Component } from 'react';
import '../../assets/css/Compiler.css';
import _ from "lodash"
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-prompt";
import 'ace-builds/src-noconflict/mode-csharp';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

import CopyPasteContentModel from './CopyPasteContentModel';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';

export default class ProgramResult extends Component {

    constructor(props) {
        let candidateId= window.location.pathname.replace('/panelist/program/result/', '')
        super(props);
        if(localStorage.getItem(candidateId)){
            sessionStorage.setItem(candidateId,localStorage.getItem(candidateId));
            sessionStorage.setItem('token',localStorage.getItem('token'));
            localStorage.removeItem(candidateId);
            sessionStorage.setItem('examId', localStorage.getItem('examId'))
            sessionStorage.setItem('email', localStorage.getItem('email'))
            localStorage.removeItem("examId")
            localStorage.removeItem("email")
        }
        let result = sessionStorage.getItem(candidateId);
        let data = JSON.parse(result);
        let submittedExam = _.filter(data, 'code')
        this.state = {
            email: sessionStorage.getItem("email"),
            examId: sessionStorage.getItem("examId"),
            questions: _.map(submittedExam, 'question'),
            instructions: '',
            questionIndex: 0,
            submittedExam: submittedExam,
            code: '',
            disabledPrev: 'true',
            disabledNext: 'false',
            language_id: submittedExam[0]?.language === 'java' ? 'java' : 'py',
            currentTestCase: [],
            examMonitor: {},
            copiedTextContents: '',
            openModal: false,
            openFBModal: false,
        }
    }

    componentWillMount() {
        let instructions = this.state.questions[0]?.question;
        this.setState({ instructions: instructions, currentTestCase: this.state.submittedExam[this.state.questionIndex]?.testCases })
        this.setInput()
        window.addEventListener("beforeunload", () => localStorage.removeItem(window.location.pathname.replace('/panelist/program/result/', '')));
        this.getExamMonitor()
        this.getCopiedContent()



    }


    getExamMonitor = () => {
        axios.get(`/api3/candidate/exam-monitor/${this.state.examId}/${this.state.email}`, { headers: authHeader() })
          .then(res => this.setState({ examMonitor: res.data.response }))
          .catch(e => errorHandler(e));
     }


    next = () => {
        let questionIndex = this.state?.questionIndex + 1;
        let instructions = this.state.questions[questionIndex]?.question;
        this.setState({ questionIndex: questionIndex, instructions: instructions }, () => { this.setInput() });
    }

    setInput = () => {
        this.setState({ code: this.state.submittedExam[this.state.questionIndex]?.code, currentTestCase: this.state.submittedExam[this.state.questionIndex]?.testCases })
    }

    previous = (e) => {
        let questionIndex = this.state.questionIndex - 1;
        let instructions = this.state.questions[questionIndex]?.question;
        this.setState({ questionIndex: questionIndex, instructions: instructions }, () => { this.setInput() });
    }
    getCopiedContent = () => {
        return _.filter(this.state.examMonitor?.copyPasteContent, cpy => cpy.questionId === this.state.submittedExam[this.state.questionIndex]?.question.id)


    }

    onClickOpenModel = (e) => {
        if (!this.state.openModal) {
            document.addEventListener("click", this.handleOutSideClick, false);
        } else {
            document.removeEventListener("click", this.handleOutSideClick, false)
        }
        this.setState({ openModal: !this.state.openModal })
    }

    handleOutSideClick = (e) => {
        if (e.target.className === "modal fade show") {
            this.setState({ openModal: !this.state.openModal })
        }
    }

    onCloseModal = () => {
        this.setState({ openModal: false });
    }

    render() {
        return (
            <>
                <div className="split left" style={{ maxWidth: '35rem' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h5 style={{ padding: '10px' }}>Question {this.state.questionIndex + 1}</h5>
                            </div>
                        </div>
                        <hr></hr>
                        <div className='row'>
                            <div className="col-md-12">
                                <div className='instructions' style={{fontFamily: 'Montserrat'}} dangerouslySetInnerHTML={{ __html: this.state.instructions }}></div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                </div>
                <div className="container">
                    <div className="split right" style={{ overflowY: 'auto', minWidth: '60%', maxWidth: '65%' }}>
                    <div className="row">
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div style={{ marginTop: "10px", marginLeft: "1rem" }}>
                                    <span style={{ color: "white" }}>Question {this.state.questionIndex + 1} of {this.state.submittedExam?.length}</span>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ padding: '10px' }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        < div
                                            onClick={(e) => this.previous(e)}
                                            className=" cursor-pointer"
                                            disabled={this.state.disabledPrev}
                                            title="Previous"
                                            style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px', float: 'right' }}
                                        >
                                            {this.state.questionIndex === 0 ? (""
                                            ) : (
                                                <div className="p-1" style={{ marginTop: '-15px' }}><button type='button' className='btn-sm btn-prev '>&laquo; Previous</button></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6" >
                                        <div
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                this.next(e);
                                            }}
                                            disable={this.state.disabledNext}
                                            title="Next"
                                            style={{ fontSize: "30px", color: "#5B6263", width: '90px', marginTop: '10px' }}
                                        >
                                            {this.state.questionIndex === this.state.questions.length - 1 ? (
                                                "") : (
                                                <div className="p-1" style={{ marginTop: '-15px' }}><button type='button' className='btn-sm btn-nxt'>Next &raquo;</button></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AceEditor style={{height: '75%', width: '95%', marginLeft: '10px', fontFamily: 'monospace' }}
                            mode={this.state.language_id}
                            theme="monokai"
                            value={this.state.code}
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={true}
                            readOnly={true}
                        />
                        <br />
                        <div className='row'>
                            <div className='col-md-8' style={{ paddingBottom: '.5rem' }}>
                                <button className='btn btn-sm btn-prev' style={{ marginLeft: "10px",fontFamily:'Montserrat'}} disabled={this.getCopiedContent().length === 0} onClick={this.onClickOpenModel}>View Copied Content</button>
                            </div>
                            <div className='col-md-4'>
                                <span style={{ color: "white", marginLeft: "10px" ,fontFamily:'Montserrat'}}>Total Testcases : {this.state.currentTestCase ? this.state.currentTestCase?.length : this.state.questions[this.state.questionIndex]?.input?.length}</span>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-8 col-md-8'>
                                <span style={{ color: "white", marginLeft: "10px",fontFamily:'Montserrat'}}>Tab Switch Count : {this.state.examMonitor?.tabSwitchCount}</span>
                            </div>
                            <div className='col-lg-4 col-md-4'>
                                <span style={{ color: "chartreuse", marginLeft: "10px",fontFamily:'Montserrat'}}>Testcases Passed : {_.filter(this.state.currentTestCase, f => f !== 'Failed').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.openModal ? (
                    <CopyPasteContentModel
                        questionId={this.state.questions[this.state.questionIndex]?.id} onCloseModal={this.onCloseModal} examMonitor={this.state.examMonitor}/>
                ) : ("")}
            </>
        );
    }
}
