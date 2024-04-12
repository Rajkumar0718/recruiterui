import _ from 'lodash';
import { useEffect, useState } from "react";

function CopyPasteContentModel(props) {

  const [copiedContents, setCopiedContents] = useState([]);
  const dottedContent = "\n\n"
  let examMonitor=props.examMonitor

  useEffect(() => {
    let monitor = _.uniqBy(examMonitor.copyPasteContent, 'time')
    let copiedContent = _.orderBy(_.filter(monitor, (copy) => copy.questionId === props.questionId), ["time"]);
    setCopiedContents(copiedContent);

  }, [props])

  return (
    <div >
      <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', backgroundColor: 'rgba(0,0,0,0.90)', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
        <div className="col-md-8">
          <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#3b489e', borderRadius: "32px" }}>
            <div className="modal-header" style={{ padding: "2rem", paddingBottom: "0rem", border: "none" }}>
              <h5 className="setting-title" >Copied Content</h5>
              <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body" style={{ height: "calc(100vh - 150px)" }}>
              <div className='container' style={{ height: '100%' }}>
                <div className='row' style={{ height: '100%' }}>
                  <div className='col-lg-12'>
                    <textarea style={{ height: "100%", width: "inherit", border: "none", color: 'red' }} value={_.join(_.map(copiedContents, copy => copy.content), dottedContent)} readOnly={true} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CopyPasteContentModel;
