import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol, CCollapse,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CLabel,
  CInputGroupAppend, CModal, CModalHeader, CModalTitle, CModalBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Admin from "../../../models/Admin";
import Vendor from "../../../models/Vendor";

const Login = () => {
  // const [isLoginError, setLoginError] = useState(false)

  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    tokenLogin();
  }, [])

  /*

  const tokenLogin = async () => {
    let result = {};
    let admin = new Admin();
    if (localStorage.token || sessionStorage.token) {
      console.log('Token login initiated')
      result = await admin.tokenLogin();
      console.log('Logged in with token', result);
    }

    if (result.username !== undefined) {
      console.log(result)
      history.push('/admins');
    }

    console.log('Token not detected!')
  }

   */

  const tokenLogin = async () => {

    let result = {};

    let adminModel = new Admin();
    let vendorModel = new Vendor();

    if (localStorage.token || sessionStorage.token) {
      const loginAs = sessionStorage.getItem('loginAs') || localStorage.getItem('loginAs');
      console.log('Token login initiated')

      if(loginAs === 'admin') {
        result = await adminModel.tokenLogin();
        history.push('/users')

      } else {
        result = await vendorModel.tokenLogin();
        history.push('/my-products/' + result.id)
      }

      console.log('Logged in with token', result);
      console.log('Logged in as', loginAs)
    }
    console.log(result)

    console.log('Token not detected!')
  }

  const submit = async () => {
    if (!password) setErrors("Password cannot be blank");
    if (!username) setErrors("Username cannot be blank");


    if (username && password) {
      setErrors("");

      try {

        let role;

        for(let i = 0; i < username.length; i++){
          if(username[i] === '@'){
            role = 0;
            break;
          }
          role = 1;
        }

        let admin = new Admin();
        let body = {
          username: username,
          password: password,
          admin: role
        }
        let result = await admin.globalLogin(body)
        console.log(result);

        if (remember) {
          localStorage.token = result.token;
          localStorage.loginAs = result.role;
        } else {
          sessionStorage.token = result.token;
          sessionStorage.loginAs = result.role;
        }

        console.log('result', result);
        console.log('local storage token', localStorage.token);
        console.log('session storage token', sessionStorage.token);

        sessionStorage.token = result.token;
        sessionStorage.loginAs = result.role;
        localStorage.token = result.token;
        localStorage.loginAs = result.role;

        if(result.role === 'vendor'){
          sessionStorage.vendorId = result.id;
        }


        if (result.role === 'admin'){
          history.push('/users')
        }else if (result.role === 'vendor'){
          history.push('/my-products/' + result.id)
        }
      } catch (e) {
        console.log(e)
        if (e.error_message === "USERNAME_NOT_FOUND" || e.code === 'ADMIN_PASSWORD_WRONG' || e.code === 'UNAUTHORIZED' || e.error_message === 'EMAIL_NOT_FOUND') {
          return setErrors("Incorrect username or password")
        }
        setErrors('Error occured!')
      }
    }
  }


  const onKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();

      submit()
    }
  }


  return (
    <div className="c-app c-default-layout flex-row align-items-center">


      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        onKeyPress={onKeyPress}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password"
                              onKeyPress={onKeyPress}
                              onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroupText style={{
                      display: "flex",
                      flexDirection: "row"
                    }}>
                      <input
                        onChange={(e) => {
                          // console.log(e.target.value)
                          setRemember(!remember)
                        }}
                        type="checkbox" value={remember} id="defaultCheck1"/>
                      <label
                        style={{
                          marginLeft: 10,
                        }}
                        class="form-check-label">
                        Remember Me
                      </label>
                    </CInputGroupText>
                    <CCollapse
                      style={{marginTop: "1em"}}
                      show={errors} timeout={1000}>
                      <CAlert color="danger">{errors}</CAlert>
                    </CCollapse>
                    <CRow>
                      <CCol xs="10">
                        <br/>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={submit}
                        >Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )


}

export default Login
