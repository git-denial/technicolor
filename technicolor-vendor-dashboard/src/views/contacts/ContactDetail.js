import React, {useState, useEffect} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CForm, CFormGroup, CFormText, CInput, CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader, CModalTitle,
  CRow, CSpinner
} from '@coreui/react'
import ContactModel from "../../models/Contact";
import moment from "moment";


const Contact = ({match}) => {
  const history = useHistory();
  useEffect(() => {
    getContactDetail();
  }, [])

  const getContactDetail = async () => {
    const contactModel = new ContactModel();
    try {
      let result = await contactModel.getById(match.params.id);
      console.log(result);
      setContactDetail(result);
    } catch (e) {
      setIsLoading(false)
      return alert('Connection Failed!')
    }
    setIsLoading(false);
  }

  const [contactDetail, setContactDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true)


  return (
    <CRow>
      <CCol lg={12}>
        <CCard>
          <CCardHeader>
            <div>Contact Detail</div>
            <Link to={"/contacts"}><small>Back to contact list</small></Link>
          </CCardHeader>
          <CCardBody>

            <table className="table table-striped table-hover">
              <tbody>
              <tr>
                <td style={{fontWeight:'bold'}}>Id</td>
                <td>{contactDetail.id}</td>
              </tr>

              <tr>
                <td style={{fontWeight:'bold'}}>Name</td>
                <td>{contactDetail.name}</td>
              </tr>
              <tr>
                <td style={{fontWeight:'bold'}}>Email</td>
                <td>{contactDetail.email}</td>
              </tr>
              <tr>
                <td style={{fontWeight:'bold'}}>Message</td>
                <td>{contactDetail.message}</td>
              </tr>
              <tr>
                <td style={{fontWeight:'bold'}}>User Id</td>
                <td>{contactDetail.user_id}</td>
              </tr>
              <tr>
                <td style={{fontWeight:'bold'}}>Phone Number</td>
                <td>{contactDetail.phone_number}</td>
              </tr>

              <tr>
                <td style={{fontWeight:'bold'}}>Created At</td>
                <td>{moment(contactDetail.created_at).format('DD MMM YYYY, hh:mm')}</td>
              </tr>
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Contact
