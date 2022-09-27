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
import {AiOutlineCheck, AiOutlineClose} from "react-icons/ai";
import {BiTrash} from "react-icons/bi";
import FileUpload from "../../utils/FileUpload";
import Product from "../../models/Product";

const ProductCreate = ({match}) => {
  const {id} = useParams();
  const history = useHistory();

  const [currentUser, setCurrentUser] = useState({})

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isMainPictHovered, setMainPictHovered] = useState(false);
  const [productPictHoveredIdx, setProductPictHoveredIdx] = useState(null);


  const [name, setName] = useState(null)
  const [price, setPrice] = useState(null)
  const [category, setCategory] = useState(null)
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [frontImage, setFrontImage] = useState([])
  const [description, setDescription] = useState(null);
  const [isAvailable, setAvailable] = useState(false);
  const [weight, setWeight] = useState(null);
  const [vendorId, setVendorId] = useState(0);
  const [file, setFile] = useState(null);
  const [sizeDescription, setSizeDescription] = useState(null);
  const [sizeOption, setSizeOption] = useState(null)
  const [sizeOptionEditor, setSizeOptionEditor] = useState(null)
  const [sizeOptions, setSizeOptions] = useState([])
  const [editingScoreIndex, setEditingScoreIndex] = useState(-1);


  useEffect(() => {
  }, [])

  const getProduct = async () => {
    try {
      const productModel = new Product();
      let result = await productModel.getById(match.params.id);
      console.log(result);

      setName(result.name)
      setAvailable(result.available)
      setCategory(result.category);
      setDescription(result.description);
      setImages(result.photos);
      setVendorId(result.vendor_id)
      let frontImageArr = [];
      frontImageArr.push(result.main_photo_url)
      setFrontImage(frontImageArr);
      setPrice(result.price);


    } catch (e) {
      console.log(e);
    }
  }

  const reset = () => {

    setCurrentUser({
      username: "",
      email: "",
      full_name: "",
      password: "",
      passwordConfirm: "",
      branch: "",
      position: "",
      gender: "",
      role: "",
      joined_at: ""
    })
  }

  const submission = async () => {
    let submit = {
      name: name,
      price: parseInt(price) ,
      category: category,
      description: description,
      available: isAvailable,
      main_photo_url: frontImage[0],
      photos: images,
      vendor_id: parseInt(match.params.id),
      weight: parseInt(weight),
      size_description: sizeDescription,
      size: sizeOptions
    }

    if (submit.name === null || submit.name === '' || submit.name === undefined) {
      return alert('Name cannot be empty!');
    }

    if (submit.price === null || submit.price === '' || submit.price === undefined || submit.price === 0) {
      return alert('price cannot be empty!');
    }

    if (submit.category === null || submit.category === '' || submit.category === undefined) {
      return alert('Category cannot be empty!');
    }

    if (submit.description === null || submit.description === '' || submit.description === undefined) {
      return alert('Description cannot be empty!');
    }

    if (submit.size_description === null || submit.size_description === '' || submit.size_description === undefined) {
      return alert('Size description cannot be empty!');
    }

    if (submit.weight === null || submit.weight === '' || submit.weight === undefined) {
      return alert('Weight cannot be empty!');
    }

    if (submit.main_photo_url === null || submit.main_photo_url === '' || submit.main_photo_url === undefined) {
      return alert('Front image cannot be empty!');
    }

    if (submit.photos === null || submit.photos === '' || submit.photos === undefined) {
      return alert('Images cannot be empty!');
    }

    console.log(submit)

    try {
      const productModel = new Product();
      let result = await productModel.register(submit);
      console.log(result);
      alert('Registration Success!')
      return history.push("/my-product/" + match.params.id)
    } catch (e) {
      alert('Error occured! Please check your connection.')
      console.log(e)
    }

  }

  const onKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
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
              Register Product <br/>
              <Link to={"/my-product/" + match.params.id}><small>Back to product list</small></Link>
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
                    <CLabel htmlFor="email-input">Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="email-input"
                      name="email-input"
                      placeholder="Input name..."
                      value={name}
                      onKeyPress={onKeyPress}
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Price</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="email-input"
                      name="email-input"
                      placeholder="Input price..."
                      value={price}
                      onKeyPress={onKeyPress}
                      onChange={(e) => {
                        setPrice(e.target.value)
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Weight (in grams)</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="email-input"
                      name="email-input"
                      placeholder="Input weight..."
                      value={weight}
                      onKeyPress={onKeyPress}
                      onChange={(e) => {
                        setWeight(e.target.value)
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Category</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value)
                      }}
                    >
                      <option value="0">Please select category...</option>
                      <option value="Bag">Bag</option>
                      <option value="Jeans">Jeans</option>
                      <option value="T-Shirt">T-Shirt</option>
                      <option value="Jacket">Jacket</option>
                      <option value="Shoes">Shoes</option>
                    </CSelect>
                  </CCol>
                </CFormGroup>


                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Front Image</CLabel>
                  </CCol>

                  {
                    frontImage.length > 0 ? (
                      frontImage.map((obj, key) => {
                        return (
                          <CCol xs="12" md="9" style={{display: 'flex'}}>
                            <div style={{
                              position: 'relative',
                              display: 'flex',
                              justifySelf: 'flex-start',
                              marginBottom: 20
                            }}>
                              <img
                                onMouseOver={() => setMainPictHovered(true)}
                                onMouseLeave={() => setMainPictHovered(false)}
                                src={obj}
                                style={{
                                  width: 300,
                                  height: 150,
                                  borderRadius: 10,
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.125)',
                                  filter: isMainPictHovered ? 'brightness(.4)' : 'brightness(1)',
                                  cursor: 'pointer',
                                  objectFit: 'contain',
                                  backgroundColor: 'white'
                                }}/>

                              {isMainPictHovered &&
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
                        )
                      })
                    ) : <CCol>No Image</CCol>
                  }
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Change Front Image</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                      <FileUpload
                        onKeyPress={onKeyPress}
                        onDrop={async (file) => {
                          try {
                            let productModel = new Product();
                            let formData = new FormData();
                            console.log(file[0])
                            formData.append('upload', file[0]);

                            let result = await productModel.uploadImage( formData)
                            console.log('Results', result.location)
                            let frontImageArr = []
                            frontImageArr.push(result.location)
                            setFrontImage(frontImageArr);

                          } catch (e) {
                            console.log(e)
                          }
                        }}
                      />
                  </CCol>
                </CFormGroup>


                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Images</CLabel>
                  </CCol>
                  <CCol xs="12" md="9" style={{display: 'flex', flexDirection: 'column'}}>
                    {images.length > 0 ?
                      images.map((obj, key) => {
                        return (
                          <div
                            style={{position: 'relative', display: 'flex', alignSelf: 'flex-start', marginBottom: 20}}>
                            <img
                              onMouseOver={() => setProductPictHoveredIdx(key)}
                              onMouseLeave={() => setProductPictHoveredIdx(null)}
                              onClick={() => {
                                let temp = [...images];
                                temp.splice(key, key);
                                setImages(temp);
                                console.log('Delete initiated!')

                                const index = temp.indexOf(obj);
                                if (index > -1) {
                                  temp.splice(index, 1);
                                }
                              }}
                              src={obj} style={{
                              width: 300,
                              height: 150,
                              borderRadius: 10,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.125)',
                              filter: productPictHoveredIdx === key ? 'brightness(.4)' : 'brightness(1)',
                              cursor: 'pointer',
                              objectFit: 'contain',
                              backgroundColor: 'white'
                            }}/>

                            {productPictHoveredIdx === key &&
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
                        )
                      })
                      :
                      <CCol>No Image</CCol>
                    }
                  </CCol>

                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Add new images</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <FileUpload
                      onKeyPress={onKeyPress}
                      onDrop={async (file) => {
                        try {
                          let productModel = new Product();
                          let formData = new FormData();
                          console.log(file[0])
                          formData.append('upload', file[0]);

                          let result = await productModel.uploadImage(formData)
                          console.log('Results', result)

                          let imagesArr = [...images];
                          imagesArr.push(result.location);

                          setImages(imagesArr);
                        } catch (e) {
                          console.log(e)
                        }
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Add new size</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CRow>
                      <CInput
                        name="textarea-input"
                        id="textarea-input"
                        rows="3"
                        style={{width: 300, marginLeft: 15}}
                        placeholder="Input size..."
                        value={sizeOption}
                        onChange={(e) => {
                          setSizeOption(e.target.value)
                        }}

                      />
                      <CButton
                        //onClick={() => setEditingScoreIndex(-1)}
                        size="sm"
                        color="info"
                        style={{marginLeft: " 0.5em", marginRight: "0.5em"}}
                        onClick={() => {
                          if (sizeOption === null || sizeOption === '') {
                            return alert('Size option cannot be empty!');
                          }

                          let temp = [...sizeOptions];
                          temp.push(sizeOption);
                          setSizeOption('');
                          setSizeOptions(temp);
                          console.log(temp);
                        }}
                      >
                        <CIcon name="cil-check-circle"/>
                      </CButton>
                    </CRow>
                  </CCol>
                </CFormGroup>


                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Current sizes</CLabel>
                  </CCol>
                  <CCol>
                    <CRow>
                      {
                        sizeOptions.map((obj, key) => {
                          if (editingScoreIndex === key) {
                            return <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                cursor: "pointer"
                              }}>
                              <CInput
                                id="text-input"
                                name="text-input"
                                placeholder="Input size..."
                                value={obj}
                                onChange={(event) => {
                                  let temp = [
                                    ...sizeOptions
                                  ]

                                  temp[key] = event.target.value
                                  setSizeOptions(temp);
                                }}
                                style={{width: 300}}
                              />
                              <div>
                                <CButton
                                  onClick={() => {
                                    let temp = [...sizeOptions];
                                    temp[key] =

                                      setEditingScoreIndex(-1)
                                  }}
                                  size="sm"
                                  color="success"
                                  style={{marginLeft: " 0.5em", marginRight: "0.5em"}}
                                >
                                  <CIcon name="cil-check-circle"/>
                                </CButton>
                              </div>
                            </div>
                          } else {
                            return (
                              <div style={{maxWidth: 200, marginRight: 10, display: 'flex', flexDirection: 'row'}}>
                                <CCard style={{maxWidth: 200}}>
                                  <CCardBody
                                    style={{
                                      margin: 0, paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20,
                                      textAlign: "center"
                                    }}>
                                    {obj}
                                    <CIcon
                                      onClick={() => {
                                        console.log(key);
                                        setEditingScoreIndex(key);
                                      }}
                                      name="cil-pencil" style={{marginLeft: 10, color: "grey", cursor: "pointer"}}/>
                                    <CIcon
                                      onClick={() => {
                                        let temp = [...sizeOptions];
                                        const index = temp.indexOf(obj);
                                        if (index > -1) {
                                          temp.splice(index, 1);
                                        }
                                        setSizeOptions(temp);
                                      }}
                                      name="cil-trash" style={{marginLeft: 10, color: "grey", cursor: "pointer"}}/>

                                  </CCardBody>
                                </CCard>
                              </div>
                            )
                          }
                        })
                      }
                    </CRow>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Size Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="textarea-input"
                      id="textarea-input"
                      rows="3"
                      placeholder="Input size description..."
                      value={sizeDescription}
                      onChange={(e) => {
                        setSizeDescription(e.target.value)
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
                      onChange={(e) => {
                        setDescription(e.target.value)
                      }}
                    />
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Available</CLabel>
                  </CCol>
                  <CCol xs="12" md="9" style={{display: 'flex', alignItems: 'center'}}>
                    <div
                      onClick={() => setAvailable(!isAvailable)}
                      style={{
                        width: 19,
                        height: 19,
                        border: isAvailable ? 'none' : '2px solid #d9d9d9',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: isAvailable ? 'blue' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <AiOutlineCheck color={'white'}/>
                    </div>
                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                type="submit"
                size="sm"
                color="primary"
                onClick={() => {
                  submission();

                }}
              >

                <CIcon name="cil-save"/> Save
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ProductCreate;
