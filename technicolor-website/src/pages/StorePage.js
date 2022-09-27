import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {MdLocationOn, MdSend} from "react-icons/md";
import TextEllipsis from 'react-text-ellipsis';
import {Link} from "react-router-dom";
import Palette from "../Palette";
import {IoMdChatbubbles} from "react-icons/io";
import {AiOutlineClose} from "react-icons/ai";
import Product from "../models/Product";
import Vendor from "../models/Vendor";
import Location from "../models/Location";
import Chat from "../models/Chat";
import Input from "@material-ui/core/Input";
import moment from "moment";
import ChatWidget from "../components/ChatWidget";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Spinner from "react-bootstrap/Spinner";

export default function StorePage(props) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const chatRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const {id} = props.match.params;
    const [products, setProducts] = useState([]);
    const [vendor, setVendor] = useState({});
    const [isSnackbarShown, setSnackbarShown] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        getProductsByVendorId();
        getVendorByVendorId();

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // useEffect(()=>{
    //     getChatByVendorId()
    // },[])

    const getVendorByVendorId = async () => {


        try {
            const model = new Vendor();
            let locationModel = new Location();

            const result = await model.getById(id);

            let cities = await locationModel.getAllCities();


            cities = cities.rajaongkir.results;

            cities.map(city => {
                if (result.city_code === city.city_id) {
                    result.city_name = city.city_name
                }
            })
            //
            // result.city_name = "Example City"

            setVendor(result);
            setIsLoading(false);
        } catch (e) {
            console.log(e)
        }
    }

    const getProductsByVendorId = async () => {
        try {
            const model = new Product();

            const result = await model.getByVendorId(id);

            setProducts(result);
            console.log(result)
        } catch (e) {
            console.log(e)
        }
    }

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    return (
        <>
            <Container style={{minHeight: 'calc(100vh - 433px)', paddingTop: 50}}>
                <Snackbar
                    autoHideDuration={3000}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={isSnackbarShown}
                    onClose={() => setSnackbarShown(false)}
                    message={"Please login to chat with " + vendor.name + "!"}
                />


                <Row style={{position: 'fixed', bottom: 60, right: 40}} onClick={() => {
                    if (localStorage.getItem('user')) {
                        setShowChat(true)

                        const list = document.getElementById("chat");
                        if (list) {
                            console.log("list is found")
                            list.scrollTo(0, list.scrollHeight)
                        } else {
                            console.log("list is not found")
                        }
                    } else {
                        setSnackbarShown(true)
                    }

                }}
                >
                    <div style={{
                        backgroundColor: Palette.PRIMARY,
                        width: 65,
                        height: 65,
                        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.3)',
                        borderRadius: 35,
                        display: !showChat ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <IoMdChatbubbles size={27} color={'white'}/>
                    </div>
                </Row>

                {
                    isLoading ? <Spinner style={{width: '4rem', height: '4rem', marginLeft: '47%', marginTop: '15%'}}
                                         animation="border" variant="danger"/> :
                        <Row style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            paddingLeft: windowWidth < 768 ? 0 : 50,
                            paddingRight: windowWidth < 768 ? 0 : 50,
                            paddingBottom: 10
                        }}>
                            <Col
                                style={{display: 'flex', flexDirection: 'row', paddingTop: 30, paddingBottom: 15}}>
                                <img src={vendor.logo_url ? vendor.logo_url : '/no-image-placeholder.jpg'} style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)',
                                    objectFit: 'cover'
                                }}/>

                                <div style={{
                                    paddingLeft: 20,
                                    paddingTop: 10,
                                }}>
                                    <div style={{
                                        fontFamily: 'Signika',
                                        fontWeight: '600',
                                        fontSize: '1.25em'
                                    }}>
                                        {vendor.name}
                                    </div>

                                    <div style={{
                                        fontFamily: 'Open Sans',
                                        fontSize: '.9em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#969696'
                                    }}>
                                        <div style={{
                                            width: 20,
                                            height: 20,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <MdLocationOn style={{marginRight: 7}} size={20} color={'#969696'}/>
                                        </div>
                                        {vendor.city_name}
                                    </div>
                                </div>
                            </Col>

                            <Col md={12} style={{marginTop: 25, marginBottom: 25}}>
                                <div style={{fontFamily: 'Open Sans', fontWeight: '700', fontSize: '1.1em'}}>
                                    Featured Products
                                </div>
                            </Col>

                            {
                                products.map(product => {
                                    if (!product.active) return null;

                                    return (
                                        <Col md={3} style={{cursor: 'pointer', textDecoration: 'none'}}>
                                            <Link to={`/product/${product.id}`} style={{textDecoration: 'none'}}>
                                                <div style={{
                                                    fontFamily: 'Open Sans',
                                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                                                    borderRadius: 10,
                                                    fontSize: '.9em',
                                                    paddingLeft: 0,
                                                    paddingRight: 0,
                                                    paddingTop: 0,
                                                    marginBottom: 30,
                                                    color: 'black',
                                                }}>
                                                    <img
                                                        src={product.main_photo_url ? product.main_photo_url : '/no-image-placeholder.jpg'}
                                                        style={{
                                                            width: '100%',
                                                            borderTopLeftRadius: 10,
                                                            borderTopRightRadius: 10,
                                                            height: 150,
                                                            objectFit: 'cover'
                                                        }}/>


                                                    <div style={{height: 60}}>
                                                        <TextEllipsis
                                                            lines={2}
                                                            tag={'p'}
                                                            ellipsisChars={'...'}
                                                            tagClass={'className'}
                                                            useJsOnly={true}
                                                            style={{
                                                                fontFamily: 'Open Sans',
                                                                paddingLeft: 12,
                                                                paddingRight: 12,
                                                                marginTop: 7
                                                            }}
                                                        >
                                                            {product.name}
                                                        </TextEllipsis>
                                                    </div>

                                                    <div style={{
                                                        paddingTop: 8,
                                                        paddingLeft: 12,
                                                        paddingBottom: 12,
                                                        fontFamily: 'Open Sans',
                                                        fontWeight: '700'
                                                    }}>
                                                        Rp{thousandSeparator(product.price)}
                                                    </div>
                                                </div>
                                            </Link>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                }
                <ChatWidget
                    hide={()=>{setShowChat(false)}}
                    vendor={vendor}
                    show={showChat}/>
            </Container>

        </>
    )
}
