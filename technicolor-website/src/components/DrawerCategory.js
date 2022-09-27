import {MdClose} from "react-icons/md";
import TextEllipsis from "react-text-ellipsis";
import {TiMinus, TiPlus, TiTrash} from "react-icons/ti";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {GoSearch} from "react-icons/go";
import {FaLayerGroup, FaRegListAlt, FaHome, FaList} from "react-icons/fa";
import Col from "react-bootstrap/Col";
import Palette from "../Palette";
import {RiShoppingBagLine} from "react-icons/ri";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Row from "react-bootstrap/Row";


function Cart(props) {
    const [expanded, setExpanded] = useState(null)
    const [keyword, setKeyword] = useState('')
    const {user, setUser} = props;

    // const [showBagDrawer, setShowBagDrawer] = useState(false);
    const [showBag, setShowBag] = useState(false);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [quantity, setQuantity] = useState(1);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }

    const disableScrolling = () => {
        const x = window.scrollX;
        const y = window.scrollY;
        window.onscroll = function () {
            window.scrollTo(x, y);
        };
    }

    const enableScrolling = () => {
        window.onscroll = function () {
        };
    }

    return <div style={{
        opacity: props.isOpen ? 1 : 0,
        transition: 'opacity .15s',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000000B3',
        zIndex: props.isOpen ? 999 : -1,
        display: 'flex',
        justifyContent: 'flex-end',
        overflow: 'hidden'
    }}
                onClick={(e) => {

                    setTimeout(() => {
                        props.close()
                        enableScrolling()
                    }, 300)
                }}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                backgroundColor: 'white',
                width: windowWidth < 768 ? '100vw' : 450,
                height: '100vh',
                position: 'absolute',
                left: props.isOpen ? 0 : -450,
                transition: 'left .3s',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {windowWidth < 768 &&
            <MdClose style={{marginTop: 20, marginRight: 25, alignSelf: 'flex-end', cursor: 'pointer'}} size={30}
                     onClick={() => {
                         props.close(false)

                         setTimeout(() => {
                             props.close()
                             enableScrolling()
                         }, 300)
                     }}/>
            }

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F0F0F0',
                margin: 20,
                padding: 8,
                borderRadius: 6,
                cursor: 'pointer',
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
                    outline: 'none'
                }}/>
            </div>


            {/* accordion */}

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                        <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                            Category
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Link to={'/category/home&living'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>


                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Home & Living
                                </div>

                            </div>
                        </Link>

                        <Link to={'/category/shoes'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>

                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Shoes
                                </div>
                            </div>
                        </Link>

                        <Link to={'/category/antiques'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Antiques
                                </div>
                            </div>
                        </Link>

                        <Link to={'/category/clothing'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>

                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Clothing
                                </div>

                            </div>
                        </Link>

                        <Link to={'/category/accesories'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>

                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Accesories
                                </div>
                            </div>
                        </Link>

                        <div style={{flex: 1}}/>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <FaList style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                        <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                            Menu
                        </div>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <Link
                            to={'/'}
                            style={{textDecorationLine: 'none'}}
                        >
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                                 onClick={() => {
                                     props.close()

                                     if (Object.keys(user).length === 0) {
                                         props.openLogin()
                                     } else {
                                         setUser({})

                                         localStorage.removeItem('user');

                                         window.location.reload(true);
                                     }
                                 }}
                            >
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>

                                <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600', color: '#9c9c9c'}}>
                                    {Object.keys(user).length !== 0 ? 'SIGN OUT' : 'SIGN IN'}
                                </div>
                            </div>
                        </Link>
                        <Link to={'/chat-history'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Chat
                                </div>
                            </div>
                        </Link>
                        <Link to={'/order-history'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Order History
                                </div>
                            </div>
                        </Link>


                        <Link to={'/about'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Info
                                </div>
                            </div>
                        </Link>

                        <Link to={'/faq'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    FAQ
                                </div>
                            </div>
                        </Link>

                        <Link to={'/terms-and-conditions'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Terms & Conditions
                                </div>
                            </div>
                        </Link>

                        <Link to={'/contact-us'}
                              style={{textDecorationLine: 'none'}}
                              onClick={() => {
                                  props.close()
                              }}>
                            <div style={{
                                margin: 20,
                                marginTop: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FaLayerGroup style={{fontSize: 20, color: 'rgb(240, 98, 94)', opacity: 0}}/>
                                <div style={{
                                    marginLeft: 20,
                                    fontFamily: 'Signika',
                                    fontWeight: '600',
                                    color: '#9c9c9c'
                                }}>
                                    Contact Us
                                </div>
                            </div>
                        </Link>
                    </Typography>

                </AccordionDetails>
            </Accordion>

            {/* accordion */}


        </div>
    </div>
}

export default Cart
