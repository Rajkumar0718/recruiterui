import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { authHeader, errorHandler } from '../../api/Api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
const StyledCKEditorWrapper = styled.div`
  .ck-editor__editable {
    &.ck-rounded-corners.ck-editor__editable_inline.ck-focused {
      overflow-y: auto;
      height: 12rem;
    }
    &.ck-rounded-corners.ck-editor__editable_inline.ck-blurred {
      overflow-y: auto;
      height:  12rem;
    }

  }
  .ck .ck-editor__main {
    height: 206px !important;
}
`;
const PanelistPopup = (props) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [panelistCandidateStatus, setPanelistCandidateStatus] = useState('');
  const [panelistFeedBack, setPanelistFeedBack] = useState('')

  useEffect(() => {
    setId(props.candidate.id);
    setName(props.candidate.name);
    setPanelistCandidateStatus(props.candidate.panelistCandidateStatus);
    setPanelistFeedBack(props.candidate.panelistFeedBack);
  }, [props.candidate])
  const handleInput = (event, name) => {
    if (name === 'panelistCandidateStatus') {
      setPanelistCandidateStatus(event.target.value);
    }
  }
  const handleSubmit = () => {
    axios.put(`/api2/superadmin/panelist/feedback`, { id, name, panelistCandidateStatus, panelistFeedBack }, { headers: authHeader() })
      .then(res => {
        toast.success("Feedback Sent Successfully!");
        props.onCloseModal();
      })
      .catch(error => {
        errorHandler(error);
      });
  };
  const handleChange = (event, editor) => {
    const data = editor.getData();
    setPanelistFeedBack(data);
};
  return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
      <div className="col-md-8" style={{ margin: 'auto' }}>
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#808080' }}>
          <div className="modal-header" style={{ backgroundColor: '#808080', height: "4rem" }}>
            <h5 className="modal-title" style={{ color: 'white' }}>Feedback</h5>
            <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal" style={{ border: "none", position: "relative", bottom: "5px", height: "3.5rem", backgroundColor: '#808080' }}>&times;</button>
          </div>
          <div className="row" style={{ margin: '10px' }}>
            <div className="col-md" style={{ maxHeight: '550px', overflowY: 'auto' }} >
              Name: {name.split("(")[0]}
              <hr></hr>
              <div className="status">
                <div className="column" style={{display:"flex",flexDirection:"row"}}>
                  <div style={{ paddingBottom: '10px' }}>
                    <label>Status:</label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="customRadioInline1"
                      name="customRadioInline1"
                      className="custom-control-input"
                      checked={panelistCandidateStatus === "Selected"}
                      value="Selected"
                      onChange={(event) => handleInput(event, "panelistCandidateStatus")}
                      style={{position:"relative",left:"1rem"}}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadioInline1"
                      style={{position:"relative",left:"1rem"}}
                    >
                      Selected
                    </label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="customRadioInline2"
                      name="customRadioInline1"
                      className="custom-control-input"
                      checked={panelistCandidateStatus === "Rejected"}
                      value="Rejected"
                      onChange={(event) => handleInput(event, "panelistCandidateStatus")}
                      style={{position:"relative",left:"1.5rem"}}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadioInline2"
                      style={{position:"relative",left:"2rem"}}
                    >
                      Rejected
                    </label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      id="customRadioInline3"
                      name="customRadioInline1"
                      className="custom-control-input"
                      checked={panelistCandidateStatus === "Not_Show"}
                      value="Not_Show"
                      onChange={(event) => handleInput(event, "panelistCandidateStatus")}
                      style={{position:"relative",left:"2.3rem"}}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadioInline3"
                      style={{position:"relative",left:"2.7rem"}}
                    >
                      No Show
                    </label>
                  </div>
                </div>
              </div>

              <hr></hr>
              <label>Feedback:</label>
              <StyledCKEditorWrapper>
              <CKEditor
                editor={ClassicEditor}
                data={panelistFeedBack || ""}
                onInit={editor => {

                }}
                onChange={handleChange}
                config={{
                  removePlugins: ['elementspath'],
                  resize_enabled: false
                }}
              />
              </StyledCKEditorWrapper>
              <div className="form-group row" style={{ marginTop: '10px' }}>
                <div className="col-md-10"></div>

                {!props.candidate.panelistCandidateStatus && !props.candidate.panelistFeedBack ? <div className="col-md-2">
                  <button className="btn btn-secondary" onClick={() => { handleSubmit() }}>Submit</button>
                </div> : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelistPopup
