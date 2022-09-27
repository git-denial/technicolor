import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Palette from "../Palette";
import {Link} from "react-router-dom";
import TextEllipsis from "react-text-ellipsis";
import {MdStoreMallDirectory} from "react-icons/md";
import Alert from "react-bootstrap/Alert";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {AiOutlineShopping} from "react-icons/ai";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Order from "../models/Order";
import moment from "moment";
import {
    Close
} from '@material-ui/icons';
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import DialogContent from "@material-ui/core/DialogContent";
import Spinner from "react-bootstrap/Spinner";
import {isMobile} from 'react-device-detect';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {FaList, FaDollarSign, FaTruck, FaBox, FaClipboardCheck} from "react-icons/fa";
import AccordionBootstrap from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card'


export default function OrderHistoryPage() {
    const [selectedStatus, setSelectedStatus] = useState('WAITING_FOR_PAYMENT');
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [noOfWaitingPayment, setNoOfWaitingPayment] = useState(0);
    const [noOfProcessedOrders, setNoOfProcessedOrders] = useState(0)
    const [noOfSentOrders, setNoOfSentOrders] = useState(0)
    const [noOfArrivedOrders, setNoOfArrivedOrders] = useState(0)
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState({});
    const [manifest, setManifest] = useState([]);
    const [isTrackingModalVisible, setTrackingModalVisible] = useState(false);
    const [selectedResiNo, setSelectedResiNo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isManifestLoading, setIsManifestLoading] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(0);
    const [selectedTransactionACC, setSelectedTransactionACC] = useState(0)

    const [nonTrackableCourier, setNonTrackableCourier] = useState([
        'JNE', 'TIKI', 'RPX', 'SAP', 'JET', 'INDAH', 'NCS', 'IDE', 'IDL', 'DSE', 'REX'
    ])

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    useEffect(() => {
        getOrderHistory()
    }, [])

    const handleOrderChange = (panel) => (event, newExpanded) => {
        setSelectedOrder(newExpanded ? panel : false);
    };

    const handleTransactionChange = (panel) => (event, newExpanded) => {
        setSelectedTransactionACC(newExpanded ? panel : false);
    };

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setSelectedStatus(isExpanded ? panel : false);
    };

    const trackDelivery = async (courier, resiNumber) => {
        try {
            setIsManifestLoading(true)
            setSelectedCourier(courier);
            console.log('Selected Courier', courier);
            const model = new Order();

            const result = await model.track(courier.toLowerCase(), resiNumber);
            console.log('result', result.rajaongkir);

            if (result.rajaongkir.status.code === 400) {
                setManifest([]);
                return setIsManifestLoading(false);
            }

            for (let i in nonTrackableCourier) {
                if (courier.toUpperCase() === nonTrackableCourier[i]) {
                    setManifest([]);
                    return setIsManifestLoading(false);
                }
            }


            const manifest = result.rajaongkir?.result?.manifest;

            if (manifest && Array.isArray(manifest)) {
                const manifestTemp = [];

                manifest.map(aManifest => {
                    manifestTemp.push({
                        label: aManifest.manifest_description,
                        content: moment(aManifest.manifest_date).format('DD MMM YYYY') + ', ' + aManifest.manifest_time
                    })
                })

                console.log('Manifest temp', manifestTemp)

                setManifest(manifestTemp)
                setIsManifestLoading(false)

            }

        } catch (e) {
            console.log(e)
        }
    }

    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const getOrderHistory = async () => {
        try {
            const model = new Order();

            const result = await model.getMyOrder();

            let noOfWaitingPaymentTemp = 0;
            let noOfProcessedOrdersTemp = 0;
            let noOfSentOrdersTemp = 0;
            let noOfArrivedOrdersTemp = 0;

            result.forEach(product => {
                if (product.transaction.payment_status === 'CONFIRMED' && (product.shipment_status === 'WAITING_CONFIRMATION' || product.shipment_status === 'PROCESSING')) {
                    noOfProcessedOrdersTemp++;
                } else if (product.transaction.payment_status === 'CONFIRMED' && product.shipment_status === 'DELIVERING') {
                    noOfSentOrdersTemp++;
                } else if (product.transaction.payment_status === 'CONFIRMED' && product.shipment_status === 'ARRIVED') {
                    noOfArrivedOrdersTemp++;
                }
            })

            Object.keys(groupBy(result, 'transaction_id')).map(item => {
                console.log('asdasxas', groupBy(result, 'transaction_id')[item][0])

                if (groupBy(result, 'transaction_id')[item][0].transaction.payment_status === 'WAITING') noOfWaitingPaymentTemp++;
            })

            setNoOfWaitingPayment(noOfWaitingPaymentTemp);
            setNoOfProcessedOrders(noOfProcessedOrdersTemp);
            setNoOfSentOrders(noOfSentOrdersTemp);
            setNoOfArrivedOrders(noOfArrivedOrdersTemp);

            console.log('grpuped by result',)
            setOrderHistory(result);
            setIsLoading(false);
        } catch (e) {

        }
    }

    return (
        <Container style={{minHeight: 'calc(100vh - 380px)'}}>
            <Dialog
                open={isTrackingModalVisible}
                maxWidth={"md"}
                fullWidth
            >
                <DialogTitle style={{backgroundColor: Palette.PRIMARY}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1}}>
                            <Typography variant={"h6"} style={{color: 'white'}}>
                                Tracking {selectedResiNo}
                            </Typography>
                        </div>
                        <div>
                            <Close onClick={() => {
                                setTrackingModalVisible(false)
                            }} style={{cursor: "pointer", color: 'white'}}/>
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent style={{margin: "16px 8px"}}>
                    <Row>
                        <Col md={12}>
                            {
                                !isManifestLoading ?
                                    <Stepper activeStep={0} orientation="vertical">
                                        {
                                            manifest.length >= 1 ?
                                                manifest.map((obj, key) => {
                                                    return <Step key={key} active={true}>
                                                        <StepLabel StepIconComponent={() => {
                                                            return <div style={{
                                                                height: 24,
                                                                width: 24,
                                                                borderRadius: 12,
                                                                background: Palette.PRIMARY
                                                            }}></div>
                                                        }}>
                                                            <div style={{
                                                                fontFamily: "Open Sans",
                                                                fontWeight: '600',
                                                                fontSize: '1.1em'
                                                            }}>{obj.label}</div>
                                                        </StepLabel>
                                                        <StepContent style={{
                                                            fontFamily: 'Open Sans',
                                                            fontSize: '.8em',
                                                            color: 'grey',
                                                            marginTop: 4
                                                        }}>
                                                            {obj.content}
                                                        </StepContent>
                                                    </Step>
                                                }) :
                                                <div>Tracking feature is unavailable for {selectedCourier} couriers. You
                                                    can find more information regarding your order in the courier's
                                                    website.</div>
                                        }
                                    </Stepper> : <div>Loading...</div>
                            }
                        </Col>
                    </Row>
                </DialogContent>
            </Dialog>

            <Modal show={detailModalVisible} centered onHide={() => setDetailModalVisible(false)}>
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
                            marginLeft: 0,
                        }}>
                            Detail
                        </Row>

                        {
                            Array.isArray(selectedTransaction) ? selectedTransaction.map(selectedTransaction => {
                                    return (
                                        <>
                                            <Row>
                                                <div style={{
                                                    marginTop: 50,
                                                    margin: 20,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: '100%'
                                                }}>
                                                    <MdStoreMallDirectory
                                                        style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>

                                                    <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                                        {selectedTransaction.vendor?.name}
                                                    </div>
                                                </div>

                                                {
                                                    selectedTransaction.order_lines?.map(product => {
                                                        return (
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                paddingLeft: 40,
                                                                paddingRight: 40,
                                                                marginBottom: 20,
                                                                width: '100%'
                                                            }}>
                                                                <img
                                                                    src={product.product?.main_photo_url ? product.product?.main_photo_url : '/no-image-placeholder.jpg'}
                                                                    style={{
                                                                        borderRadius: 7,
                                                                        height: 150,
                                                                        width: 110,
                                                                        objectFit: 'contain'
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
                                                                        style={{
                                                                            marginTop: 7,
                                                                            marginBottom: 3,
                                                                            paddingRight: 15
                                                                        }}
                                                                    >
                                                                        {product.product?.name}
                                                                    </TextEllipsis>

                                                                    {product.customization?.size &&
                                                                    <div style={{
                                                                        fontSize: '.85em',
                                                                        color: '#949494',
                                                                        marginBottom: 3
                                                                    }}>
                                                                        Size: {product.customization?.size}
                                                                    </div>
                                                                    }

                                                                    <div style={{fontSize: '.9em', fontWeight: '600'}}>
                                                                        Rp{thousandSeparator(product.price)}
                                                                    </div>

                                                                    <div style={{fontSize: '.8em', fontWeight: '400'}}>
                                                                        ({product.quantity} item{product.quantity ? 's' : null})
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Row>


                                            <Row style={{height: 1, backgroundColor: '#d4d4d4', marginTop: 10}}/>

                                            <Row style={{marginTop: 10}}>
                                                <Col>
                                                    <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Subtotal</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 17,
                                                            fontWeight: '600',
                                                            color: Palette.PRIMARY
                                                        }}>
                                                            Rp{selectedTransaction.delivery_fee + selectedTransaction.price_sum ? thousandSeparator(selectedTransaction.delivery_fee + selectedTransaction.price_sum) : null}
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
                                                    }}>Price
                                                        ({selectedTransaction.order_lines?.reduce((total, obj) => {
                                                            return total + obj.quantity
                                                        }, 0)} item{selectedTransaction.order_lines?.reduce((total, obj) => {
                                                            return total + obj.quantity
                                                        }, 0) > 1 ? 's' : null})</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 16,
                                                            fontWeight: '500'
                                                        }}>
                                                            Rp{selectedTransaction.price_sum ? thousandSeparator(selectedTransaction.price_sum) : null}
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
                                                    }}>Delivery Fee</b>
                                                </Col>
                                                <div>
                                                    <Col>
                                                        <Row style={{
                                                            fontFamily: 'Signika',
                                                            fontSize: 16,
                                                            fontWeight: '500'
                                                        }}>
                                                            Rp{selectedTransaction.delivery_fee ? thousandSeparator(selectedTransaction.delivery_fee) : null}
                                                        </Row>
                                                    </Col>
                                                </div>
                                            </Row>
                                        </>
                                    )
                                }) :
                                <>
                                    <Row>
                                        <div style={{
                                            margin: 20,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}>
                                            <MdStoreMallDirectory style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>

                                            <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                                {selectedTransaction.vendor?.name}
                                            </div>
                                        </div>

                                        {
                                            selectedTransaction.order_lines?.map(product => {
                                                return (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        paddingLeft: 40,
                                                        paddingRight: 40,
                                                        marginBottom: 20,
                                                        width: '100%'
                                                    }}>
                                                        <img
                                                            src={product.product?.main_photo_url ? product.product?.main_photo_url : '/no-image-placeholder.jpg'}
                                                            style={{
                                                                borderRadius: 7,
                                                                height: 150,
                                                                width: 110,
                                                                objectFit: 'contain'
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
                                                                style={{
                                                                    marginTop: 7,
                                                                    marginBottom: 3,
                                                                    paddingRight: 15
                                                                }}
                                                            >
                                                                {product.product?.name}
                                                            </TextEllipsis>

                                                            {product.customization?.size &&
                                                            <div style={{
                                                                fontSize: '.85em',
                                                                color: '#949494',
                                                                marginBottom: 3
                                                            }}>
                                                                Size: {product.customization?.size}
                                                            </div>
                                                            }

                                                            <div style={{fontSize: '.9em', fontWeight: '600'}}>
                                                                Rp{thousandSeparator(product.price)}
                                                            </div>

                                                            <div style={{fontSize: '.8em', fontWeight: '400'}}>
                                                                ({product.quantity} item{product.quantity > 1 ? 's' : null})
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Row>


                                    <Row style={{height: 1, backgroundColor: '#d4d4d4', marginTop: 10}}/>

                                    <Row style={{marginTop: 10}}>
                                        <Col>
                                            <b style={{color: '#999999', paddingLeft: 0, fontSize: 15}}>Subtotal</b>
                                        </Col>
                                        <div>
                                            <Col>
                                                <Row style={{
                                                    fontFamily: 'Signika',
                                                    fontSize: 17,
                                                    fontWeight: '600',
                                                    color: Palette.PRIMARY
                                                }}>
                                                    Rp{selectedTransaction.delivery_fee + selectedTransaction.price_sum ? thousandSeparator(selectedTransaction.delivery_fee + selectedTransaction.price_sum) : null}
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
                                            }}>Price
                                                ({selectedTransaction.order_lines?.reduce((total, obj) => {
                                                    return total + obj.quantity
                                                }, 0)} item{selectedTransaction.order_lines?.reduce((total, obj) => {
                                                    return total + obj.quantity
                                                }, 0) > 1 ? 's' : null})</b>
                                        </Col>
                                        <div>
                                            <Col>
                                                <Row style={{fontFamily: 'Signika', fontSize: 16, fontWeight: '500'}}>
                                                    Rp{selectedTransaction.price_sum ? thousandSeparator(selectedTransaction.price_sum) : null}
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
                                            }}>Delivery Fee</b>
                                        </Col>
                                        <div>
                                            <Col>
                                                <Row style={{fontFamily: 'Signika', fontSize: 16, fontWeight: '500'}}>
                                                    Rp{selectedTransaction.delivery_fee ? thousandSeparator(selectedTransaction.delivery_fee) : null}
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                </>
                        }

                    </Col>
                </Row>
            </Modal>

            {
                isMobile ?
                    <>

                        <Accordion expanded={selectedStatus === 'WAITING_FOR_PAYMENT'} onChange={
                            handleChangeAccordion('WAITING_FOR_PAYMENT')
                        }>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography
                                    style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FaDollarSign style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                                    <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                        Waiting for Payment
                                    </div>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    maxHeight: 400,
                                    overflow: 'scroll'
                                }}>
                                <Typography>
                                    {
                                        Object.keys(groupBy(orderHistory, 'transaction_id')).map(key => {
                                            const order = groupBy(orderHistory, 'transaction_id')[key][0]

                                            if (order.transaction.payment_status === 'WAITING' || order.transaction.payment_status === 'PAID' || order.transaction.payment_status === 'REJECTED') {
                                                return (<>
                                                        <Accordion
                                                            expanded={selectedTransactionACC === order.transaction_id}
                                                            style={{
                                                                width: 270,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}
                                                            onChange={handleTransactionChange(order.transaction_id)}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                                aria-controls="panel1bh-content"
                                                                id="panel1bh-header"
                                                            >
                                                                <Typography>
                                                                    <div>
                                                                        Transaction Number #<b>{order.transaction_id}</b>
                                                                    </div>
                                                                    <div style={{marginTop: "0.5em"}}>
                                                                        Total : <b
                                                                        style={{color: Palette.PRIMARY}}>Rp{
                                                                        thousandSeparator(groupBy(orderHistory, 'transaction_id')[key].reduce((total, obj) => {
                                                                            return total + obj.price_sum + obj.delivery_fee
                                                                        }, 0))
                                                                    }
                                                                    </b>
                                                                    </div>
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography>
                                                                    <div style={{marginTop: "1em"}}>
                                                                        Payment Information :
                                                                    </div>

                                                                    <div style={{marginTop: "0.5em"}}>
                                                                        Destination : BCA a\n John Adam <br/>
                                                                        Account Number : 987654321
                                                                    </div>
                                                                    <div style={{
                                                                        width: "100%",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        flex: 1,
                                                                        justifyContent: "flex-end",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        {
                                                                            order.transaction.payment_status === 'WAITING' ?
                                                                                <Alert
                                                                                    style={{
                                                                                        marginTop: "0.5em",
                                                                                        width: "100%"
                                                                                    }}
                                                                                    variant={"info"}
                                                                                    color={"info"}>Please complete
                                                                                    payment before 24 January 2021,
                                                                                    22.00 WIB</Alert> :
                                                                                order.transaction.payment_status === 'REJECTED' ?
                                                                                    <Alert
                                                                                        style={{
                                                                                            marginTop: "0.5em",
                                                                                            width: "100%"
                                                                                        }}
                                                                                        variant={"danger"}>Proof of
                                                                                        your payment has been
                                                                                        declined. Please upload new
                                                                                        evidence!</Alert> :
                                                                                    <Alert
                                                                                        style={{
                                                                                            marginTop: "0.5em",
                                                                                            width: "100%"
                                                                                        }}
                                                                                        variant={"success"}>
                                                                                        We are processing your
                                                                                        payment
                                                                                    </Alert>
                                                                        }

                                                                        <div style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "row",
                                                                            justifyContent: "flex-end",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <Button variant="outline" style={{
                                                                                borderColor: Palette.PRIMARY,
                                                                                color: Palette.PRIMARY
                                                                            }} onClick={() => {
                                                                                console.log('selected order', order)

                                                                                if (groupBy(orderHistory, 'transaction_id')[key].length === 1) setSelectedTransaction(order)
                                                                                else setSelectedTransaction(groupBy(orderHistory, 'transaction_id')[key])

                                                                                setDetailModalVisible(true)
                                                                            }}>
                                                                                Detail
                                                                            </Button>
                                                                            <Link
                                                                                to={`/upload-receipt/${order.transaction_id}`}>
                                                                                <Button style={{
                                                                                    backgroundColor: Palette.PRIMARY,
                                                                                    borderColor: Palette.PRIMARY,
                                                                                    marginLeft: 5
                                                                                }}>
                                                                                    {order.transaction.payment_status === 'WAITING' ? 'Confirm Payment' : 'Change Payment Proof'}
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </div>

                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </>
                                                )
                                            }
                                        })
                                    }
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={selectedStatus === 'PROCESSED'} onChange={
                            handleChangeAccordion('PROCESSED')
                        }>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography
                                    style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FaBox style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                                    <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                        Processing Order
                                    </div>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    maxHeight: 400,
                                    overflow: 'scroll'
                                }}
                            >
                                {
                                    orderHistory.map(order => {
                                        console.log('processed order', order)

                                        if (order.transaction.payment_status === 'CONFIRMED' && (order.shipment_status === 'WAITING_CONFIRMATION' || order.shipment_status === 'PROCESSING')) {
                                            return (
                                                <Col md={6}
                                                     style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                                                        <div style={{
                                                            height: 225,
                                                            padding: 15,
                                                            display: "flex",
                                                            flexDirection: "column"
                                                        }}
                                                        >
                                                            <div>
                                                                <b>Booking No : </b>{order.transaction_id}
                                                            </div>
                                                            <div style={{marginTop: "0.5em"}}>
                                                                Total : <b
                                                                style={{color: Palette.PRIMARY}}>Rp{order.price_sum + order.delivery_fee ? thousandSeparator(order.price_sum + order.delivery_fee) : null}</b>
                                                            </div>

                                                            <div style={{
                                                                width: "100%",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                flex: 1,
                                                                justifyContent: "flex-end",
                                                                alignItems: "center"
                                                            }}>
                                                                {
                                                                    order.shipment_status === 'WAITING_CONFIRMATION' ?
                                                                        <Alert
                                                                            style={{
                                                                                marginTop: "0.5em",
                                                                                width: "100%"
                                                                            }}
                                                                            variant={"info"}
                                                                            color={"info"}>Payment has been
                                                                            verified, waiting for seller to
                                                                            accept the order.</Alert> :

                                                                        <Alert
                                                                            style={{
                                                                                marginTop: "0.5em",
                                                                                width: "100%"
                                                                            }}
                                                                            variant={"info"}>
                                                                            The seller has received the
                                                                            order, your order is in the
                                                                            packaging stage.
                                                                        </Alert>

                                                                }

                                                                <div style={{
                                                                    width: "100%",
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    justifyContent: "flex-end",
                                                                    alignItems: "center"
                                                                }}>
                                                                    <Button variant="outline" style={{
                                                                        borderColor: Palette.PRIMARY,
                                                                        color: Palette.PRIMARY
                                                                    }} onClick={() => {
                                                                        console.log('selected order', order)

                                                                        setSelectedTransaction(order)
                                                                        setDetailModalVisible(true)
                                                                    }}>
                                                                        Detail
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    })
                                }
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={selectedStatus === 'SENT'} onChange={
                            handleChangeAccordion('SENT')
                        }>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography
                                    style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FaTruck style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                                    <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                        On The Way
                                    </div>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {
                                        orderHistory.map(order => {
                                            if (order.transaction.payment_status === 'CONFIRMED' && order.shipment_status === 'DELIVERING') {
                                                console.log(order)

                                                return (<>
                                                        <Accordion
                                                            expanded={selectedOrder === order.id}
                                                            style={{
                                                                width: 270,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}
                                                            onChange={handleOrderChange(order.id)}>
                                                            <AccordionSummary>
                                                                <Typography>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                        }}>
                                                                        <div style={{}}>
                                                                            <img
                                                                                style={{
                                                                                    width: 30,
                                                                                    height: 30,
                                                                                    objectFit: "cover",
                                                                                    borderRadius: 100
                                                                                }}
                                                                                src={order.vendor?.logo_url ? order.vendor?.logo_url : '/no-image-placeholder.jpg'}/>
                                                                        </div>

                                                                        <div style={{
                                                                            flex: 1,
                                                                            marginLeft: 5
                                                                        }}>
                                                                            <b>{order.vendor?.name}</b><br/>
                                                                        </div>

                                                                    </div>
                                                                    Booking Number <b>#{order.id}</b>
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails
                                                            >
                                                                <Typography>
                                                                    <div style={{marginTop: "1em"}}>
                                                                        Transaction Date
                                                                    </div>

                                                                    <div style={{marginTop: "0.3em"}}>
                                                                        <b>{moment(order.created_at).format('DD MMMM YYYY')}</b>
                                                                    </div>

                                                                    <div style={{marginTop: "1.2em"}}>
                                                                        Receipt Number
                                                                    </div>

                                                                    <div style={{
                                                                        marginTop: "0.3em",
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <b style={{flex: 1}}>{order.delivery_receipt}</b>
                                                                    </div>

                                                                    <div style={{
                                                                        width: "100%",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        flex: 1,
                                                                        justifyContent: "flex-start",
                                                                        alignItems: "",
                                                                        backgroundColor: ''
                                                                    }}>
                                                                        <div style={{
                                                                            marginTop: 5,
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "row",
                                                                            justifyContent: "flex-start",
                                                                            alignItems: "",
                                                                            backgroundColor: ''
                                                                        }}>
                                                                            <Button variant="outline"
                                                                                    style={{
                                                                                        borderColor: Palette.PRIMARY,
                                                                                        color: Palette.PRIMARY
                                                                                    }} onClick={() => {
                                                                                setSelectedTransaction(order)
                                                                                setDetailModalVisible(true)
                                                                            }}>
                                                                                Detail
                                                                            </Button>
                                                                            <div
                                                                                onClick={() => {
                                                                                    setTrackingModalVisible(true)
                                                                                    setSelectedResiNo(order.delivery_receipt)

                                                                                    trackDelivery(order.delivery_method, order.delivery_receipt)
                                                                                }}
                                                                                style={{
                                                                                    cursor: 'pointer',
                                                                                    fontFamily: 'Signika',
                                                                                    color: Palette.PRIMARY,
                                                                                    fontWeight: '600',
                                                                                    marginLeft: 10,
                                                                                    marginTop: 8
                                                                                }}>
                                                                                TRACK
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </>
                                                )
                                            }
                                        })
                                    }
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={selectedStatus === 'ARRIVED'} onChange={
                            handleChangeAccordion('ARRIVED')
                        }>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography
                                    style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FaClipboardCheck style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>
                                    <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>
                                        Arrived
                                    </div>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    maxHeight: 400,
                                    overflow: 'scroll'
                                }}>
                                <Typography>
                                    {
                                        selectedStatus === 'ARRIVED' &&
                                        <Col md={12}
                                             style={{
                                                 backgroundColor: 'white',
                                                 borderBottomLeftRadius: 10,
                                                 borderBottomRightRadius: 10
                                             }}>
                                            <Row style={{marginLeft: 0, marginRight: 0}}>

                                                {noOfArrivedOrders === 0 &&
                                                <Col md={12} style={{
                                                    backgroundColor: 'white',
                                                    borderBottomLeftRadius: 10,
                                                    borderBottomRightRadius: 10,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    paddingBottom: 50
                                                }}>
                                                    <AiOutlineShopping size={50} color={'grey'}/>
                                                    <div style={{
                                                        fontFamily: 'Signika',
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: '1.5em'
                                                    }}>
                                                        No orders to display
                                                    </div>
                                                </Col>
                                                }

                                                {
                                                    orderHistory.map(order => {
                                                        if (order.transaction.payment_status === 'CONFIRMED' && order.shipment_status === 'ARRIVED') {
                                                            console.log(order)

                                                            return (<>
                                                                    <Accordion
                                                                        expanded={selectedOrder === order.id}
                                                                        style={{
                                                                            width: 270,
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                        }}
                                                                        onChange={handleOrderChange(order.id)}>
                                                                        <AccordionSummary>
                                                                            <Typography>
                                                                                <div
                                                                                    style={{
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center',
                                                                                    }}>
                                                                                    <div style={{}}>
                                                                                        <img
                                                                                            style={{
                                                                                                width: 30,
                                                                                                height: 30,
                                                                                                objectFit: "cover",
                                                                                                borderRadius: 100
                                                                                            }}
                                                                                            src={order.vendor?.logo_url ? order.vendor?.logo_url : '/no-image-placeholder.jpg'}/>
                                                                                    </div>

                                                                                    <div style={{
                                                                                        flex: 1,
                                                                                        marginLeft: 5
                                                                                    }}>
                                                                                        <b>{order.vendor?.name}</b><br/>
                                                                                    </div>

                                                                                </div>
                                                                                Booking Number <b>#{order.id}</b>
                                                                            </Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails
                                                                        >
                                                                            <Typography>
                                                                                <div style={{marginTop: "1em"}}>
                                                                                    Transaction Date
                                                                                </div>

                                                                                <div style={{marginTop: "0.3em"}}>
                                                                                    <b>{moment(order.created_at).format('DD MMMM YYYY')}</b>
                                                                                </div>

                                                                                <div style={{marginTop: "1.2em"}}>
                                                                                    Receipt Number
                                                                                </div>

                                                                                <div style={{
                                                                                    marginTop: "0.3em",
                                                                                    display: 'flex',
                                                                                    alignItems: 'center'
                                                                                }}>
                                                                                    <b style={{flex: 1}}>{order.delivery_receipt}</b>
                                                                                </div>

                                                                                <div style={{
                                                                                    width: "100%",
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    flex: 1,
                                                                                    justifyContent: "flex-start",
                                                                                    alignItems: "",
                                                                                    backgroundColor: ''
                                                                                }}>
                                                                                    <div style={{
                                                                                        marginTop: 5,
                                                                                        width: "100%",
                                                                                        display: "flex",
                                                                                        flexDirection: "row",
                                                                                        justifyContent: "flex-start",
                                                                                        alignItems: "",
                                                                                        backgroundColor: ''
                                                                                    }}>
                                                                                        <Button variant="outline"
                                                                                                style={{
                                                                                                    borderColor: Palette.PRIMARY,
                                                                                                    color: Palette.PRIMARY
                                                                                                }} onClick={() => {
                                                                                            setSelectedTransaction(order)
                                                                                            setDetailModalVisible(true)
                                                                                        }}>
                                                                                            Detail
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </Typography>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                </>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Row>

                                        </Col>
                                    }
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </>

                    :
                    <div>
                        {

                            isLoading ?
                                <Spinner style={{width: '4rem', height: '4rem', marginLeft: '47%', marginTop: '15%'}}
                                         animation="border" variant="danger"/> :
                                <Row>
                                    <Col style={{
                                        backgroundColor: 'white', marginTop: 40, borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10, paddingTop: 40,
                                        paddingBottom: 40,
                                        display: 'flex',
                                        paddingLeft: 40,
                                        paddingRight: 40,
                                        flexDirection: 'row'
                                    }}>
                                        <div
                                            onClick={() => setSelectedStatus('WAITING_FOR_PAYMENT')}
                                            style={{
                                                fontFamily: 'Signika',
                                                fontWeight: '700',
                                                fontSize: '1.5em',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                color: selectedStatus === 'WAITING_FOR_PAYMENT' ? Palette.PRIMARY : '#d4d4d4',
                                                cursor: 'pointer',
                                            }}>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                Waiting for Payment

                                                {noOfWaitingPayment > 0 &&
                                                <div style={{
                                                    fontSize: 16,
                                                    width: 23,
                                                    height: 23,
                                                    backgroundColor: selectedStatus === 'WAITING_FOR_PAYMENT' ? Palette.PRIMARY : '#d4d4d4',
                                                    color: 'white',
                                                    borderRadius: 15,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: 6,
                                                    marginLeft: 7
                                                }}>
                                                    {noOfWaitingPayment}
                                                </div>
                                                }
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: 3,
                                                backgroundColor: Palette.PRIMARY,
                                                opacity: selectedStatus === 'WAITING_FOR_PAYMENT' ? 1 : 0,
                                            }}/>
                                        </div>
                                        <div
                                            onClick={() => setSelectedStatus('PROCESSED')}
                                            style={{
                                                marginLeft: 30,
                                                fontFamily: 'Signika',
                                                fontWeight: '700',
                                                fontSize: '1.5em',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                color: selectedStatus === 'PROCESSED' ? Palette.PRIMARY : '#d4d4d4',
                                                cursor: 'pointer'
                                            }}>
                                            <div style={{display: 'flex', flexDirection: 'row', backgroundColor: ''}}>
                                                Processing Order

                                                {noOfProcessedOrders > 0 &&
                                                <div style={{
                                                    fontSize: 16,
                                                    width: 23,
                                                    height: 23,
                                                    backgroundColor: selectedStatus === 'PROCESSED' ? Palette.PRIMARY : '#d4d4d4',
                                                    color: 'white',
                                                    borderRadius: 15,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: 6,
                                                    marginLeft: 7,
                                                }}>
                                                    {noOfProcessedOrders}
                                                </div>
                                                }
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: 3,
                                                backgroundColor: Palette.PRIMARY,
                                                opacity: selectedStatus === 'PROCESSED' ? 1 : 0,
                                            }}/>
                                        </div>

                                        <div
                                            onClick={() => setSelectedStatus('SENT')}
                                            style={{
                                                fontFamily: 'Signika',
                                                fontWeight: '700',
                                                fontSize: '1.5em',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginLeft: 30,
                                                color: selectedStatus === 'SENT' ? Palette.PRIMARY : '#d4d4d4',
                                                cursor: 'pointer'
                                            }}>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                On The Way

                                                {noOfSentOrders > 0 &&
                                                <div style={{
                                                    fontSize: 16,
                                                    width: 23,
                                                    height: 23,
                                                    backgroundColor: selectedStatus === 'SENT' ? Palette.PRIMARY : '#d4d4d4',
                                                    color: 'white',
                                                    borderRadius: 15,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: 6,
                                                    marginLeft: 7
                                                }}>
                                                    {noOfSentOrders}
                                                </div>
                                                }
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: 3,
                                                backgroundColor: Palette.PRIMARY,
                                                opacity: selectedStatus === 'SENT' ? 1 : 0
                                            }}/>
                                        </div>

                                        <div
                                            onClick={() => setSelectedStatus('ARRIVED')}
                                            style={{
                                                fontFamily: 'Signika',
                                                fontWeight: '700',
                                                fontSize: '1.5em',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginLeft: 30,
                                                color: selectedStatus === 'ARRIVED' ? Palette.PRIMARY : '#d4d4d4',
                                                cursor: 'pointer'
                                            }}>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                Done

                                                {noOfArrivedOrders > 0 &&
                                                <div style={{
                                                    fontSize: 16,
                                                    width: 23,
                                                    height: 23,
                                                    backgroundColor: selectedStatus === 'ARRIVED' ? Palette.PRIMARY : '#d4d4d4',
                                                    color: 'white',
                                                    borderRadius: 15,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: 6,
                                                    marginLeft: 7
                                                }}>
                                                    {noOfArrivedOrders}
                                                </div>
                                                }
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: 3,
                                                backgroundColor: Palette.PRIMARY,
                                                opacity: selectedStatus === 'ARRIVED' ? 1 : 0
                                            }}/>
                                        </div>
                                    </Col>

                                    {selectedStatus === 'ARRIVED' &&
                                    <Col md={12}
                                         style={{
                                             backgroundColor: 'white',
                                             borderBottomLeftRadius: 10,
                                             borderBottomRightRadius: 10
                                         }}>
                                        <Row style={{marginLeft: 20, marginRight: 20}}>

                                            {noOfArrivedOrders === 0 &&
                                            <Col md={12} style={{
                                                backgroundColor: 'white',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                paddingBottom: 50
                                            }}>
                                                <AiOutlineShopping size={50} color={'grey'}/>
                                                <div style={{
                                                    fontFamily: 'Signika',
                                                    fontWeight: '600',
                                                    color: 'grey',
                                                    fontSize: '1.5em'
                                                }}>
                                                    No orders to display
                                                </div>
                                            </Col>
                                            }


                                            {
                                                orderHistory.map(order => {
                                                    if (order.transaction.payment_status === 'CONFIRMED' && order.shipment_status === 'ARRIVED') {
                                                        console.log(order)

                                                        return (
                                                            <Col md={6}
                                                                 style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                                                                    <div style={{
                                                                        height: 350,
                                                                        padding: 15,
                                                                        display: "flex",
                                                                        flexDirection: "column"
                                                                    }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                            }}>
                                                                            <div style={{
                                                                                // width: 75,
                                                                                // height: 75,
                                                                                padding: 5
                                                                            }}>
                                                                                <img
                                                                                    style={{
                                                                                        width: 75,
                                                                                        height: 75,
                                                                                        objectFit: "cover",
                                                                                        borderRadius: 100
                                                                                    }}
                                                                                    src={order.vendor?.logo_url ? order.vendor?.logo_url : '/no-image-placeholder.jpg'}/>
                                                                            </div>

                                                                            <div style={{
                                                                                flex: 1,
                                                                                marginLeft: 5
                                                                            }}>
                                                                                <b>{order.vendor?.name}</b><br/>
                                                                                {/*Jakarta*/}
                                                                            </div>
                                                                        </div>
                                                                        <div style={{marginTop: "1em"}}>
                                                                            Booking Number
                                                                        </div>

                                                                        <div style={{marginTop: "0.3em"}}>
                                                                            <b>{order.id}</b>
                                                                        </div>
                                                                        <div style={{marginTop: "1em"}}>
                                                                            Transaction Date
                                                                        </div>

                                                                        <div style={{marginTop: "0.3em"}}>
                                                                            <b>{moment(order.created_at).format('DD MMMM YYYY')}</b>
                                                                        </div>

                                                                        <div style={{marginTop: "1.2em"}}>
                                                                            Receipt Number
                                                                        </div>

                                                                        <div style={{
                                                                            marginTop: "0.3em",
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                            <b style={{flex: 1}}>{order.delivery_receipt}</b>
                                                                        </div>

                                                                        <div style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            flex: 1,
                                                                            justifyContent: "flex-end",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                justifyContent: "flex-end",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <Button variant="outline" style={{
                                                                                    borderColor: Palette.PRIMARY,
                                                                                    color: Palette.PRIMARY
                                                                                }} onClick={() => {
                                                                                    setSelectedTransaction(order)
                                                                                    setDetailModalVisible(true)
                                                                                }}>
                                                                                    Detail
                                                                                </Button>
                                                                            </div>

                                                                        </div>


                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                })
                                            }
                                        </Row>

                                    </Col>
                                    }

                                    {selectedStatus === 'PROCESSED' &&
                                    <Col md={12}
                                         style={{
                                             backgroundColor: 'white',
                                             borderBottomLeftRadius: 10,
                                             borderBottomRightRadius: 10
                                         }}>
                                        <Row style={{marginLeft: 20, marginRight: 20}}>
                                            {noOfProcessedOrders === 0 &&
                                            <Col md={12} style={{
                                                backgroundColor: 'white',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                paddingBottom: 50
                                            }}>
                                                <AiOutlineShopping size={50} color={'grey'}/>
                                                <div style={{
                                                    fontFamily: 'Signika',
                                                    fontWeight: '600',
                                                    color: 'grey',
                                                    fontSize: '1.5em'
                                                }}>
                                                    No orders to display
                                                </div>
                                            </Col>
                                            }

                                            {
                                                orderHistory.map(order => {
                                                    console.log('processed order', order)

                                                    if (order.transaction.payment_status === 'CONFIRMED' && (order.shipment_status === 'WAITING_CONFIRMATION' || order.shipment_status === 'PROCESSING')) {
                                                        return (
                                                            <Col md={6}
                                                                 style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                                                                    <div style={{
                                                                        height: 200,
                                                                        padding: 15,
                                                                        display: "flex",
                                                                        flexDirection: "column"
                                                                    }}
                                                                    >
                                                                        <div>
                                                                            <b>Booking No : </b>{order.transaction_id}
                                                                        </div>
                                                                        <div style={{marginTop: "0.5em"}}>
                                                                            Total : <b
                                                                            style={{color: Palette.PRIMARY}}>Rp{order.price_sum + order.delivery_fee ? thousandSeparator(order.price_sum + order.delivery_fee) : null}</b>
                                                                        </div>

                                                                        <div style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            flex: 1,
                                                                            justifyContent: "flex-end",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            {
                                                                                order.shipment_status === 'WAITING_CONFIRMATION' ?
                                                                                    <Alert
                                                                                        style={{
                                                                                            marginTop: "0.5em",
                                                                                            width: "100%"
                                                                                        }}
                                                                                        variant={"info"}
                                                                                        color={"info"}>Payment has been
                                                                                        verified, waiting for seller to
                                                                                        accept the order.</Alert> :

                                                                                    <Alert
                                                                                        style={{
                                                                                            marginTop: "0.5em",
                                                                                            width: "100%"
                                                                                        }}
                                                                                        variant={"info"}>
                                                                                        The seller has received the
                                                                                        order, your order is in the
                                                                                        packaging stage.
                                                                                    </Alert>

                                                                            }

                                                                            <div style={{
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                justifyContent: "flex-end",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <Button variant="outline" style={{
                                                                                    borderColor: Palette.PRIMARY,
                                                                                    color: Palette.PRIMARY
                                                                                }} onClick={() => {
                                                                                    console.log('selected order', order)

                                                                                    setSelectedTransaction(order)
                                                                                    setDetailModalVisible(true)
                                                                                }}>
                                                                                    Detail
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                })
                                            }
                                        </Row>

                                    </Col>
                                    }

                                    {selectedStatus === 'WAITING_FOR_PAYMENT' &&
                                    <Col md={12}
                                         style={{
                                             backgroundColor: 'white',
                                             borderBottomLeftRadius: 10,
                                             borderBottomRightRadius: 10
                                         }}>
                                        <Row style={{marginLeft: 20, marginRight: 20}}>
                                            {noOfWaitingPayment === 0 &&
                                            <Col md={12} style={{
                                                backgroundColor: 'white',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                paddingBottom: 50
                                            }}>
                                                <AiOutlineShopping size={50} color={'grey'}/>
                                                <div style={{
                                                    fontFamily: 'Signika',
                                                    fontWeight: '600',
                                                    color: 'grey',
                                                    fontSize: '1.5em'
                                                }}>
                                                    No orders to display
                                                </div>
                                            </Col>
                                            }

                                            {
                                                Object.keys(groupBy(orderHistory, 'transaction_id')).map(key => {
                                                    const order = groupBy(orderHistory, 'transaction_id')[key][0]

                                                    if (order.transaction.payment_status === 'WAITING' || order.transaction.payment_status === 'PAID' || order.transaction.payment_status === 'REJECTED') {
                                                        return (
                                                            <Col md={6}
                                                                 style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                                                                    <div style={{
                                                                        height: 300,
                                                                        padding: 15,
                                                                        display: "flex",
                                                                        flexDirection: "column"
                                                                    }}
                                                                    >
                                                                        <div>
                                                                            <b>Transaction No
                                                                                : </b>{order.transaction_id}
                                                                        </div>
                                                                        <div style={{marginTop: "0.5em"}}>
                                                                            Total : <b
                                                                            style={{color: Palette.PRIMARY}}>Rp{
                                                                            thousandSeparator(groupBy(orderHistory, 'transaction_id')[key].reduce((total, obj) => {
                                                                                return total + obj.price_sum + obj.delivery_fee
                                                                            }, 0))
                                                                        }
                                                                        </b>
                                                                        </div>

                                                                        <div style={{marginTop: "1em"}}>
                                                                            Payment Information :
                                                                        </div>

                                                                        <div style={{marginTop: "0.5em"}}>
                                                                            Destination : BCA a\n John Adam <br/>
                                                                            Account Number : 987654321
                                                                        </div>


                                                                        <div style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            flex: 1,
                                                                            justifyContent: "flex-end",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            {
                                                                                order.transaction.payment_status === 'WAITING' ?
                                                                                    <Alert
                                                                                        style={{
                                                                                            marginTop: "0.5em",
                                                                                            width: "100%"
                                                                                        }}
                                                                                        variant={"info"}
                                                                                        color={"info"}>Please complete
                                                                                        payment before 24 January 2021,
                                                                                        22.00 WIB</Alert> :
                                                                                    order.transaction.payment_status === 'REJECTED' ?
                                                                                        <Alert
                                                                                            style={{
                                                                                                marginTop: "0.5em",
                                                                                                width: "100%"
                                                                                            }}
                                                                                            variant={"danger"}>Proof of
                                                                                            your payment has been
                                                                                            declined. Please upload new
                                                                                            evidence!</Alert> :
                                                                                        <Alert
                                                                                            style={{
                                                                                                marginTop: "0.5em",
                                                                                                width: "100%"
                                                                                            }}
                                                                                            variant={"success"}>
                                                                                            We are processing your
                                                                                            payment
                                                                                        </Alert>
                                                                            }

                                                                            <div style={{
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                justifyContent: "flex-end",
                                                                                alignItems: "center"
                                                                            }}>
                                                                                <Button variant="outline" style={{
                                                                                    borderColor: Palette.PRIMARY,
                                                                                    color: Palette.PRIMARY
                                                                                }} onClick={() => {
                                                                                    console.log('selected order', order)

                                                                                    if (groupBy(orderHistory, 'transaction_id')[key].length === 1) setSelectedTransaction(order)
                                                                                    else setSelectedTransaction(groupBy(orderHistory, 'transaction_id')[key])

                                                                                    setDetailModalVisible(true)
                                                                                }}>
                                                                                    Detail
                                                                                </Button>
                                                                                <Link
                                                                                    to={`/upload-receipt/${order.transaction_id}`}>
                                                                                    <Button style={{
                                                                                        backgroundColor: Palette.PRIMARY,
                                                                                        borderColor: Palette.PRIMARY,
                                                                                        marginLeft: 5
                                                                                    }}>
                                                                                        {order.transaction.payment_status === 'WAITING' ? 'Confirm Payment' : 'Change Payment Proof'}
                                                                                    </Button>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                })
                                            }

                                        </Row>

                                    </Col>
                                    }


                                    {selectedStatus === 'SENT' &&
                                    <Col md={12}
                                         style={{
                                             backgroundColor: 'white',
                                             borderBottomLeftRadius: 10,
                                             borderBottomRightRadius: 10
                                         }}>
                                        <Row style={{marginLeft: 20, marginRight: 20}}>

                                            {noOfSentOrders === 0 &&
                                            <Col md={12} style={{
                                                backgroundColor: 'white',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                paddingBottom: 50
                                            }}>
                                                <AiOutlineShopping size={50} color={'grey'}/>
                                                <div style={{
                                                    fontFamily: 'Signika',
                                                    fontWeight: '600',
                                                    color: 'grey',
                                                    fontSize: '1.5em'
                                                }}>
                                                    No orders to display
                                                </div>
                                            </Col>
                                            }


                                            {
                                                orderHistory.map(order => {
                                                    if (order.transaction.payment_status === 'CONFIRMED' && order.shipment_status === 'DELIVERING') {
                                                        console.log(order)

                                                        return (
                                                            <Col md={6}
                                                                 style={{cursor: 'pointer', textDecoration: 'none'}}>
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
                                                                    <div style={{
                                                                        height: 350,
                                                                        padding: 15,
                                                                        display: "flex",
                                                                        flexDirection: "column"
                                                                    }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                            }}>
                                                                            <div style={{
                                                                                // width: 75,
                                                                                // height: 75,
                                                                                padding: 5
                                                                            }}>
                                                                                <img
                                                                                    style={{
                                                                                        width: 75,
                                                                                        height: 75,
                                                                                        objectFit: "cover",
                                                                                        borderRadius: 100
                                                                                    }}
                                                                                    src={order.vendor?.logo_url ? order.vendor?.logo_url : '/no-image-placeholder.jpg'}/>
                                                                            </div>

                                                                            <div style={{
                                                                                flex: 1,
                                                                                marginLeft: 5
                                                                            }}>
                                                                                <b>{order.vendor?.name}</b><br/>
                                                                            </div>
                                                                        </div>

                                                                        <div style={{marginTop: "1em"}}>
                                                                            Booking Number
                                                                        </div>

                                                                        <div style={{marginTop: "0.3em"}}>
                                                                            <b>{order.id}</b>
                                                                        </div>
                                                                        <div style={{marginTop: "1em"}}>
                                                                            Transaction Date
                                                                        </div>

                                                                        <div style={{marginTop: "0.3em"}}>
                                                                            <b>{moment(order.created_at).format('DD MMMM YYYY')}</b>
                                                                        </div>

                                                                        <div style={{marginTop: "1.2em"}}>
                                                                            Receipt Number
                                                                        </div>

                                                                        <div style={{
                                                                            marginTop: "0.3em",
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                            <b style={{flex: 1}}>{order.delivery_receipt}</b>
                                                                        </div>

                                                                        <div style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            flex: 1,
                                                                            justifyContent: "flex-end",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <div style={{
                                                                                width: "100%",
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                justifyContent: "flex-end",
                                                                                alignItems: "center"

                                                                            }}>

                                                                                <div
                                                                                    onClick={() => {
                                                                                        setTrackingModalVisible(true)
                                                                                        setSelectedResiNo(order.delivery_receipt)

                                                                                        trackDelivery(order.delivery_method, order.delivery_receipt)
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: 'pointer',
                                                                                        fontFamily: 'Signika',
                                                                                        color: Palette.PRIMARY,
                                                                                        fontWeight: '600',
                                                                                        marginRight: 10,
                                                                                        marginTop: 5
                                                                                    }}>
                                                                                    TRACK
                                                                                </div>
                                                                                <Button variant="outline" style={{
                                                                                    borderColor: Palette.PRIMARY,
                                                                                    color: Palette.PRIMARY
                                                                                }} onClick={() => {
                                                                                    setSelectedTransaction(order)
                                                                                    setDetailModalVisible(true)
                                                                                }}>
                                                                                    Detail
                                                                                </Button>
                                                                            </div>

                                                                        </div>


                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                })
                                            }
                                        </Row>

                                    </Col>
                                    }


                                </Row>
                        }
                    </div>

            }


        </Container>
    )
}
