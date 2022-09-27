import React, {useEffect, useState, useRef} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {FaAngleDown} from "react-icons/fa";
import Select, {components} from "react-select";
import {TiMinus, TiPlus, TiTrash} from "react-icons/ti";
import Button from "react-bootstrap/Button";
import TextEllipsis from "react-text-ellipsis";
import Palette from "../Palette";
import {AiOutlineClose} from "react-icons/ai";
import {MdSend} from "react-icons/md";
import {IoMdChatbubbles} from "react-icons/io";
import Product from "../models/Product";
import Snackbar from "@material-ui/core/Snackbar";
import Vendor from "../models/Vendor";
import CartManager from "../util/CartManager";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ChatWidget from "../components/ChatWidget";
import Spinner from "react-bootstrap/Spinner";

export default function ProductPage(props) {
    const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [note, setNote] = useState('');
    const [sizeOptions, setSizeOptions] = useState([
        {value: 'S', label: 'S'},
        {value: 'M', label: 'M'},
        {value: 'L', label: 'L'}
    ]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const chatRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const {id} = props.match.params;
    const [product, setProduct] = useState({});
    const {cart, setCart} = props;

    const [vendor, setVendor] = useState({})

    useEffect(() => {
        getProduct();

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const getProduct = async () => {
        try {
            const model = new Product();

            const result = await model.getById(id);
            console.log('Product', result)
            const productImages = [];

            if (result.main_photo_url) productImages.push({
                url: result.main_photo_url
            })

            result.photos.map(photo => {
                productImages.push({
                    url: photo
                })
            })

            setProductImages(productImages)

            for (let i in result.size) {
                result.size[i] = {value: result.size[i], label: result.size[i]}
            }

            setSizeOptions(result.size);

            let vendor = await getVendorById(result);


            // if (result.size && Array.isArray(result.size)) {
            //     const sizeOptionsTemp = []
            //
            //     result.size.forEach((size, idx) => {
            //         if (idx === 0) {
            //             setSize({
            //                 label: size,
            //                 value: size
            //             })
            //         }
            //
            //         sizeOptionsTemp.push({
            //             label: size,
            //             value: size
            //         })
            //     })
            //
            //     // setSizeOptions(sizeOptionsTemp)
            // }
            setIsLoading(false);

        } catch (e) {
            console.log('e', e)
        }
    }

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }

    const DropdownIndicator = props => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <FaAngleDown color={'grey'}/>
                </components.DropdownIndicator>
            )
        );
    };

    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState(sizeOptions[0])
    const [showBag, setShowBag] = useState(false);
    const [showBagDrawer, setShowBagDrawer] = useState(false);
    const [isImageLoaded, setImageLoaded] = useState(false);

    const productImgRef = useRef(null);

    const [productImageTransformOrigin, setImageTransformOrigin] = useState(null);
    const [productImages, setProductImages] = useState([]);

    const [productImgHoveredIdx, setProductImgHoveredIdx] = useState(-1);
    const [selectedProductImgIdx, setSelectedProductImgIdx] = useState(0);
    const [isSnackbarShown, setSnackbarShown] = useState(false);

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

    useEffect(() => {
        return () => {
            enableScrolling()
        }
    }, [])

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const getVendorById = async (product) => {
        try {
            let model = new Vendor();

            const result = await model.getById(product.vendor_id);

            setVendor(result)

            setProduct({
                ...product,
                vendor: result
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>

            <Container style={{backgroundColor: 'white', borderRadius: 10, color: '#363636', marginTop: 30}}>
                <Modal show={isConfirmationModalVisible} centered onHide={() => {
                    setNote('')
                    setConfirmationModalVisible(false)
                }}>

                    <Row>
                        <Col style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            padding: 30,
                            paddingLeft: 30,
                            paddingRight: 30
                        }}>
                            <Row style={{
                                fontFamily: 'Signika',
                                fontWeight: '600',
                                color: '#302a28',
                                fontSize: 19,
                                marginBottom: 20,
                                marginLeft: 0,
                            }}>
                                Confirmation
                            </Row>


                            <Row>


                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    paddingLeft: 40,
                                    paddingRight: 40,
                                    marginBottom: 20,
                                    width: '100%'
                                }}>
                                    <img
                                        src={product.main_photo_url ? product.main_photo_url : '/no-image-placeholder.jpg'}
                                        style={{
                                            borderRadius: 7,
                                            height: 150,
                                            width: 110,
                                            objectFit: product.main_photo_url ? 'contain' : 'cover'
                                        }}/>

                                    <div style={{
                                        marginLeft: 15,
                                        fontFamily: 'Signika',
                                        marginTop: 10,
                                        fontSize: '1.1em',
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        flex: 1
                                    }}>
                                        <TextEllipsis
                                            lines={1}
                                            tag={'p'}
                                            ellipsisChars={'...'}
                                            tagClass={'className'}
                                            useJsOnly={true}
                                            style={{marginTop: 7, marginBottom: 3, paddingRight: 15}}
                                        >
                                            {product.name}
                                        </TextEllipsis>

                                        {size &&
                                        <div style={{fontSize: '.85em', color: '#949494', marginBottom: 3}}>
                                            Size: {size.value}
                                        </div>
                                        }

                                        <div style={{fontSize: '.9em', fontWeight: '600'}}>
                                            Rp{product.price ? thousandSeparator(product.price * quantity) : product.price}
                                        </div>

                                        <div style={{fontSize: '.8em', fontWeight: '400'}}>
                                            Quantity: {quantity} item(s)
                                        </div>
                                    </div>
                                </div>


                            </Row>

                            <>
                                <Row style={{marginTop: 5}}>
                                    <Col>
                                        <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Note (optional)</b>
                                    </Col>

                                    <Col md={12} style={{marginTop: 4}}>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control as="textarea" rows={2}
                                                          onChange={(e) => {
                                                              setNote(e.target.value)
                                                          }}
                                                          value={note}
                                                          placeholder={'Enter note here'}/>
                                            {/*<Form.Text className="text-muted">*/}
                                            {/*    We'll never share your email with anyone else.*/}
                                            {/*</Form.Text>*/}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>

                            <Row>
                                <Button
                                    onClick={() => {
                                        let inCart = false;
                                        let cartIdx = -1;

                                        cart.map((item, idx) => {
                                            if (item.id === product.id) {
                                                inCart = true;
                                                cartIdx = idx;
                                            }
                                        })

                                        console.log(inCart)

                                        if (inCart) {
                                            const cartTemp = [...cart];

                                            cartTemp[cartIdx] = {
                                                ...product,
                                                quantity,
                                                size: size ? size.value : null,
                                                note
                                            };

                                            setCart(cartTemp);

                                            CartManager.storeCartData(cartTemp)
                                        } else {
                                            setCart([
                                                ...cart,
                                                {
                                                    ...product,
                                                    quantity,
                                                    size: size ? size.value : null,
                                                    note
                                                }
                                            ])

                                            CartManager.addToCart({
                                                ...product,
                                                quantity,
                                                size: size ? size.value : null,
                                                note
                                            })

                                        }

                                        setConfirmationModalVisible(false)

                                        setNote('');

                                        setSnackbarShown(true)
                                        props.setCartOpen(true)

                                        setShowBag(true)

                                        setTimeout(() => {
                                            setShowBagDrawer(true)
                                            disableScrolling()
                                        }, 150)
                                    }}
                                    style={{
                                        width: '100%',
                                        marginTop: 20,
                                        borderColor: 'rgb(240, 98, 94)',
                                        backgroundColor: 'rgb(240, 98, 94)',
                                        fontFamily: 'Signika',
                                        fontWeight: '600'
                                    }}>
                                    Add to Bag
                                </Button>

                                <div
                                    style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: 15}}>
                                    <a href={'#'} style={{fontFamily: 'Signika'}} onClick={(e) => {
                                        e.preventDefault()
                                        setConfirmationModalVisible(false)
                                    }}>
                                        Cancel
                                    </a>
                                </div>
                            </Row>

                        </Col>
                    </Row>
                </Modal>

                <Snackbar
                    autoHideDuration={3000}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={isSnackbarShown}
                    onClose={() => setSnackbarShown(false)}
                    message="Cart has been updated!"
                />

                {
                    isLoading ?
                        <Spinner style={{width: '4rem', height: '4rem', marginLeft: '47%', marginTop: '15%'}}
                                 animation="border" variant="danger"/> :
                        <Row>
                            <Col
                                sm={12}
                                md={6}
                                style={{
                                    padding: 50,
                                    paddingTop: windowWidth < 768 ? 30 : 50,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // justifyContent: 'center',
                                    order: windowWidth < 768 ? 1 : 0
                                }}>
                                <div style={{fontFamily: 'Signika', fontWeight: '400', fontSize: '1.5em'}}>
                                    {product.name}
                                </div>

                                <div style={{fontFamily: 'Signika', fontWeight: '300', fontSize: '1.4em'}}>
                                    Rp{product.price ? thousandSeparator(product.price) : product.price}
                                </div>

                                <div style={{fontFamily: 'Signika', marginTop: 30, fontWeight: '500'}}>
                                    DESCRIPTION
                                </div>

                                <div style={{fontFamily: 'Open Sans', marginTop: 20}}>
                                    {product.description ? product.description : '-'}
                                </div>

                                <div style={{height: 1, width: '100%', backgroundColor: '#a6a6a6', marginTop: 20}}/>

                                {
                                    product.size_description &&
                                    <>
                                        <div style={{fontFamily: 'Signika', marginTop: 15}}>
                                            SIZE DETAILS
                                        </div>

                                        <div style={{fontFamily: 'Signika', marginTop: 15}}>
                                            {product.size_description}
                                        </div>

                                        <div style={{
                                            height: 1,
                                            width: '100%',
                                            backgroundColor: '#a6a6a6',
                                            marginTop: 20
                                        }}/>
                                    </>
                                }


                                <div style={{
                                    fontFamily: 'Signika',
                                    marginTop: 30,
                                    fontWeight: '500',
                                    color: '#575757',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    {/*{*/}
                                    {/*    size &&*/}
                                    <>
                                        <div style={{width: 170}}>
                                            Size
                                        </div>
                                        <div style={{width: 180}}>
                                            <Select
                                                onChange={(option) => {
                                                    setSize(option)
                                                }}
                                                value={size}
                                                options={sizeOptions}
                                                styles={{
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        cursor: 'pointer',

                                                    }),
                                                    control: provided => ({
                                                        ...provided,
                                                        borderColor: '#e6e6e6',
                                                        fontFamily: 'Open Sans',
                                                        fontWeight: '600',
                                                    })
                                                }}
                                                components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                            />
                                        </div>
                                    </>
                                    {/*}*/}

                                </div>

                                <div style={{
                                    fontFamily: 'Signika',
                                    marginTop: 15,
                                    // marginTop: size ? 15 : 0,
                                    fontWeight: '500',
                                    color: '#575757',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <div style={{width: 170}}>
                                        Quantity
                                    </div>
                                    <div style={{
                                        width: 180,
                                        border: '1px solid #e6e6e6',
                                        color: 'black',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        borderRadius: 4
                                    }}>
                                        <TiMinus style={{marginLeft: 15, cursor: quantity === 1 ? 'auto' : 'pointer'}}
                                                 color={quantity === 1 ? 'grey' : 'black'} onClick={() => {
                                            if (quantity !== 1) setQuantity(quantity - 1)
                                        }}/>
                                        <div style={{flex: 1, textAlign: 'center'}}>{quantity}</div>
                                        <TiPlus style={{marginRight: 15, cursor: 'pointer'}}
                                                onClick={() => setQuantity(quantity + 1)}/>
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        onClick={() => {
                                            setConfirmationModalVisible(true)
                                        }}
                                        style={{
                                            width: '100%',
                                            marginTop: 50,
                                            borderColor: 'rgb(240, 98, 94)',
                                            backgroundColor: 'rgb(240, 98, 94)',
                                            fontFamily: 'Signika',
                                            fontWeight: '600'
                                        }}>
                                        Add to Bag
                                    </Button>
                                </div>
                            </Col>

                            <Col style={{paddingBottom: 30}}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: undefined,
                                        overflow: 'hidden',
                                        marginTop: 40,
                                    }}
                                    ref={productImgRef}
                                    onMouseLeave={() => setImageTransformOrigin(null)}
                                    onMouseMove={(e) => {
                                        if (productImages[selectedProductImgIdx]?.loaded) {
                                            setImageTransformOrigin({
                                                x: (e.clientX - productImgRef.current.getBoundingClientRect().left) / productImgRef.current.clientWidth * 100,
                                                y: (e.clientY - productImgRef.current.getBoundingClientRect().top) / productImgRef.current.clientHeight * 100
                                            })
                                        }
                                    }}
                                >
                                    <img
                                        onLoad={() => setImageLoaded(true)}
                                        // onClick={() => {
                                        //     if (isImageLoaded && session.class_image_url) setImagePreview(true)
                                        // }}
                                        src={productImages[selectedProductImgIdx]?.url ? productImages[selectedProductImgIdx]?.url : '/image/no-img-placeholder.png'}
                                        style={{
                                            cursor: productImages[selectedProductImgIdx]?.loaded ? 'crosshair' : 'auto',
                                            objectFit: 'contain',
                                            width: '100%',
                                            maxHeight: 400,
                                            backgroundColor: 'white',
                                            transform: productImageTransformOrigin ? 'scale(1.5)' : 'none',
                                            transformOrigin: productImageTransformOrigin ? `${productImageTransformOrigin.x}% ${productImageTransformOrigin.y}%` : '50% 50%'
                                        }}/>
                                </div>
                                <Row style={{
                                    marginLeft: 0,
                                    marginRight: 0,
                                    borderTop: '1px solid #e5e7e9',
                                    marginTop: 20,
                                    paddingTop: 15
                                }}>
                                    {
                                        productImages.map(
                                            (productImage, idx) => {
                                                return (
                                                    <Col
                                                        onMouseOver={() => {
                                                            setProductImgHoveredIdx(idx)
                                                        }}
                                                        onMouseLeave={() => {
                                                            setProductImgHoveredIdx(-1)
                                                        }}
                                                        onLoad={() => {
                                                            const productImagesTemp = [...productImages];

                                                            productImagesTemp[idx].loaded = true;

                                                            setProductImages(productImagesTemp);
                                                        }}
                                                        onClick={() => {
                                                            setSelectedProductImgIdx(idx)
                                                        }}
                                                        style={{
                                                            marginLeft: 0,
                                                            marginRight: 15,
                                                            backgroundColor: productImage.loaded ? 'white' : '#f0f0f0',
                                                            maxWidth: 70,
                                                            maxHeight: 70,
                                                            borderRadius: 5,
                                                            boxShadow: productImgHoveredIdx === idx || selectedProductImgIdx === idx ? '0 3px 6px 0 rgba(49,53,59,0.5)' : 'none',
                                                            paddingLeft: 0,
                                                            cursor: 'pointer',
                                                        }}>
                                                        <img
                                                            src={productImage.url}
                                                            style={{
                                                                objectFit: 'contain',
                                                                width: 70,
                                                                height: 70,
                                                                // backgroundColor: 'white',
                                                                borderRadius: 5,
                                                            }}/>
                                                    </Col>
                                                )
                                            }
                                        )
                                    }
                                </Row>
                            </Col>
                        </Row>
                }


                <Row style={{position: 'fixed', bottom: 60, right: 40}} onClick={() => {

                    setShowChat(true)

                    const list = document.getElementById("chat");
                    if (list) {
                        console.log("list is found")
                        list.scrollTo(0, list.scrollHeight)
                    } else {
                        console.log("list is not found")
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

                <Row style={{position: 'fixed', bottom: 60, right: 40, display: 'none'}}>
                    <div style={{
                        backgroundColor: '#FFFFFFF2',
                        width: 350,
                        paddingTop: 18,
                        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                        borderRadius: 8
                    }}>
                        <div style={{display: 'flex', flexDirection: 'row', paddingLeft: 15, paddingRight: 15}}>
                            <div style={{
                                fontFamily: 'Signika',
                                fontSize: '1.15em',
                                flex: 1
                            }}>
                                Chatting
                            </div>

                            <AiOutlineClose size={20} style={{marginTop: 3, cursor: 'pointer'}}/>
                        </div>

                        <div style={{height: 1, backgroundColor: '#e6e6e6', marginTop: 17, marginBottom: 15}}/>

                        <div style={{maxHeight: 400, overflowY: 'scroll'}}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 15,
                                marginRight: 15,
                                marginBottom: 5
                            }}>
                                <img src={'./timberland.png'} style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30,
                                    objectFit: 'cover',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
                                }}/>

                                <div style={{marginLeft: 12, marginTop: 3,}}>
                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontWeight: '700', fontSize: '.9em',

                                        }}
                                    >
                                        Timberland Official Indonesia
                                    </TextEllipsis>

                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontSize: '.8em', color: 'grey',
                                            marginTop: -10
                                        }}
                                    >
                                        Halo, Terima Kasih telah menghubungi Timberland Official Indonesia
                                    </TextEllipsis>
                                </div>
                            </div>

                            <div style={{
                                height: 1,
                                backgroundColor: '#e6e6e6',
                                marginBottom: 14,
                                marginLeft: 10,
                                marginRight: 10
                            }}/>

                            <div style={{display: 'flex', flexDirection: 'row', marginLeft: 15, marginRight: 15}}>
                                <img src={'./timberland.png'} style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30,
                                    objectFit: 'cover',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
                                }}/>

                                <div style={{marginLeft: 10, marginTop: 3,}}>
                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontWeight: '700', fontSize: '.9em',
                                        }}
                                    >
                                        Timberland Official Indonesia
                                    </TextEllipsis>

                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontSize: '.8em', color: 'grey',
                                            marginTop: -10
                                        }}
                                    >
                                        Halo, Terima Kasih telah menghubungin Timberland Official Indonesia
                                    </TextEllipsis>
                                </div>
                            </div>

                            <div style={{
                                height: 1,
                                backgroundColor: '#e6e6e6',
                                marginBottom: 14,
                                marginLeft: 10,
                                marginRight: 10
                            }}/>

                            <div style={{display: 'flex', flexDirection: 'row', marginLeft: 15, marginRight: 15}}>
                                <img src={'./timberland.png'} style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 30,
                                    objectFit: 'cover',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
                                }}/>

                                <div style={{marginLeft: 10, marginTop: 3,}}>
                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontWeight: '700', fontSize: '.9em',
                                        }}
                                    >
                                        Timberland Official Indonesia
                                    </TextEllipsis>

                                    <TextEllipsis
                                        lines={1}
                                        tag={'p'}
                                        ellipsisChars={'...'}
                                        tagClass={'className'}
                                        useJsOnly={true}
                                        style={{
                                            fontFamily: 'Open Sans', fontSize: '.8em', color: 'grey',
                                            marginTop: -10
                                        }}
                                    >
                                        Halo, Terima Kasih telah menghubungin Timberland Official Indonesia
                                    </TextEllipsis>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <ChatWidget
                    hide={() => {
                        setShowChat(false)
                    }}
                    vendor={vendor}
                    show={showChat}/>
            </Container>

        </>
    )
}
