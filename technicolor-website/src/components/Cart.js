import {MdClose, MdStoreMallDirectory} from "react-icons/md";
import TextEllipsis from "react-text-ellipsis";
import {TiMinus, TiPlus, TiTrash} from "react-icons/ti";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {FaLayerGroup} from "react-icons/fa";
import CartManager from "../util/CartManager";
import Snackbar from "@material-ui/core/Snackbar";

function Cart(props) {

    // const [showBagDrawer, setShowBagDrawer] = useState(false);
    const [showBag, setShowBag] = useState(false);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [quantity, setQuantity] = useState(1);

    let {cart, setCart, openLogin} = props;

    const [isSnackbarShown, setSnackbarShown] = useState(false);


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

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const enableScrolling = () => {
        window.onscroll = function () {
        };
    }


    return (
        <>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={isSnackbarShown}
                onClose={() => setSnackbarShown(false)}
                message="To continue the checkout process, please login or create a new account if you don't have one"
            />


            <div style={{
                opacity: props.isOpen ? 1 : 0,
                transition: 'opacity .15s',
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                right: 0,
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
                        right: props.isOpen ? 0 : -450,
                        transition: 'right .3s',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'scroll'
                    }}
                >

                    <MdClose style={{marginTop: 20, marginRight: 25, alignSelf: 'flex-end', cursor: 'pointer'}}
                             size={30}
                             onClick={() => {
                                 props.close(false)

                                 setTimeout(() => {
                                     props.close()
                                     enableScrolling()
                                 }, 300)
                             }}/>

                    {
                        cart.map((item, index) => {
                            console.log(item)

                            return (
                                <>
                                    <Link to={`/store/${item.vendor_id}`}
                                          onClick={() => props.close()}
                                          style={{textDecorationLine: 'none', color: 'black'}}>
                                        <div style={{
                                            margin: 20,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <MdStoreMallDirectory style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>

                                            <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                                {item.vendor?.name}
                                            </div>
                                        </div>
                                    </Link>

                                    <Link to={`/product/${item.id}`}
                                          onClick={() => props.close()}
                                          style={{textDecorationLine: 'none', color: 'black'}}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            paddingTop: 10,
                                            paddingLeft: 40,
                                            paddingRight: 40
                                        }}>
                                            <img
                                                src={item.main_photo_url ? item.main_photo_url : '/no-image-placeholder.jpg'}
                                                style={{
                                                    borderRadius: 7,
                                                    height: 180,
                                                    width: 130,
                                                    objectFit: 'contain'
                                                }}/>

                                            <div style={{
                                                marginLeft: 20,
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
                                                    {item.name}
                                                </TextEllipsis>

                                                {item.size &&
                                                <div style={{fontSize: '.85em', color: '#949494', marginBottom: 3}}>
                                                    Size: {item.size}
                                                </div>
                                                }

                                                <div style={{fontSize: '.9em', fontWeight: '600'}}>
                                                    Rp{item.price ? thousandSeparator(item.price) : item.price}
                                                </div>

                                                <div
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        width: '100%',
                                                        marginTop: 15,
                                                        alignItems: 'center',
                                                        paddingRight: 15,
                                                    }}>
                                                    <div style={{flex: 1}}>
                                                        <div style={{
                                                            width: 120,
                                                            border: '1px solid #e6e6e6',
                                                            color: 'black',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingTop: 4,
                                                            paddingBottom: 4,
                                                            borderRadius: 4,
                                                            backgroundColor: '#f2f2f2',
                                                        }}>
                                                            <TiMinus
                                                                size={13}
                                                                style={{
                                                                    marginLeft: 15,
                                                                    cursor: item.quantity === 1 ? 'auto' : 'pointer'
                                                                }}
                                                                color={item.quantity === 1 ? 'grey' : 'black'}
                                                                onClick={(e) => {
                                                                    if (item.quantity !== 1) {
                                                                        const cartTemp = [...cart];
                                                                        cartTemp[index].quantity--;

                                                                        setCart(cartTemp);
                                                                        CartManager.decreaseItemQuantity(index)
                                                                    }
                                                                }}/>
                                                            <div
                                                                style={{
                                                                flex: 1,
                                                                textAlign: 'center',
                                                                fontSize: '.9em'
                                                            }}>{item.quantity}</div>
                                                            <TiPlus
                                                                size={13}
                                                                style={{marginRight: 15, cursor: 'pointer'}}
                                                                onClick={(e) => {
                                                                    const cartTemp = [...cart];
                                                                    cartTemp[index].quantity++;

                                                                    setCart(cartTemp);
                                                                    CartManager.addItemQuantity(index)
                                                                }}/>
                                                        </div>
                                                    </div>

                                                    <TiTrash size={25} style={{cursor: 'pointer'}} onClick={() => {
                                                        const cartTemp = [...cart];
                                                        cartTemp.splice(index, 1);

                                                        setCart(cartTemp);
                                                        CartManager.removeItem(index)
                                                    }}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div style={{
                                        height: 1.5,
                                        backgroundColor: '#e8e8e8',
                                        marginLeft: windowWidth < 768 ? 40 : 20,
                                        marginRight: 20,
                                        marginTop: 20
                                    }}/>
                                </>
                            )
                        })
                    }

                    <div style={{flex: 1}}/>

                    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: 30, paddingRight: 20}}>
                        <div style={{fontFamily: 'Signika', color: 'grey', flex: 1}}>
                            TOTAL
                        </div>

                        <div style={{fontFamily: 'Signika', color: 'black'}}>
                            Rp{
                            thousandSeparator(CartManager.getCartContent().reduce((total, obj) => {
                                return total + obj.price * obj.quantity
                            }, 0))
                        }
                        </div>
                    </div>

                    <div style={{marginTop: 50}}>
                        <Link to={'/shipping-information'}>
                            <Button
                                onClick={(e) => {
                                    if (!localStorage.getItem('user')) {
                                        setSnackbarShown(true)

                                        e.preventDefault()

                                        openLogin();
                                    }
                                    props.close()
                                }}
                                style={{
                                    width: '100%', borderRadius: 0, borderColor: 'rgb(240, 98, 94)',
                                    backgroundColor: 'rgb(240, 98, 94)', fontFamily: 'Signika',
                                    paddingTop: 30,
                                    paddingBottom: 30,
                                    fontWeight: '600'
                                }}>
                                CHECKOUT
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
