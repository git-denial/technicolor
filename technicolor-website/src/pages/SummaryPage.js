import React, {useEffect, useState} from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select, {components} from "react-select";
import {FaAngleDown} from "react-icons/fa";
import TextEllipsis from "react-text-ellipsis";
import {TiMinus, TiPlus, TiTrash} from "react-icons/ti";
import {MdStoreMallDirectory} from "react-icons/md";
import Palette from "../Palette";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CartManager from "../util/CartManager";
import Location from "../models/Location";
import Spinner from "react-bootstrap/Spinner";
import Transaction from "../models/Transaction";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

export default function SummaryPage(props) {
    const [courierOptions, setCourierOptions] = useState([]);

    const DropdownIndicator = props => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <FaAngleDown color={'grey'}/>
                </components.DropdownIndicator>
            )
        );
    };

    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const [isSnackbarShown, setSnackbarShown] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedCourier, setSelectedCourier] = useState({});
    let {cart, setCart} = props;
    const [courierService, setCourierService] = useState({})
    const [selectedCourierService, setSelectedCourierService] = useState({});
    const [notes, setNotes] = useState({});

    const [courierPrices, setCourierPrices] = useState({})
    cart.map((item, idx) => {
        cart[idx].idx = idx;
    })

    const [groupedCart, setGroupedCart] = useState(groupBy(cart, 'vendor_id'))


    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    let totalDeliveryFee = 0;

    useEffect(() => {
        if (!props.location.state) props.history.push('/')

        if (cart.length === 0) props.history.push('/')

        // console.log(Object.keys(groupedCart))

        getCourierData()

    }, [])

    const getCourierData = async () => {

        try {

            let prices = {}

            for (let key of Object.keys(groupedCart)) {

                let gc = groupedCart[key]

                let totalWeight = gc.reduce((accumulator, product) => {
                    return accumulator + product.weight * product.quantity
                }, 0)

                console.log("BERAT ", totalWeight)

                console.log(gc[0].vendor?.city_code, props.location.state.city, totalWeight)

                if (gc && gc.length) {
                    let result = await getAvailableCouriers(gc[0].vendor?.city_code, props.location.state.city, totalWeight)
                    prices[key] = result.rajaongkir.results[0].costs;

                    const courierOptionsTemp = [];

                    result.rajaongkir?.results.forEach(result => {
                        courierOptionsTemp.push({label: result.name, value: result.code})
                    })

                    setCourierOptions(courierOptionsTemp);
                }

                console.log(prices)
                setCourierPrices(prices)

            }
        } catch (e) {
            console.log(e)
        }

    }

    const getAvailableCouriers = async (origin, destination, weight) => {
        let model = new Location();
        let result = await model.getAvailableCourier({
            origin: origin,
            destination: destination,
            weight: weight,
        })
        return result
    }

    useEffect(() => {
        const notesTemp = [];

        cart.forEach(product => {
            if (product.note) {
                notesTemp[product.id] = product.note;
            }
        })

        setNotes(notesTemp)


    }, [cart])


    const updateDeliveryFee = async (product, groupedCart) => {
        if (!selectedCourier[product.vendor_id]) return;

        const courierServiceTemp = {...courierService};

        delete courierServiceTemp[product.vendor_id]

        let model = new Location();
        let weight = 0;

        if (!groupedCart[product.vendor_id]) {
            const selectedCourierServiceTemp = {...selectedCourierService};

            delete selectedCourierServiceTemp[product.vendor_id];

            setSelectedCourierService(selectedCourierServiceTemp)

            return setCourierService(courierServiceTemp)
        }

        groupedCart[product.vendor_id].map(product => {
            weight += product.weight * product.quantity;
        })


        let request = {
            origin: product.vendor.city_code,
            destination: props.location.state.city,
            weight,
            courier: selectedCourier[product.vendor_id].value
        };

        let result = await model.getPrice(request);

        if (request.origin === 0 || request.destination === 0 || request.weight === 0 || request.courier === null) {
            return null;
        }

        let services = result.rajaongkir.results[0].costs;

        const servicesTemp = [];
        let selectedIdx = -1;


        services.map((service, idx) => {
            if (service.service === selectedCourierService[product.vendor_id]?.value?.service) {
                const selectedCourierServiceTemp = {...selectedCourierService};

                selectedCourierServiceTemp[product.vendor_id] = {
                    label: `${service.service} (${service.cost[0].etd} hari) - Rp ${thousandSeparator(service.cost[0].value)}`,
                    value: service
                };

                setSelectedCourierService(selectedCourierServiceTemp)
            }

            servicesTemp.push({
                label: `${service.service} (${service.cost[0].etd} hari) - Rp ${thousandSeparator(service.cost[0].value)}`,
                value: service
            })
        })

        courierServiceTemp[product.vendor_id] = servicesTemp;

        setCourierService(courierServiceTemp)
    }

    return (
        <Container style={{paddingTop: 30}}>

            <Row>
                <Col md={12} lg={7} style={{
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
                        Shopping Cart
                    </Row>

                    {
                        Object.keys(groupedCart).map((item, index) => {
                            let totalItems = 0;

                            groupedCart[item].map(product => totalItems += product.quantity);

                            return groupedCart[item].map((product, idx) => {

                                console.log(product)

                                return (
                                    <>
                                        <Row
                                        >
                                            {idx === 0 &&
                                            <div style={{
                                                margin: 20,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}
                                            >
                                                <MdStoreMallDirectory
                                                    style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>

                                                <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                                    {product.vendor?.name}
                                                </div>
                                            </div>
                                            }
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                paddingTop: 10,
                                                paddingLeft: 40,
                                                paddingRight: 40,
                                                width: '100%'
                                            }}
                                            >
                                                <img
                                                    src={product.main_photo_url ? product.main_photo_url : '/no-image-placeholder.jpg'}
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
                                                        {product.name}
                                                    </TextEllipsis>

                                                    {product.size &&
                                                    <div style={{fontSize: '.85em', color: '#949494', marginBottom: 3}}>
                                                        Size: {product.size}
                                                    </div>
                                                    }

                                                    <div style={{fontSize: '.9em', fontWeight: '600'}}>
                                                        Rp {product.price ? thousandSeparator(product.price) : product.price}
                                                    </div>

                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        width: '100%',
                                                        marginTop: 15,
                                                        alignItems: 'center',
                                                        paddingRight: 15
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
                                                                        cursor: product.quantity === 1 ? 'auto' : 'pointer'
                                                                    }}
                                                                    color={product.quantity === 1 ? 'grey' : 'black'}
                                                                    onClick={() => {
                                                                        if (product.quantity !== 1) {
                                                                            const cartTemp = [...cart];
                                                                            cartTemp[product.idx].quantity--;

                                                                            setCart(cartTemp);
                                                                            CartManager.decreaseItemQuantity(product.idx)

                                                                            updateDeliveryFee(product, groupBy(cartTemp, 'vendor_id'))
                                                                        }
                                                                    }}/>
                                                                <div style={{
                                                                    flex: 1,
                                                                    textAlign: 'center',
                                                                    fontSize: '.9em'
                                                                }}>{product.quantity}</div>
                                                                <TiPlus
                                                                    size={13}
                                                                    style={{marginRight: 15, cursor: 'pointer'}}
                                                                    onClick={() => {
                                                                        const cartTemp = [...cart];
                                                                        cartTemp[product.idx].quantity++;

                                                                        setCart(cartTemp);
                                                                        CartManager.addItemQuantity(product.idx)

                                                                        updateDeliveryFee(product, groupBy(cartTemp, 'vendor_id'))
                                                                    }}/>
                                                            </div>
                                                        </div>


                                                        <TiTrash size={25} style={{cursor: 'pointer'}} onClick={() => {
                                                            const cartTemp = [...cart];
                                                            cartTemp.splice(product.idx, 1);

                                                            setGroupedCart(groupBy(cartTemp, 'vendor_id'))
                                                            setCart(cartTemp);
                                                            CartManager.removeItem(product.idx)

                                                            updateDeliveryFee(product, groupBy(cartTemp, 'vendor_id'))
                                                        }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>

                                        <>
                                            <Row style={{marginTop: 15}}>
                                                <Col>
                                                    <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Note
                                                        (optional)</b>
                                                </Col>

                                                <Col md={12} style={{marginTop: 4}}>
                                                    <Form.Group controlId="formBasicEmail">
                                                        <Form.Control as="textarea" rows={2}
                                                                      onChange={(e) => {
                                                                          notes[product.id] = e.target.value
                                                                      }}
                                                                      value={notes[product.id]}
                                                                      placeholder={'Enter note here'}/>
                                                        {/*<Form.Text className="text-muted">*/}
                                                        {/*    We'll never share your email with anyone else.*/}
                                                        {/*</Form.Text>*/}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </>

                                        {idx === groupedCart[item].length - 1 &&
                                        <>
                                            <Row style={{marginTop: 10, marginBottom: 3}}>
                                                <Col>
                                                    <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Choose Courier</b>
                                                </Col>
                                            </Row>

                                            <Select
                                                onChange={async (option) => {
                                                    const selectedCourierTemp = {...selectedCourier};

                                                    selectedCourierTemp[item] = option;

                                                    setSelectedCourier(selectedCourierTemp)

                                                    let model = new Location();
                                                    let weight = 0;

                                                    groupedCart[product.vendor_id].map(product => {
                                                        weight += product.weight * product.quantity;
                                                    })

                                                    let request = {
                                                        origin: product.vendor.city_code,
                                                        destination: props.location.state.city,
                                                        weight,
                                                        courier: option.value
                                                    };

                                                    let result = await model.getPrice(request);

                                                    if (request.origin === 0 || request.destination === 0 || request.weight === 0 || request.courier === null) {
                                                        return null;
                                                    }

                                                    let services = result.rajaongkir.results[0].costs;

                                                    const servicesTemp = [];

                                                    services.map(service => {
                                                        servicesTemp.push({
                                                            label: `${service.service} (${service.cost[0].etd} hari) - Rp ${thousandSeparator(service.cost[0].value)}`,
                                                            value: service
                                                        })
                                                    })

                                                    const courierServiceTemp = {
                                                        ...courierService
                                                    };

                                                    courierServiceTemp[item] = servicesTemp;

                                                    console.log(courierServiceTemp)

                                                    setCourierService(courierServiceTemp)

                                                }}
                                                value={selectedCourier[item]}
                                                options={courierOptions}
                                                styles={{
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        cursor: 'pointer',
                                                        fontFamily: 'Signika'

                                                    }),
                                                    control: provided => ({
                                                        ...provided,
                                                        borderColor: '#e6e6e6',
                                                        fontFamily: 'Open Sans',
                                                        fontWeight: '600',
                                                        fontSize: 14,
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        display: 'flex',
                                                        justifyContent: 'center'
                                                    })
                                                }}
                                                components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                            />

                                            {selectedCourier[item] && !courierService[item] ?
                                                <>
                                                    <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Spinner size="sm" animation="border" variant="danger"/>
                                                </> :
                                                null
                                            }

                                            {selectedCourier && courierService[item]?.length > 0 ?
                                                <>
                                                    <Row style={{marginTop: 15, marginBottom: 3}}>
                                                        <Col>
                                                            <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Delivery
                                                                Duration</b>
                                                        </Col>
                                                    </Row>

                                                    <Select
                                                        onChange={(option) => {
                                                            const selectedCourierServiceTemp = {...selectedCourierService};

                                                            selectedCourierServiceTemp[item] = option;

                                                            setSelectedCourierService(selectedCourierServiceTemp);
                                                        }}
                                                        value={selectedCourierService[item]}
                                                        options={courierService[item]}
                                                        styles={{
                                                            option: (provided, state) => ({
                                                                ...provided,
                                                                cursor: 'pointer',
                                                                fontFamily: 'Signika'

                                                            }),
                                                            control: provided => ({
                                                                ...provided,
                                                                borderColor: '#e6e6e6',
                                                                fontFamily: 'Open Sans',
                                                                fontWeight: '600',
                                                                fontSize: 14,
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                display: 'flex',
                                                                justifyContent: 'center'
                                                            })
                                                        }}
                                                        components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                                    />
                                                </> : null
                                            }

                                            <Row style={{height: 1, backgroundColor: '#d4d4d4', marginTop: 30}}/>

                                            <Row style={{marginTop: 10}}>
                                                <Col>
                                                    <b style={{
                                                        color: '#999999',
                                                        paddingLeft: 0,
                                                        fontSize: 15
                                                    }}>Subtotal</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 17,
                                                            fontWeight: '600',
                                                            color: Palette.PRIMARY
                                                        }}>
                                                            Rp{selectedCourierService[item]?.value?.cost[0]?.value ? thousandSeparator(groupedCart[product.vendor_id].reduce((total, obj) => {
                                                            return total + obj.price * obj.quantity
                                                        }, 0) + selectedCourierService[item]?.value?.cost[0]?.value) : thousandSeparator(groupedCart[product.vendor_id].reduce((total, obj) => {
                                                            return total + obj.price * obj.quantity
                                                        }, 0))}
                                                        </Row>
                                                    </Col>
                                                </div>
                                            </Row>
                                            <Row style={{marginTop: 5}}>
                                                <Col>
                                                    <b style={{
                                                        color: '#999999',
                                                        paddingLeft: 0,
                                                        fontSize: 15,
                                                        fontWeight: '400'
                                                    }}>Price ({totalItems} item{totalItems > 1 ? 's' : null})</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 16,
                                                            fontWeight: '500'
                                                        }}>
                                                            Rp{thousandSeparator(groupedCart[product.vendor_id].reduce((total, obj) => {
                                                            return total + obj.price * obj.quantity
                                                        }, 0))}
                                                        </Row>
                                                    </Col>
                                                </div>
                                            </Row>

                                            {selectedCourierService[item]?.value?.cost[0]?.value &&
                                            <Row style={{marginTop: 5}}>
                                                <Col>
                                                    <b style={{
                                                        color: '#999999',
                                                        paddingLeft: 0,
                                                        fontSize: 15,
                                                        fontWeight: '400'
                                                    }}>Delivery Fee</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 16,
                                                            fontWeight: '500'
                                                        }}>
                                                            Rp{selectedCourierService[item]?.value?.cost[0]?.value ? thousandSeparator(selectedCourierService[item]?.value?.cost[0]?.value) : null}
                                                        </Row>
                                                    </Col>
                                                </div>
                                            </Row>
                                            }
                                        </>
                                        }
                                    </>
                                )
                            })
                        })
                    }
                </Col>


                <Col lg={5}>
                    <div style={{
                        position: 'fixed',
                        width: 475,
                        backgroundColor: 'white',
                        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                        borderRadius: 10,
                        padding: 20
                    }}>

                        <div style={{paddingLeft: 10, paddingRight: 10, marginTop: 5, marginLeft: 0}}>
                            <Row>
                                <b style={{color: 'rgb(49, 53, 59)', fontSize: 15, fontFamily: 'Open Sans'}}>Shopping
                                    Summary</b>
                            </Row>
                            <Row style={{marginTop: 10, opacity: 0.5}}>
                                <div style={{
                                    color: 'black',
                                    paddingLeft: 0,
                                    fontFamily: 'Open Sans',
                                    fontWeight: '500',
                                    fontSize: 14
                                }}>Total Price ({CartManager.getCartContent().reduce((total, obj) => {
                                    return total + obj.quantity
                                }, 0)} item{CartManager.getCartContent().reduce((total, obj) => {
                                    return total + obj.quantity
                                }, 0) ? 's' : null})
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    right: 20, fontFamily: 'Open Sans', fontWeight: '500',
                                    fontSize: 14
                                }}>Rp{thousandSeparator(CartManager.getCartContent().reduce((total, obj) => {
                                    return total + obj.quantity * obj.price
                                }, 0))}
                                </div>
                            </Row>
                            <>
                                <Row style={{marginTop: 5, opacity: 0.5}}>
                                    <div style={{
                                        color: 'black',
                                        paddingLeft: 0,
                                        fontFamily: 'Open Sans',
                                        fontWeight: '500',
                                        fontSize: 14
                                    }}>
                                        Total Delivery Fee
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        right: 20
                                    }}>Rp{
                                        Object.keys(selectedCourierService).map((key) => {
                                            totalDeliveryFee += selectedCourierService[key]?.value?.cost[0]?.value
                                        })
                                    }

                                        {thousandSeparator(totalDeliveryFee)}
                                    </div>
                                </Row>

                                <Row style={{height: 1, backgroundColor: '#d4d4d4', marginTop: 15}}/>

                                <Row style={{marginTop: 15}}>
                                    <b style={{
                                        color: 'rgb(49, 53, 59)',
                                        fontSize: 17,
                                        fontFamily: 'Open Sans'
                                    }}>Total</b>
                                    <div style={{position: 'absolute', right: 20}}>
                                        <b style={{
                                            fontSize: 17,
                                            fontFamily: 'Open Sans',
                                            color: Palette.PRIMARY
                                        }}>Rp{thousandSeparator(CartManager.getCartContent().reduce((total, obj) => {
                                            return total + obj.quantity * obj.price
                                        }, 0) + +totalDeliveryFee)}</b>
                                    </div>
                                </Row>

                                <Snackbar
                                    autoHideDuration={3000}
                                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                                    open={isSnackbarShown}
                                    onClose={() => setSnackbarShown(false)}
                                    message='Harap memilih kurir untuk semua barang Anda!'
                                />

                                <Row>
                                    <Col style={{paddingLeft: 0, paddingRight: 0}}>
                                        {/*<Link to={'upload-receipt'}>*/}
                                        <Button
                                            onClick={async () => {
                                                if (Object.keys(groupedCart).length !== Object.keys(selectedCourierService).length) {
                                                    setSnackbarShown(true)
                                                } else if (!isLoading) {
                                                    setLoading(true)

                                                    const order = [];
                                                    Object.keys(groupedCart).map((item, index) => {
                                                        const cart = groupedCart[item];
                                                        const orderLines = [];

                                                        cart.map(product => {
                                                            orderLines.push({
                                                                product_id: product.id,
                                                                quantity: product.quantity,
                                                                customization: {
                                                                    size: product.size
                                                                },
                                                                description: notes[product.id]
                                                            })
                                                        })

                                                        order.push({
                                                            vendor_id: cart[0].vendor_id,
                                                            address_info: props.location.state.user.address,
                                                            city_code: props.location.state.city,
                                                            delivery_fee: selectedCourierService[item]?.value?.cost[0]?.value,
                                                            delivery_method: selectedCourier[item]?.value,
                                                            order_lines: orderLines,
                                                            zip_code: props.location.state.user.zip_code,
                                                            delivery_service: selectedCourierService[item]?.value.service,
                                                        })
                                                    })

                                                    // console.log(notes)

                                                    try {
                                                        console.log('Orders to be submitted', order);
                                                        const model = new Transaction();

                                                        const result = await model.create({
                                                            order
                                                        });

                                                        setCart([])
                                                        CartManager.emptyCart();
                                                        props.history.push(`/upload-receipt/${result.id}`)
                                                    } catch (e) {
                                                        console.log(e)
                                                    }
                                                    // props.history.push('/upload-receipt')
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                borderColor: Object.keys(groupedCart).length !== Object.keys(selectedCourierService).length ? 'rgb(240, 98, 94, .3)' : 'rgb(240, 98, 94)',
                                                backgroundColor: Object.keys(groupedCart).length !== Object.keys(selectedCourierService).length ? 'rgb(240, 98, 94, .3)' : 'rgb(240, 98, 94)',
                                                fontFamily: 'Signika',
                                                paddingTop: 10,
                                                paddingBottom: 10,
                                                fontWeight: '600',
                                                marginTop: 30,
                                                borderRadius: 10,
                                                opacity: isLoading ? .3 : 1
                                            }}>
                                            {isLoading ? <Spinner size="sm" animation="border"/> : 'Bayar'}
                                        </Button>
                                        {/*</Link>*/}
                                    </Col>
                                </Row>
                            </>
                        </div>

                    </div>
                </Col>
            </Row>
        </Container>
    )

}
