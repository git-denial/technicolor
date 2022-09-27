import React, {useState, useEffect} from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormGroup,
  CTextarea,
  CInput,
  CLabel,
  CSelect,
  CRow, CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {Collapse} from "@coreui/coreui";
import {Link, useParams} from "react-router-dom";
import Shipping from '../../models/Shipping'
import User from '../../models/User';
import {useHistory} from 'react-router-dom';

const BasicForms = ({match}) => {

  const {id} = useParams();

  const [currentUser, setCurrentUser] = useState({})
  const history = useHistory();

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [provinces, setProvinces] = useState([]);
  const [isProvinceSelected, setIsProvinceSelected] = useState(false)
  const [province, setProvince] = useState(null);
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);


  useEffect(async () => {
    let provinceArray = await getProvince();
  }, [])


  const submission = async () => {
    let provinceName, cityName;

    for (const i in provinces) {
      if (provinces[i].province_id === province) {
        provinceName = provinces[i].province;
      }
    }

    for (const i in cities) {
      if (cities[i].city_id === city) {
        cityName = cities[i].city_name;
      }
    }

    if (email === '' || email === undefined || email === null) {
      return alert('Email cannot be empty!');
    }

    if (province === '' || province === undefined || province === null || province === 0 || province === '0') {
      return alert('Province cannot be empty!');
    }

    if (address === '' || address === undefined || address === null) {
      return alert('Address cannot be empty!');
    }

    if (city === '' || city === undefined || city === null || city === 0 || city === '0') {
      return alert('City cannot be empty!');
    }

    if (zipCode === '' || zipCode === undefined || zipCode === null) {
      return alert('Zip code cannot be empty!');
    }

    if (confirmPassword !== password) {
      return alert('Password does not match!');
    }

    try {
      let submit = {
        email: email,
        address: address,
        zip_code: zipCode,
        city: cityName,
        full_name: name,
        password: password,
        province: provinceName
      }
      console.log(submit);

      let userModel = new User();
      let result = await userModel.register(submit);
      console.log(result)
      alert('Registration success!');
      return history.push('/users')

    } catch (e) {
      if (e.code === 'DUPLICATE_EMAIL') {
        return alert('User with this email has already been registered! Please choose another email.')
      }
      return alert('Error occurred!');
      console.log(e);
    }
  }


  const getProvince = async () => {
    try {
      const shippingModel = new Shipping();
      let result = await shippingModel.getProvince()

      console.log(result.rajaongkir.results);
      setProvinces(result.rajaongkir.results);

      return result.rajaongkir.results;
    } catch (e) {
      console.log(e)
    }
  }

  const getCities = async (id) => {
    try {
      const shippingModel = new Shipping();
      let result = await shippingModel.getCity(id)
      setCities(result.rajaongkir.results)
      console.log(result);
    } catch (e) {
      console.log(e)
    }
  }

  const onKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();

      submission();
    }
  }

  const Form = (
    <CForm
      action=""
      method="post"
      encType="multipart/form-data"
      className="form-horizontal"
    >
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Email</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="email-input"
            name="email-input"
            placeholder="Input email..."
            value={email}
            onKeyPress={onKeyPress}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          {/*<CFormText className="help-block">*/}
          {/*  Masukan Nama Lengkap*/}
          {/*</CFormText>*/}
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Full Name</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput

            placeholder="Input full name..."
            value={name}
            onKeyPress={onKeyPress}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {/*<CFormText className="help-block">*/}
          {/*  Masukan Nama Lengkap*/}
          {/*</CFormText>*/}
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="password-input">Password</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput

            placeholder="Input password..."
            value={password}
            onKeyPress={onKeyPress}
            type={'password'}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="password-input">Confirm Password</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            type={'password'}
            placeholder="Input confirm password..."
            value={confirmPassword}
            onKeyPress={onKeyPress}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="text-input">Alamat</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CTextarea
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            name="textarea-input"
            id="textarea-input"
            rows="3"
            placeholder="Input address..."
          />
          {/* <CFormText>This is a help text</CFormText> */}
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Provinsi</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CSelect
            name="selectLg"
            id="selectLg"
            onChange={async (e) => {
              console.log(e);
              await getCities(e.target.value);
              setProvince(e.target.value);
              setIsProvinceSelected(true)
              setCity(0);

            }}
          >
            <option value="0">Select Province...</option>
            {
              provinces.map((obj, key) => {
                return (<option value={obj.province_id}>
                  {obj.province}
                </option>)
              })
            }
          </CSelect>
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Kota</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          {
            isProvinceSelected &&
            <CSelect
              name="selectLg"
              id="selectLg"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
              }}
            >
              <option value="0">Select city</option>
              {
                cities.map((obj, key) => {
                  return (<option value={obj.city_id}>
                    {obj.city_name}
                  </option>)
                })
              }
            </CSelect>
          }
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Kode Pos</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Input zip code..."
          />
        </CCol>
      </CFormGroup>

    </CForm>
  )

  return (
    <>

      <CCollapse show={error} timeout={1000}>
        <CAlert color="danger">
          {error}
        </CAlert>
      </CCollapse>

      <CCollapse show={success} timeout={1000}>
        <CAlert color="success">
          {success}
        </CAlert>
      </CCollapse>

      <CRow>
        <CCol xs="12" md="12">
          <CCard>
            <CCardHeader>
              {id ? 'Perbarui' : 'Tambah'} User <br/>
              {/* <small> Elements</small> */}
              {id && <Link to={"/users"}><small>Kembali ke daftar user</small></Link>}
            </CCardHeader>
            <CCardBody>
              {Form}
            </CCardBody>
            <CCardFooter>
              <CButton
                onClick={() => {
                  submission()
                }}
                type="submit" size="sm" color="primary">
                <CIcon name="cil-save"/> Simpan
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default BasicForms;
