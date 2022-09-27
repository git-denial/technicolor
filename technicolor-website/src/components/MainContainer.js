import Container from "react-bootstrap/Container";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import {BrowserRouter, Link, Route, Switch, useLocation} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Footer from "./Footer";
import Cart from "./Cart";

import AboutUsPage from "../pages/AboutUs";
import CategoryDetailPage from "../pages/CategoryPage";
import StorePage from "../pages/StorePage";
import ProductPage from "../pages/ProductPage";
import FormatOrderPage from "../pages/FormatOrderPage";
import PaymentPage from "../pages/PaymentPage";
import ThankYouPage from "../pages/ThankYouPage";
import ContactUsPage from "../pages/ContactUsPage";
import TermsAndConditions from "../pages/TermsAndConditionsPage"
import Modal from "react-bootstrap/Modal";
import {AiOutlineClose} from "react-icons/ai";
import Row from "react-bootstrap/Row";
import Palette from "../Palette";
import {FormControl, InputGroup} from "react-bootstrap";
import {
    MdCall,
    MdEmail,
    MdErrorOutline,
    MdHome, MdLocalPhone,
    MdLocalPostOffice,
    MdLocationCity, MdLocationOn,
    MdLock,
    MdPerson
} from "react-icons/md";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import DrawerCategory from "./DrawerCategory";
import SearchPage from "../pages/SearchPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import SummaryPage from "../pages/SummaryPage";
import User from "../models/User"
import Location from "../models/Location";
import Select, {components} from "react-select";
import {FaAngleDown} from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import CartManager from "../util/CartManager";
import ChatPage from "../pages/ChatPage";
import FAQPage from "../pages/FAQPage";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";


function MainContainer(props) {
    const DropdownIndicator = props => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <FaAngleDown color={'grey'}/>
                </components.DropdownIndicator>
            )
        );
    };

    let location = useLocation();

    const [errorMsg, setErrorMsg] = useState(null);
    const [isButtonHovered, setButtonHovered] = useState(false)
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isEmailFocused, setEmailFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isFullNameFocused, setFullNameFocused] = useState(false);
    const [isConfirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [city, setCity] = useState('');
    const [isCityFocused, setCityFocused] = useState(false)
    const [address, setAddress] = useState('');
    const [isAddressFocused, setAddressFocused] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [isPostalCodeFocused, setPostalCodeFocused] = useState(false);

    const [isLoginShown, setLoginShown] = useState(false);
    const [isRegisterShown, setRegisterShown] = useState(false);

    const [province, setProvince] = useState('');
    const [provinces, setProvinces] = useState([])
    const [cities, setCities] = useState([])
    const [user, setUser] = useState({});
    const [cart, setCart] = useState(CartManager.getCartContent());

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneNumberFocused, setPhoneNumberFocused] = useState(false);

    const [isUpdateProfileShown, setUpdateProfileShown] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(-1);

    const [registerAlert, setRegisterAlert] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('user')) setUser(JSON.parse(localStorage.getItem('user')))

        findProvinces(JSON.parse(localStorage.getItem('user')))
    }, [])

    const onProvinceChange = async (target) => {

        console.log('onProvinceChange has been initiated!')
        let targetArr = target.split(',');
        targetArr[0] = parseInt(targetArr[0]);

        setSelectedCity(0)

        console.log('selected city', selectedCity)

        console.log(targetArr[0])

        let model = new Location();

        let cityQueryResult = await model.getCityById(target);

        const cities = [];

        console.log('cityQueryResult', cityQueryResult)

        let user = {};

        if (JSON.parse(localStorage.getItem('user'))) user = JSON.parse(localStorage.getItem('user'));

        cityQueryResult.rajaongkir.results.map(city => {
            if (city.city_name === user.city) {
                setCity(city.city_name)
            }

            cities.push({value: city.city_id, label: city.city_name})
        })
        setCities([])
        setCities(cities);
    }

    const findProvinces = async (user) => {
        let model = new Location();

        try {
            let result = await model.getAllProvince();
            console.log(result);
            const provinces = [];

            console.log('user', user)

            result.rajaongkir.results.map(province => {

                if (user && user.province === province.province) {

                    setProvince(province.province)
                    setSelectedProvince({value: province.province_id, label: province.province})
                    onProvinceChange(province.province_id)
                }

                provinces.push({value: province.province_id, label: province.province})
            })
            setProvinces(provinces);
        } catch (e) {
            console.log('e', e)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location]);

    const [isCartOpen, setCartOpen] = useState(false)
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    const attemptLogin = async () => {
        setErrorMsg(null);

        if (email.length === 0) {
            setErrorMsg('Email cannot be empty!')
        } else if (password.length === 0) {
            setErrorMsg('Password cannot be empty!')
        } else {
            let model = new User();

            try {
                let result = await model.login({
                    email,
                    password
                })

                localStorage.setItem('user', JSON.stringify(result))
                setUser(result)
                setLoginShown(false);
                window.location.reload(true);
                console.log(result);
            } catch (e) {
                if (e.code === 'EMAIL_NOT_FOUND' || e.code === 'USER_PASSWORD_WRONG') setErrorMsg('Incorrect email or password.')
            }
        }
    }


    const attemptRegister = async () => {
        setErrorMsg(null);

        if (email.length === 0) {
            setErrorMsg('Email cannot be empty!')
        } else if (password.length === 0) {
            setErrorMsg('Password cannot be empty!')
        } else if (confirmPassword.length === 0) {
            setErrorMsg('Password confirmation cannot be empty!')
        } else if (password !== confirmPassword) {
            setErrorMsg('Password confirmation does not match!')
        } else if (fullName.length === 0) {
            setErrorMsg('Full name cannot be empty!')
        } else if (phoneNumber.length === 0) {
            setErrorMsg('Phone number cannot be empty!')
        } else if (address.length === 0) {
            setErrorMsg('Address cannot be empty!')
        } else if (province.length === 0) {
            setErrorMsg('Please select at least 1 province!')
        } else if (city.length === 0) {
            setErrorMsg('Please select at least 1 city!')
        } else if (postalCode.length === 0) {
            setErrorMsg('Postal code cannot be empty!')
        } else if (postalCode.length !== 5) {
            setErrorMsg('Postal code must be 5 digits long!')
        } else {
            let model = new User();

            try {
                let result = await model.register({
                    email,
                    password,
                    full_name: fullName,
                    address,
                    province,
                    city,
                    zip_code: postalCode,
                    phone_num: phoneNumber
                })

                setRegisterAlert(true)
                setRegisterShown(false);
                setLoginShown(true)
                console.log(result);
            } catch (e) {
                setErrorMsg(e.error_message)
            }
        }
    }

    const attemptUpdateProfile = async () => {
        setErrorMsg(null);

        if (email.length === 0) {
            setErrorMsg('Email cannot be empty!')
        } else if (fullName.length === 0) {
            setErrorMsg('Full name cannot be empty!')
        } else if (phoneNumber.length === 0) {
            setErrorMsg('Phone number cannot be empty!')
        } else if (address.length === 0) {
            setErrorMsg('Address cannot be empty!')
        } else if (province.length === 0) {
            setErrorMsg('Please select at least 1 province!')
        } else if (city.length === 0) {
            setErrorMsg('Please select at least 1 city!')
        } else if (postalCode.length === 0) {
            setErrorMsg('Postal code cannot be empty!')
        } else if (postalCode.length !== 5) {
            setErrorMsg('Postal code must be 5 digits long!')
        } else {
            let model = new User();

            try {
                let result = await model.updateProfile({
                    email,
                    full_name: fullName,
                    address,
                    province,
                    city,
                    zip_code: postalCode,
                    phone_num: phoneNumber
                })

                setEmail('')
                setFullName('')
                setPhoneNumber('')
                setAddress('')
                setPostalCode('')

                setSelectedProvince(null)
                setSelectedCity(0)

                setProvince('')
                setCity('')

                setCities([])

                setUpdateProfileShown(false)

                alert('Profile has been updated successfully!');

                result = await model.getMyInfo();

                result.token = user.token;

                setUser(result)

                localStorage.setItem('user', JSON.stringify(result))
            } catch (e) {
                console.log('err', e)

                setErrorMsg(e.error_message)
            }
        }
    }

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (isLoginShown) attemptLogin()
            else if (isRegisterShown) attemptRegister()
            else if (isUpdateProfileShown) attemptUpdateProfile();
        }
    }

    return <Container fluid style={{backgroundColor: '#fafafa', minHeight: '100vh'}}>

        <Snackbar
            autoHideDuration={3000}
            anchorOrigin={{vertical: "top", horizontal: "center"}}
            open={registerAlert}
            onClose={() => setRegisterAlert(false)}
            message={'You have been registered successfully!'}
        />
        <Modal show={isLoginShown} onHide={() => {
            setErrorMsg(null)
            setLoginShown(false)
        }}>
            <Container>
                <Row style={{
                    marginTop: 15,
                    marginRight: 15,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: -30
                }}>
                    <AiOutlineClose size={25} style={{cursor: 'pointer'}} onClick={() => {
                        setErrorMsg(null)
                        setLoginShown(false)
                    }}/>
                </Row>

                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '600',
                    fontSize: '2em',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img src={'/logo192.png'}
                         style={{
                             maxWidth: 100,
                             maxHeight: 100,
                             objectFit: 'contain',
                             borderRadius: 5,
                             cursor: 'pointer',
                             marginTop: 30
                         }}
                    />
                </Row>

                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '800',
                    fontSize: '1.75em',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: Palette.PRIMARY
                }}>
                    Login
                </Row>

                <Row style={{marginTop: 20}}>
                    <Col xs={1}/>
                    <Col xs={10}>
                        {errorMsg ?
                            <Row style={{
                                backgroundColor: '#ffc9cf',
                                color: '#e3192d',
                                alignItems: 'center',
                                border: '1px solid #d5bab9',
                                paddingRight: 10,
                                paddingTop: 7,
                                paddingBottom: 7,
                                marginBottom: 20,
                                borderRadius: 5,
                            }}>
                                <Col xs={1}>
                                    <MdErrorOutline size={27} color={'#a25b5d'}/>
                                </Col>
                                <Col style={{
                                    color: '#a25b5d',
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    marginLeft: 5
                                }}>
                                    {errorMsg}
                                </Col>
                            </Row> : null
                        }

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7
                        }}>EMAIL
                        </div>
                        <InputGroup
                            style={isEmailFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdEmail size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Email"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setEmail(event.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                value={email}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>PASSWORD
                        </div>
                        <InputGroup
                            style={{
                                backgroundColor: '#e9f3f4',
                                boxShadow: isPasswordFocused ? '0 0 10px #9ecaed' : 'none',
                                border: isPasswordFocused ? '1px solid  #9ecaed' : 'none',
                                borderRadius: 5
                            }}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdLock size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setPassword(event.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />

                            <InputGroup.Prepend style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                paddingRight: 10,
                                marginRight: 10,
                                backgroundColor: '#e9f3f4'
                            }}
                                                onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? <IoMdEye size={20}/> : <IoMdEyeOff size={20}/>}
                            </InputGroup.Prepend>
                        </InputGroup>

                        <Row style={{marginLeft: 3, marginTop: 20}}>
                                    <span style={{fontFamily: 'Signika'}}>Don't have an account yet? <a
                                        href={`#`}
                                        onClick={() => {
                                            setLoginShown(false);
                                            setRegisterShown(true);
                                            setErrorMsg(null)
                                        }}
                                        style={{fontWeight: '600'}}>Register</a></span>
                        </Row>


                        <Row style={{display: 'flex', justifyContent: 'center', marginTop: 25, marginBottom: 20}}>
                            <Button
                                style={{
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 90,
                                    paddingRight: 90,
                                    backgroundColor: Palette.PRIMARY,
                                    borderColor: Palette.PRIMARY,
                                    opacity: isButtonHovered ? .9 : 1
                                }}
                                onMouseEnter={() => setButtonHovered(true)}
                                onMouseLeave={() => setButtonHovered(false)}
                                onClick={attemptLogin}
                            >
                                LOGIN
                            </Button>
                        </Row>
                    </Col>
                    <Col xs={1}/>
                </Row>
            </Container>
        </Modal>

        <Modal show={isRegisterShown} onHide={() => {
            setErrorMsg(null)
            setRegisterShown(false)
        }}>
            <Container>
                <Row style={{
                    marginTop: 15,
                    marginRight: 15,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: -30
                }}>
                    <AiOutlineClose size={25} style={{cursor: 'pointer'}} onClick={() => {
                        setErrorMsg(null)
                        setRegisterShown(false)
                    }}/>
                </Row>
                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '600',
                    fontSize: '2em',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img src={'/logo192.png'}
                         style={{
                             maxWidth: 100,
                             maxHeight: 100,
                             objectFit: 'contain',
                             borderRadius: 5,
                             cursor: 'pointer',
                             marginTop: 30
                         }}
                    />
                </Row>
                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '800',
                    fontSize: '1.75em',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: Palette.PRIMARY,
                    marginTop: 10
                }}>
                    Register
                </Row>

                <Row style={{marginTop: 20}}>
                    <Col xs={1}/>
                    <Col xs={10}>
                        {errorMsg ?
                            <Row style={{
                                backgroundColor: '#ffc9cf',
                                color: '#e3192d',
                                alignItems: 'center',
                                border: '1px solid #d5bab9',
                                paddingRight: 10,
                                paddingTop: 7,
                                paddingBottom: 7,
                                marginBottom: 20,
                                borderRadius: 5,
                            }}>
                                <Col xs={1}>
                                    <MdErrorOutline size={27} color={'#a25b5d'}/>
                                </Col>
                                <Col style={{
                                    color: '#a25b5d',
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    marginLeft: 5
                                }}>
                                    {errorMsg}
                                </Col>
                            </Row> : null
                        }

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7
                        }}>EMAIL
                        </div>
                        <InputGroup
                            style={isEmailFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdEmail size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Email"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setEmail(event.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                value={email}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>PASSWORD
                        </div>
                        <InputGroup
                            style={{
                                backgroundColor: '#e9f3f4',
                                boxShadow: isPasswordFocused ? '0 0 10px #9ecaed' : 'none',
                                border: isPasswordFocused ? '1px solid  #9ecaed' : 'none',
                                borderRadius: 5
                            }}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdLock size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setPassword(event.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />

                            <InputGroup.Prepend style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                paddingRight: 10,
                                marginRight: 10,
                                backgroundColor: '#e9f3f4'
                            }}
                                                onClick={() => setPasswordVisible(!isPasswordVisible)}>
                                {isPasswordVisible ? <IoMdEye size={20}/> : <IoMdEyeOff size={20}/>}
                            </InputGroup.Prepend>
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            PASSWORD CONFIRMATION
                        </div>
                        <InputGroup
                            style={{
                                backgroundColor: '#e9f3f4',
                                boxShadow: isConfirmPasswordFocused ? '0 0 10px #9ecaed' : 'none',
                                border: isConfirmPasswordFocused ? '1px solid  #9ecaed' : 'none',
                                borderRadius: 5
                            }}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdLock size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Password Confirmation"
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                onFocus={() => setConfirmPasswordFocused(true)}
                                onBlur={() => setConfirmPasswordFocused(false)}
                            />

                            <InputGroup.Prepend style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                paddingRight: 10,
                                marginRight: 10,
                                backgroundColor: '#e9f3f4'
                            }}
                                                onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                {isConfirmPasswordVisible ? <IoMdEye size={20}/> : <IoMdEyeOff size={20}/>}
                            </InputGroup.Prepend>
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            FULL NAME
                        </div>
                        <InputGroup
                            style={isFullNameFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdPerson size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Full Name"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setFullName(event.target.value)}
                                onFocus={() => setFullNameFocused(true)}
                                onBlur={() => setFullNameFocused(false)}
                                value={fullName}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            PHONE NUMBER
                        </div>
                        <InputGroup
                            style={isPhoneNumberFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocalPhone size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Phone Number"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                onFocus={() => setPhoneNumberFocused(true)}
                                onBlur={() => setPhoneNumberFocused(false)}
                                value={phoneNumber}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            ADDRESS
                        </div>
                        <InputGroup
                            style={isAddressFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdHome size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                as="textarea" rows={3}
                                placeholder="Address"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setAddress(event.target.value)}
                                onFocus={() => setAddressFocused(true)}
                                onBlur={() => setAddressFocused(false)}
                                value={address}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            PROVINCE
                        </div>
                        <InputGroup
                            style={isCityFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocationOn size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <div style={{flex: 1}}>
                                <Select
                                    onChange={(option) => {
                                        console.log('Province has been changed!')
                                        setProvince(option.label)
                                        onProvinceChange(option.value)
                                    }}
                                    placeholder={'Select Province'}
                                    options={provinces}
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            cursor: 'pointer',

                                        }),
                                        control: provided => ({
                                            ...provided,
                                            borderWidth: 0,
                                            backgroundColor: '#e9f3f4',
                                            fontFamily: 'Signika',
                                            fontWeight: '600',
                                            color: '#8e8e8e',
                                        }),
                                    }}
                                    components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                />
                            </div>

                            {/*<FormControl*/}
                            {/*    placeholder="City"*/}
                            {/*    style={{*/}
                            {/*        borderWidth: 0,*/}
                            {/*        backgroundColor: '#e9f3f4',*/}
                            {/*        outline: 'none',*/}
                            {/*        boxShadow: 'none',*/}
                            {/*        fontFamily: 'Signika',*/}
                            {/*        fontWeight: '600'*/}
                            {/*    }}*/}
                            {/*    onChange={(event) => setCity(event.target.value)}*/}
                            {/*    onFocus={() => setCityFocused(true)}*/}
                            {/*    onBlur={() => setCityFocused(false)}*/}
                            {/*    value={city}*/}
                            {/*/>*/}
                        </InputGroup>

                        {province.length !== 0 && cities.length === 0 &&
                        <>
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Spinner size="sm" animation="border" variant="danger"/>
                        </>
                        }

                        {cities.length !== 0 &&
                        <>
                            <div style={{
                                fontFamily: 'Signika',
                                fontWeight: '600',
                                fontSize: '0.75em',
                                color: '#8e8e8e',
                                marginBottom: 7,
                                marginTop: 20
                            }}>
                                CITY
                            </div>
                            <InputGroup
                                style={isCityFocused ? {
                                    boxShadow: '0 0 10px #9ecaed',
                                    border: '1px solid  #9ecaed',
                                    borderRadius: 5
                                } : {}}
                            >
                                <InputGroup.Prepend>
                                    <InputGroup.Text style={{
                                        borderWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#e9f3f4',
                                    }}>
                                        <MdLocationCity size={20}/>
                                    </InputGroup.Text>

                                    <InputGroup.Text style={{
                                        borderWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingLeft: 0,
                                        paddingRight: 0
                                    }}>
                                        <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                    </InputGroup.Text>

                                </InputGroup.Prepend>

                                <div style={{flex: 1}}>
                                    <Select
                                        onChange={(option) => {
                                            setCity(option.label)
                                        }}
                                        placeholder={'Select City'}
                                        options={cities}
                                        styles={{
                                            option: (provided, state) => ({
                                                ...provided,
                                                cursor: 'pointer',

                                            }),
                                            control: provided => ({
                                                ...provided,
                                                borderWidth: 0,
                                                backgroundColor: '#e9f3f4',
                                                fontFamily: 'Signika',
                                                fontWeight: '600',
                                                color: '#8e8e8e',
                                            }),
                                        }}
                                        components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                    />
                                </div>
                            </InputGroup>
                        </>
                        }
                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            POSTAL CODE
                        </div>
                        <InputGroup
                            style={isPostalCodeFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocalPostOffice size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Postal Code"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => {
                                    if (!isNaN(event.target.value) && event.target.value.length <= 5) {
                                        setPostalCode(event.target.value)
                                    }
                                }}
                                onFocus={() => setPostalCodeFocused(true)}
                                onBlur={() => setPostalCodeFocused(false)}
                                value={postalCode}
                            />
                        </InputGroup>

                        <Row style={{marginLeft: 3, marginTop: 20}}>
                                    <span style={{fontFamily: 'Signika'}}>Already have an account? <a
                                        href={`#`}
                                        onClick={() => {
                                            setErrorMsg(null)
                                            setRegisterShown(false)
                                            setLoginShown(true)
                                        }}
                                        style={{fontWeight: '600'}}>Login</a></span>
                        </Row>


                        <Row style={{display: 'flex', justifyContent: 'center', marginTop: 25, marginBottom: 20}}>
                            <Button
                                style={{
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 90,
                                    paddingRight: 90,
                                    backgroundColor: '#cf4452',
                                    borderColor: '#cf4452',
                                    opacity: isButtonHovered ? .9 : 1
                                }}
                                onMouseEnter={() => setButtonHovered(true)}
                                onMouseLeave={() => setButtonHovered(false)}
                                onClick={attemptRegister}
                            >
                                REGISTER
                            </Button>
                        </Row>
                    </Col>
                    <Col xs={1}/>
                </Row>
            </Container>
        </Modal>


        <Modal show={isUpdateProfileShown} onHide={() => {
            setErrorMsg(null)
            setUpdateProfileShown(false)


            setEmail('')
            setFullName('')
            setPhoneNumber('')
            setAddress('')
            setPostalCode('')

            setSelectedProvince(null)
            setSelectedCity(0)

            setProvince('')
            setCity('')

            setCities([])
        }}>
            <Container>
                <Row style={{
                    marginTop: 15,
                    marginRight: 15,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: -30
                }}>
                    <AiOutlineClose size={25} style={{cursor: 'pointer'}} onClick={() => {
                        setErrorMsg(null)
                        setUpdateProfileShown(false)

                        setEmail('')
                        setFullName('')
                        setPhoneNumber('')
                        setAddress('')
                        setPostalCode('')

                        setSelectedProvince(null)
                        setSelectedCity(0)

                        setProvince('')
                        setCity('')

                        setCities([])
                    }}/>
                </Row>
                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '600',
                    fontSize: '2em',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img src={'/logo192.png'}
                         style={{
                             maxWidth: 100,
                             maxHeight: 100,
                             objectFit: 'contain',
                             borderRadius: 5,
                             cursor: 'pointer',
                             marginTop: 30
                         }}
                    />
                </Row>
                <Row style={{
                    fontFamily: 'Signika',
                    fontWeight: '800',
                    fontSize: '1.75em',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: Palette.PRIMARY,
                    marginTop: 10
                }}>
                    Update Profile
                </Row>

                <Row style={{marginTop: 20}}>
                    <Col xs={1}/>
                    <Col xs={10}>
                        {errorMsg ?
                            <Row style={{
                                backgroundColor: '#ffc9cf',
                                color: '#e3192d',
                                alignItems: 'center',
                                border: '1px solid #d5bab9',
                                paddingRight: 10,
                                paddingTop: 7,
                                paddingBottom: 7,
                                marginBottom: 20,
                                borderRadius: 5,
                            }}>
                                <Col xs={1}>
                                    <MdErrorOutline size={27} color={'#a25b5d'}/>
                                </Col>
                                <Col style={{
                                    color: '#a25b5d',
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    marginLeft: 5
                                }}>
                                    {errorMsg}
                                </Col>
                            </Row> : null
                        }

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7
                        }}>EMAIL
                        </div>
                        <InputGroup
                            style={isEmailFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4'
                                }}>
                                    <MdEmail size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Email"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setEmail(event.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                value={email}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            FULL NAME
                        </div>
                        <InputGroup
                            style={isFullNameFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdPerson size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Full Name"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setFullName(event.target.value)}
                                onFocus={() => setFullNameFocused(true)}
                                onBlur={() => setFullNameFocused(false)}
                                value={fullName}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            PHONE NUMBER
                        </div>
                        <InputGroup
                            style={isPhoneNumberFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocalPhone size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Phone Number"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                                onFocus={() => setPhoneNumberFocused(true)}
                                onBlur={() => setPhoneNumberFocused(false)}
                                value={phoneNumber}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            ADDRESS
                        </div>
                        <InputGroup
                            style={isAddressFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdHome size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                as="textarea" rows={3}
                                placeholder="Address"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => setAddress(event.target.value)}
                                onFocus={() => setAddressFocused(true)}
                                onBlur={() => setAddressFocused(false)}
                                value={address}
                            />
                        </InputGroup>

                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            PROVINCE
                        </div>
                        <InputGroup
                            style={isCityFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocationOn size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <div style={{flex: 1}}>
                                <Select
                                    value={selectedProvince}
                                    onChange={(option) => {
                                        console.log('Province has been changed!')
                                        setProvince(option.label)
                                        setSelectedCity(0)
                                        setSelectedProvince(option)
                                        onProvinceChange(option.value)
                                    }}
                                    placeholder={'Select Province'}
                                    // value={{value: 'FREE SIZE', label: 'FREE SIZE'}}
                                    options={provinces}
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            cursor: 'pointer',

                                        }),
                                        control: provided => ({
                                            ...provided,
                                            borderWidth: 0,
                                            backgroundColor: '#e9f3f4',
                                            fontFamily: 'Signika',
                                            fontWeight: '600',
                                            color: '#8e8e8e',
                                        }),
                                    }}
                                    components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                />
                            </div>
                        </InputGroup>

                        {province !== 0 && cities.length === 0 &&
                        <>
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Spinner size="sm" animation="border" variant="danger"/>
                        </>
                        }

                        {cities.length !== 0 &&
                        <>
                            <div style={{
                                fontFamily: 'Signika',
                                fontWeight: '600',
                                fontSize: '0.75em',
                                color: '#8e8e8e',
                                marginBottom: 7,
                                marginTop: 20
                            }}>
                                CITY
                            </div>
                            <InputGroup
                                style={isCityFocused ? {
                                    boxShadow: '0 0 10px #9ecaed',
                                    border: '1px solid  #9ecaed',
                                    borderRadius: 5
                                } : {}}
                            >
                                <InputGroup.Prepend>
                                    <InputGroup.Text style={{
                                        borderWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#e9f3f4',
                                    }}>
                                        <MdLocationCity size={20}/>
                                    </InputGroup.Text>

                                    <InputGroup.Text style={{
                                        borderWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingLeft: 0,
                                        paddingRight: 0
                                    }}>
                                        <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                    </InputGroup.Text>

                                </InputGroup.Prepend>

                                <div style={{flex: 1}}>
                                    <Select
                                        onChange={(option) => {
                                            setCity(option.label)
                                            setSelectedCity(option)
                                        }}
                                        placeholder={'Select City'}
                                        value={selectedCity}
                                        options={cities}
                                        styles={{
                                            option: (provided, state) => ({
                                                ...provided,
                                                cursor: 'pointer',

                                            }),
                                            control: provided => ({
                                                ...provided,
                                                borderWidth: 0,
                                                backgroundColor: '#e9f3f4',
                                                fontFamily: 'Signika',
                                                fontWeight: '600',
                                                color: '#8e8e8e',
                                            }),
                                        }}
                                        components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                    />
                                </div>
                            </InputGroup>
                        </>
                        }
                        <div style={{
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            fontSize: '0.75em',
                            color: '#8e8e8e',
                            marginBottom: 7,
                            marginTop: 20
                        }}>
                            POSTAL CODE
                        </div>
                        <InputGroup
                            style={isPostalCodeFocused ? {
                                boxShadow: '0 0 10px #9ecaed',
                                border: '1px solid  #9ecaed',
                                borderRadius: 5
                            } : {}}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#e9f3f4',
                                }}>
                                    <MdLocalPostOffice size={20}/>
                                </InputGroup.Text>

                                <InputGroup.Text style={{
                                    borderWidth: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}>
                                    <div style={{height: '75%', width: 2, backgroundColor: '#9ca4a6'}}/>
                                </InputGroup.Text>

                            </InputGroup.Prepend>

                            <FormControl
                                onKeyPress={onKeyPress}
                                placeholder="Postal Code"
                                style={{
                                    borderWidth: 0,
                                    backgroundColor: '#e9f3f4',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontFamily: 'Signika',
                                    fontWeight: '600'
                                }}
                                onChange={(event) => {
                                    if (!isNaN(event.target.value) && event.target.value.length <= 5) {
                                        setPostalCode(event.target.value)
                                    }
                                }}
                                onFocus={() => setPostalCodeFocused(true)}
                                onBlur={() => setPostalCodeFocused(false)}
                                value={postalCode}
                            />
                        </InputGroup>
                        <Row style={{display: 'flex', justifyContent: 'center', marginTop: 25, marginBottom: 20}}>
                            <Button
                                style={{
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 90,
                                    paddingRight: 90,
                                    backgroundColor: '#cf4452',
                                    borderColor: '#cf4452',
                                    opacity: isButtonHovered ? .9 : 1
                                }}
                                onMouseEnter={() => setButtonHovered(true)}
                                onMouseLeave={() => setButtonHovered(false)}
                                onClick={attemptUpdateProfile}
                            >
                                UPDATE
                            </Button>
                        </Row>
                    </Col>
                    <Col xs={1}/>
                </Row>
            </Container>
        </Modal>


        <Header setDrawerOpen={(open) => setDrawerOpen(open)}
                isCartOpen={isCartOpen}
                setCartOpen={(open) => setCartOpen(open)}
                user={user}
                cart={cart}
                openUpdateProfile={() => {
                    findProvinces(JSON.parse(localStorage.getItem('user')))

                    setEmail(user.email)
                    setFullName(user.full_name)
                    setPhoneNumber(user.phone_num)
                    setAddress(user.address)
                    setPostalCode(user.zip_code)

                    setUpdateProfileShown(true)
                }}
                openLogin={() => setLoginShown(true)}/>

        <Cart
            openLogin={() => setLoginShown(true)}
            cart={cart}
            setCart={setCart}
            close={() => setCartOpen(false)}
            isOpen={isCartOpen}/>

        <DrawerCategory
            user={user}
            setUser={setUser}
            openLogin={() => setLoginShown(true)}
            close={() => setDrawerOpen(false)}
            isOpen={isDrawerOpen}/>

        <div style={{minHeight: 'calc(100vh - 350px)'}}>

            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route exact path="/about" component={AboutUsPage}/>
                <Route exact path="/category/:category" component={CategoryDetailPage}/>
                <Route exact path="/store/:id" component={StorePage}/>
                <Route exact path="/product/:id" render={(props) => {
                    return <ProductPage {...props}
                                        cart={cart}
                                        setCart={(cart) => setCart(cart)}
                                        setCartOpen={(open) => setCartOpen(open)}/>
                }}/>
                <Route exact path="/shipping-information" render={(props) => {
                    return <FormatOrderPage {...props}
                                            cart={cart}/>
                }}/>
                <Route exact path="/upload-receipt/:id" component={PaymentPage}/>
                <Route exact path="/thank-you" component={ThankYouPage}/>
                <Route exact path="/contact-us" component={ContactUsPage}/>
                <Route exact path="/search/:keyword" component={SearchPage}/>
                <Route exact path="/order-history" component={OrderHistoryPage}/>
                <Route exact path="/chat-history" component={ChatPage}/>
                <Route exact path="/terms-and-conditions" component={TermsAndConditions}/>
                <Route exact path="/faq" component={FAQPage}/>
                <Route exact path="/summary"
                       render={(props) => {
                           return <SummaryPage {...props}
                                               cart={cart}
                                               setCart={(cart) => setCart(cart)}/>
                       }}/>

                <Route exact path={"*"} component={() => {
                    window.location.href = "/"
                    return null;
                }}/>
            </Switch>
        </div>

        <Footer/>

    </Container>


}

export default MainContainer
