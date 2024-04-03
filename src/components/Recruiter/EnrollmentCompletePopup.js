import React from 'react'
import Thanku from '../../assets/images/Thanku.png';
const EnrollmentCompletePopup = (props) => {
  return (
    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#23758f' }}>
          <div className="modal-header" style={{ backgroundColor: '#23758f' }}>
            <h5 className="modal-title" style={{ color: 'white' }}></h5>
          </div>
          <div style={{ height: '280px' }} className="modal-body">
            <form onSubmit={props.onCloseModalAdd}>
              <div className="form-row">
                <img src={Thanku} alt="Thank you" style={{ marginLeft: '100px' }} className="sidenav-img" />
              </div>
              <div style={{ marginTop: '30px' }}>
                <h5>Further information will be informed through mail</h5>
              </div>
              <div className="form-group row">
                <div className="col-md-10">
                  <button type="submit" className="btn btn-primary"
                    style={{ backgroundColor: '#23758f', color: 'white', marginLeft: '190px', width: '75px', marginTop: '20px' }}>OK</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentCompletePopup
