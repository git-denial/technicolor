import React, {useState, useEffect} from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CLabel,
  CSelect,
  CRow, CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {Collapse} from "@coreui/coreui";
import {Link, useParams, useHistory} from "react-router-dom";
import VendorCategory from '../../models/VendorCategory'
// import moment from "moment";
import {FaAngleDown} from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai";
import {BiTrash} from "react-icons/bi";
import Shipping from "../../models/Shipping";
import Vendor from "../../models/Vendor";
import Cropper from "react-easy-crop";
// import Select, {components} from "react-select";
import sampleImage from '../../assets/Payment Receipt/Receipt1.jpg'
import FileUpload from "../../utils/FileUpload";
import Product from "../../models/Product";
import Categories from "../categories/Categories";


const VendorForm = ({match}) => {
  const history = useHistory();

  const {id} = useParams();
  const [collapsed, setCollapsed] = React.useState(true);
  const [showElements, setShowElements] = React.useState(true);

  const [currentUser, setCurrentUser] = useState({})

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [provinces, setProvinces] = useState([]);
  const [isProvinceSelected, setIsProvinceSelected] = useState(false)
  const [province, setProvince] = useState(null);
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [name, setName] = useState(null);
  const [isLogoHovered, setLogoHovered] = useState(false);
  const [logo, setLogo] = useState(null);
  const [vendorId, setVendorId] = useState(0)
  const [description, setDescription] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  const vendorModel = new Vendor();
  const submission = async () => {

    let submit = {
      email: email,
      name: name,
      city_code: city,
      phone_num: phoneNumber,
      description: description,
      logo_url: logo,
      password: password

    }

    if (submit.email === null || submit.email === '' || submit.email === undefined) {
      return alert('Email cannot be empty!');
    }

    if (submit.name === null || submit.name === '' || submit.name === undefined) {
      return alert('Name cannot be empty!');
    }

    if (submit.city_code === null || submit.city_code === '' || submit.city_code === undefined) {
      return alert('City cannot be empty!');
    }

    if (submit.phone_num === null || submit.phone_num === '' || submit.phone_num === undefined) {
      return alert('Phone number cannot be empty!');
    }

    if(submit.password === null || submit.password === '' || submit.password === undefined) {
      return alert('Password cannot be empty!');
    }

    if(submit.description === null || submit.description === '' || submit.description === undefined) {
      return alert('Description cannot be empty!');
    }

    if(submit.password !== confirmPassword){
      return alert('Password does not match!');
    }

    if (category === null || category === '' || category === undefined) {
      return alert('Category cannot be empty!');
    }

    try {
      let categoryModel = new VendorCategory();
      let result = await vendorModel.register(submit);
      console.log(result);

      console.log(category)
      let body ={
        id: category
      }
      let categoryResult = await categoryModel.addCategoryToVendor(result.id, body);
      console.log(categoryResult);
      alert('Data has been saved!');
      return history.push('/vendors')
    } catch (e) {
      if(e.code === 'DUPLICATE_EMAIL'){
        return alert('Vendor with this email has already been registered! Please choose another email.')
      }else if (e.code === 'INVALID_EMAIL'){
        return alert('Email format is invalid!')
      } else{
        return alert('Registration failed!')
      }
      console.log(e)
    }
  }

  useEffect(async () => {
    getCategories()
    getProvince()
  }, [])

  const getCategories = async () => {
    try{
      let categoryModel = new VendorCategory();

      let result = await categoryModel.getAll();
      console.log('Categories', result)
      setCategories(result);
    }catch (e) {
      console.log(e)
    }
  }

  const reset = async () => {

    setCurrentUser({
    })
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
              {id ? 'Edit' : 'Register'} Vendor <br/>
              <Link to={"/vendors"}><small>Back to vendor list</small></Link>
            </CCardHeader>
            <CCardBody>
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
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      placeholder="Input name..."
                      value={name}
                      onKeyPress={onKeyPress}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
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
                    <CLabel htmlFor="email-input">Phone Number </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="email-input"
                      name="email-input"
                      placeholder="Input phone number..."
                      value={phoneNumber}
                      onKeyPress={onKeyPress}
                      onChange={(event) => {
                        setPhoneNumber(event.target.value);
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Categories</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect
                      name="selectLg"
                      id="selectLg"
                      onChange={async (e) => {
                        setCategory(e.target.value)
                      }}
                    >
                      <option value="0">Select Category...</option>
                      {
                        categories.map((obj, key) => {
                          return (<option value={obj.id}>
                            {obj.name}
                          </option>)
                        })
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Province</CLabel>
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
                    <CLabel htmlFor="email-input">City</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {
                      isProvinceSelected &&
                      <CSelect
                        name="selectLg"
                        id="selectLg"
                        value={city}
                        onChange={(e)=>{
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
                    <CLabel htmlFor="email-input">Current Logo</CLabel>
                  </CCol>
                  {
                    logo ?
                      <CCol xs="12" md="9" style={{display: 'flex'}}>
                        <div style={{position: 'relative', display: 'flex', justifySelf: 'flex-start'}}>
                          <img
                            onMouseOver={() => setLogoHovered(true)}
                            onMouseLeave={() => setLogoHovered(false)}
                            onClick={()=>{
                              setLogo(null)
                            }}
                            src={logo} style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.125)',
                            filter: isLogoHovered ? 'brightness(.4)' : 'brightness(1)',
                            cursor: 'pointer'
                          }}/>
                          {isLogoHovered &&
                          <BiTrash
                            size={35}
                            color={'#dedede'}
                            style={{
                              cursor: 'pointer',
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}/>
                          }
                        </div>
                      </CCol>
                    : <CCol>No Image</CCol>
                  }
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Change Logo</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <FileUpload
                      onDrop={async (file) => {
                        try {
                          let vendorModel = new Vendor();
                          let formData = new FormData();
                          console.log(file[0])
                          formData.append('upload', file[0]);

                          let result = await vendorModel.uploadLogo(formData)
                          console.log('Results', result.location)
                          setLogo(result.location);

                        } catch (e) {
                          console.log(e)
                        }
                      }}

                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="textarea-input"
                      id="textarea-input"
                      rows="3"
                      placeholder="Input description..."
                      value={description}
                      onChange={(e)=>{
                        setDescription(e.target.value)
                      }}
                    />
                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                onClick={()=>submission()}
                type="submit" size="sm" color="primary">
                <CIcon name="cil-save"/> Save
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default VendorForm;
