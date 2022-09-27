import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, {useCallback, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useDropzone} from 'react-dropzone';
import {FaCheck} from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import {Link} from "react-router-dom";
import Upload from "../models/Upload";
import Order from "../models/Order";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

export default function PaymentPage(props) {
    const [isLoading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    const [transaction, setTransaction] = useState({});
    const [isProofUploaded, setIsProofUploaded] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const {id} = props.match.params;

    useEffect(() => {
        getMyOrder()

    }, [])

    const getMyOrder = async () => {

        try {
            const model = new Order();

            const result = await model.getMyOrder();

            result.map(transaction => {
                if (transaction.transaction_id === parseInt(id)) {
                    if (transaction.transaction?.payment_proof_url) setPreviewUrl(transaction.transaction?.payment_proof_url)
                    console.log(transaction)
                    setTransaction(transaction)
                }
            })
            console.log('result', result)
        } catch (e) {

        }

    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0].type !== 'image/png' && acceptedFiles[0].type !== 'image/jpeg') {
            setAlertMessage('Please upload a PNG/JPEG file!')
            setIsProofUploaded(true)
            setUploadSuccess(false)
            setLoading(false)
        } else {
            setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
            setProofFile(acceptedFiles[0])
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        disabled: isLoading
    })

    const actionTrue = (
        <Button onClick={()=>{
            setIsProofUploaded(false)
            props.history.push('/order-history')
        }}>
            OK
        </Button>
    )

    const actionFalse = (
        <Button onClick={()=>{setIsProofUploaded(false)}}>
            OK
        </Button>
    )

    const uploadProof = async () => {
        setLoading(true)

        try {
            const model = new Upload();

            const formData = new FormData();

            formData.append('upload', proofFile)

            formData.append('transaction_id', id);

            const result = await model.uploadPaymentProof(formData);

            if (result.success) {
                setAlertMessage("Thanks for uploading! Please wait while our admin approves your payment.")
                setIsProofUploaded(true)
                setUploadSuccess(true)
                setLoading(false)
            }
        } catch (e) {
            setAlertMessage("Error occurred! Please check your connection.")
            setIsProofUploaded(true)
            setUploadSuccess(false)
            setLoading(false);
            console.log('e', e)
        }
    }

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <Container>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={isProofUploaded}
                action={uploadSuccess ? actionTrue : actionFalse}
                onClose={() => setIsProofUploaded(false)}
                message={alertMessage}
            />
            <Row>
                <Col style={{
                    backgroundColor: 'white', marginTop: 40, borderRadius: 10, paddingTop: 40,
                    paddingBottom: 40,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: 30
                }}>
                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em'}}>
                        SGU Technicolor Account Information
                    </div>

                    <div style={{height: 1, width: '100%', backgroundColor: '#dedede', marginTop: 20}}/>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: 20,
                        paddingLeft: 30,
                        paddingRight: 30,
                        alignItems: 'center'
                    }}>
                        <div style={{fontFamily: 'Open Sans', fontWeight: '600', color: 'grey', width: 300}}>
                            Destination
                        </div>

                        <div style={{fontFamily: 'Open Sans', fontWeight: '700', flex: 1}}>
                            BCA a/n John Adam
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: 20,
                        paddingLeft: 30,
                        paddingRight: 30,
                        alignItems: 'center'
                    }}>
                        <div style={{fontFamily: 'Open Sans', fontWeight: '600', color: 'grey', width: 300}}>
                            Account Number
                        </div>

                        <div style={{fontFamily: 'Open Sans', fontWeight: '700', flex: 1}}>
                            98751332120
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: 20,
                        paddingLeft: 30,
                        paddingRight: 30,
                        alignItems: 'center'
                    }}>
                        <div style={{fontFamily: 'Open Sans', fontWeight: '600', color: 'grey', width: 300}}>
                            Amount to be paid
                        </div>

                        <div style={{fontFamily: 'Open Sans', fontWeight: '700', flex: 1}}>
                            Rp{thousandSeparator(transaction.price_sum + transaction.delivery_fee)}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={0} md={1}/>
                <Col xs={12} md={10}  {...getRootProps()} style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: '7px',
                    marginTop: 5
                }}>
                    <div style={{
                        boxShadow: isDragActive ? '0 0 10px #9ecaed' : null,
                        border: '2px dashed #dadada',
                        borderRadius: '7px',
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1
                    }}>
                        <input {...getInputProps()} />

                        {previewUrl ?
                            <>
                                <div style={{
                                    fontFamily: 'Open Sans',
                                    fontWeight: '600',
                                    color: 'grey',
                                    fontSize: 'calc(.5vw + 1rem)',
                                    marginTop: 15,
                                    marginBottom: 10
                                }}>
                                    Proof Preview
                                </div>

                                <img
                                    src={previewUrl ? previewUrl : null}
                                    style={{
                                        width: '80%',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                        borderColor: 'grey',
                                        maxWidth: '400px',
                                        marginBottom: 0
                                    }}/>


                                <Row style={{
                                    width: '100%',
                                    marginTop: 20,
                                    marginBottom: 15
                                }}>
                                    <Col xs={12} style={{marginBottom: 5}}>
                                        <Button
                                            disabled={isLoading}
                                            variant={'secondary'} style={{
                                            fontFamily: 'Signika',
                                            fontWeight: '600',
                                            fontSize: '1em',
                                            paddingTop: 8,
                                            paddingBottom: 8,
                                            paddingLeft: 25,
                                            paddingRight: 25,
                                            opacity: isLoading ? .3 : 1
                                        }}>
                                            Change Proof
                                        </Button>
                                    </Col>
                                    {proofFile &&
                                    <Col>
                                        {/*<Link to={'thank-you'}>*/}
                                        <Button variant={'primary'} onClick={(e) => {
                                            e.stopPropagation();
                                            uploadProof();
                                        }} disabled={!previewUrl || isLoading}
                                                style={{
                                                    fontFamily: 'Signika',
                                                    fontWeight: '600',
                                                    fontSize: '1em',
                                                    paddingLeft: isLoading ? 15 : 39,
                                                    paddingRight: isLoading ? 15 : 39,
                                                    paddingTop: 8,
                                                    paddingBottom: 8,
                                                    opacity: !previewUrl || isLoading ? .25 : 1,
                                                    borderColor: 'rgb(240, 98, 94)',
                                                    backgroundColor: 'rgb(240, 98, 94)',
                                                }}>

                                            {
                                                isLoading ?
                                                    <>
                                                        <Spinner
                                                            animation="border"
                                                            size={'sm'}
                                                            style={{
                                                                color: 'white',
                                                                marginBottom: 3,
                                                                marginRight: 7
                                                            }}
                                                        />

                                                        Uploading
                                                    </> :
                                                    'Upload'
                                            }

                                        </Button>
                                        {/*</Link>*/}
                                    </Col>
                                    }
                                </Row>
                            </> :

                            <>
                                <AiOutlineCloudUpload color={'grey'} size={'4em'}
                                                      style={{marginTop: 15}}/>
                                <div style={{
                                    fontFamily: 'Open Sans',
                                    fontWeight: '500',
                                    color: 'grey',
                                    fontSize: '1.5em'
                                }}>
                                    Drag proof of payment here
                                </div>
                                <div style={{
                                    fontFamily: 'Open Sans',
                                    fontSize: '1em',
                                    color: 'grey',
                                    marginTop: 10,
                                    marginBottom: 10
                                }}>
                                    or
                                </div>

                                <Button variant={'primary'} style={{
                                    fontFamily: 'Signika',
                                    fontWeight: '500',
                                    fontSize: '1.1em',
                                    marginBottom: 25,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    borderColor: 'rgb(240, 98, 94)',
                                    backgroundColor: 'rgb(240, 98, 94)'
                                }}>
                                    Pick Photo
                                </Button>
                            </>
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
