import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Palette from "../Palette";
import Container from "react-bootstrap/Container";
import React, {useEffect, useState} from "react";

import {FiShoppingCart} from "react-icons/fi";
import {GiHamburgerMenu} from "react-icons/gi";
import {Link} from "react-router-dom";
import {GrShop} from "react-icons/gr";
import {RiShoppingBagLine} from "react-icons/ri";
import {GoSearch} from "react-icons/go";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {BiChat} from "react-icons/all";
import {isMobile} from "react-device-detect";

function Header(props) {
    const [keyword, setKeyword] = useState('')
    const [isBagHovered, setBagHovered] = useState(false);
    const [isChatHovered, setChatHovered] = useState(false);
    const [isBurgerHovered, setBurgerHovered] = useState(false);
    const [isPPHovered, setPPHovered] = useState(false); //PP stands for Profile Picture
    const [isSnackbarShown, setSnackbarShown] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const {user, cart, isCartOpen, openUpdateProfile} = props;

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (cart.length === 0 && isCartOpen) {
            props.setCartOpen(false)
            setSnackbarShown(true)
        }
    }, [cart.length])

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }

    return <>
        <Row style={{
            boxShadow: '0 2px 5px rgba(0,0,0,.05)',
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: 'white',
        }}
        >
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={isSnackbarShown}
                onClose={() => setSnackbarShown(false)}
                message="Your cart is empty!"
            />

            <Col style={{display: 'flex', alignItems: 'center'}}>
                <div
                    onClick={() => {
                        if (props.setDrawerOpen) {
                            props.setDrawerOpen(true)
                        }
                    }}
                    onMouseOver={() => setBurgerHovered(true)}
                    onMouseLeave={() => setBurgerHovered(false)}
                    style={{
                        backgroundColor: !isBurgerHovered ? 'white' : '#9BFBFF',
                        color: '#9BFBFF',
                        transition: 'background-color .4s',
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        zIndex: 1
                    }}>
                    <GiHamburgerMenu color={Palette.PRIMARY} size={30}/>
                </div>

                <div
                    onClick={Object.keys(user).length === 0 ? props.openLogin : openUpdateProfile}
                    onMouseOver={() => setPPHovered(true)}
                    onMouseLeave={() => setPPHovered(false)}
                    style={{
                        display: windowWidth < 1150 ? 'none' : 'flex',
                        color: Palette.PRIMARY,
                        transition: 'background-color .4s',
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        fontFamily: 'Signika',
                        fontWeight: '600'
                    }}>
                    {Object.keys(user).length === 0 ? 'Sign In' :
                        <img src={'/ic_user.png'} style={{width: 40, height: 40}}/>
                    }
                </div>

                <Link to={'/order-history'} style={{textDecorationLine: 'none'}}>
                    <div
                        style={{
                            display: windowWidth < 1150 ? 'none' : 'flex',
                            color: Palette.PRIMARY,
                            transition: 'background-color .4s',
                            borderRadius: 35,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            cursor: 'pointer',
                            fontFamily: 'Signika',
                            fontWeight: '600',
                            marginLeft: 15,
                        }}>
                        <RiShoppingBagLine style={{marginRight: 10, color: 'red'}}/> Order History
                        {/*<img src={'./ic_user.png'} style={{width: 40, height: 40}}/>*/}
                    </div>
                </Link>
            </Col>

            <Col style={{
                fontFamily: 'Open Sans',
                fontSize: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: Palette.PRIMARY,
                fontWeight: '700'
            }}>
            </Col>

            <Col style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
            >
                <div style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F0F0F0',
                    margin: 20,
                    marginLeft: 0,
                    padding: 8,
                    borderRadius: 6,
                    cursor: 'pointer',
                    width: 350,
                    display: windowWidth < 1150 ? 'none' : 'flex'
                }}>
                    <GoSearch style={{color: '#8E8E93', marginLeft: 15, marginRight: 20}}/>

                    <input
                        onKeyPress={(event) => {
                            if (event.key === 'Enter' && keyword) {
                                window.location.href = `/search/${keyword}`
                            }
                        }}
                        onChange={(e) => setKeyword(e.target.value)}
                        type={'text'}
                        placeholder={'Search Product or Store'} style={{
                        fontFamily: 'Signika',
                        color: '#8E8E93',
                        backgroundColor: 'transparent',
                        width: '100%',
                        borderWidth: 0,
                        outline: 'none',
                    }}/>
                </div>


                {
                    !isMobile ?
                        <div>
                            {localStorage.getItem('user') &&
                            <Link to={"/chat-history"} style={{textDecorationLine: 'none', color: 'black'}}>
                                <div
                                    onClick={() => {

                                    }}
                                    onMouseOver={() => setChatHovered(true)}
                                    onMouseLeave={() => setChatHovered(false)}
                                    style={{
                                        position: 'relative',
                                        backgroundColor: !isChatHovered ? 'white' : '#9BFBFF33',
                                        transition: 'background-color .4s',
                                        width: 70,
                                        height: 70,
                                        borderRadius: 35,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 20,
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        zIndex: 1
                                    }}
                                >
                                    <BiChat size={22}/>
                                    <div style={{fontFamily: 'Open Sans'}}>Chat</div>
                                </div>
                            </Link>
                            }
                        </div> : null
                }

                <div
                    onClick={() => {
                        if (props.setCartOpen && cart.length > 0) {
                            props.setCartOpen(true)
                        } else {
                            setSnackbarShown(true)
                        }
                    }}
                    onMouseOver={() => setBagHovered(true)}
                    onMouseLeave={() => setBagHovered(false)}
                    style={{
                        position: 'relative',
                        backgroundColor: !isBagHovered ? 'white' : '#9BFBFF33',
                        transition: 'background-color .4s',
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 10,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        zIndex: 1
                    }}>

                    <FiShoppingCart size={22}/>
                    <div style={{fontFamily: 'Open Sans'}}>Cart</div>

                    {cart.length > 0 &&
                    <div style={{
                        position: 'absolute',
                        right: 10,
                        top: 0,
                        color: 'white',
                        width: 20,
                        height: 20,
                        borderRadius: 15,
                        backgroundColor: 'red',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Open Sans',
                        fontSize: '.8em'
                    }}>
                        {cart.length}
                    </div>
                    }
                </div>
            </Col>
        </Row>

        <Row style={{
            display: "flex",
            justifyContent: " center"
        }}>
            <Col md={4} style={{
                display: "flex",
                justifyContent: "center",
                marginTop: -70
            }}>
                <Link to={"/"}>
                    <img src={'/logo.png'}
                         style={{width: windowWidth < 500 ? 100 : 140, height: windowWidth < 500 ? 100 : 140}}/>
                </Link>
            </Col>
        </Row>
    </>
}

export default Header
