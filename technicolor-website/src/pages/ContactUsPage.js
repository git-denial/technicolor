import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import ContactForm from "../models/ContactForm";
import Alert from "react-bootstrap/Alert";
import Collapse from 'react-bootstrap/Collapse'

export default function ContactUsPage(props) {
    const [phoneNo, setPhoneNo] = useState('')

    let loggedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

    console.log(loggedUser)

    const [email, setEmail] = useState(loggedUser ? loggedUser.email : "")
    const [name, setName] = useState(loggedUser ? loggedUser.full_name : "")
    const [phoneNumber, setPhoneNumber] = useState(loggedUser ? loggedUser.phone_num : "")
    const [message, setMessage] = useState("")

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [isSending, setIsSending] = useState(false)

    const reset = () =>{
        setMessage("")
        setError("")
    }

    const submit = async () =>{
            setIsSending(true)
            setError("")
            setSuccess(false)

            if(!email){
                return setError("Please fill in Email")
            }

            if(!name){
                return setError("Please fill in your Name")
            }

            if(!message){
                return setError("Please fill in a Message")
            }

            try {

                let cfModel = new ContactForm()

                let body = {
                    name: name,
                    email: email,
                    phone_number: phoneNumber,
                    message: message
                }
                let result = await cfModel.submitForm(body);
                console.log('contact form result', result)
                setSuccess(true)
                setError(null)
                setIsSending(false)
                reset()

            } catch (e) {
                console.log(e)
                setError(JSON.stringify(e))
                setIsSending(false)

            }
    }

    return (
        <Container>
            <Row style={{display: 'flex', justifyContent: 'center'}}>
                <Col style={{
                    backgroundColor: 'white', marginTop: 40, borderRadius: 10, paddingTop: 30,
                    paddingBottom: 35,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: 25,
                    maxWidth: 650
                }}>
                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.9em'}}>
                        Contact Us
                    </div>
                    {/*}
                    <div style={{
                        textAlign: 'center',
                        fontFamily: 'Open Sans',
                        fontWeight: '600',
                        fontSize: '1.2em',
                        marginTop: 30
                    }}>
                        email us
                    </div>

                    <div style={{
                        textAlign: 'center',
                        fontFamily: 'Open Sans',
                        fontWeight: '600',
                        fontSize: '1.2em',
                        marginTop: 30
                    }}>
                        line
                    </div>
                    {*/}

                    <Row style={{width: '100%', marginTop: 25}}>
                        <Col md={6}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name}/>
                                {/*<Form.Text className="text-muted">*/}
                                {/*    We'll never share your email with anyone else.*/}
                                {/*</Form.Text>*/}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    value={email} type={'email'}/>
                                {/*<Form.Text className="text-muted">*/}
                                {/*    We'll never share your email with anyone else.*/}
                                {/*</Form.Text>*/}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        if (!isNaN(e.target.value)) {
                                            setPhoneNumber(e.target.value)
                                        }
                                    }}
                                    value={phoneNumber}/>
                                {/*<Form.Text className="text-muted">*/}
                                {/*    We'll never share your email with anyone else.*/}
                                {/*</Form.Text>*/}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    onChange={(e) => {
                                        setMessage(e.target.value)
                                    }}
                                    value={message}
                                    as="textarea" rows={3}/>
                                {/*<Form.Text className="text-muted">*/}
                                {/*    We'll never share your email with anyone else.*/}
                                {/*</Form.Text>*/}
                            </Form.Group>
                        </Col>

                        <Collapse in={success}>
                            <Col md={12}>
                                <Alert variant="success">
                                    Your form has been submitted
                                </Alert>
                            </Col>
                        </Collapse>

                        <Collapse in={error && error.length > 0}>
                            <Col md={12}>
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            </Col>
                        </Collapse>

                        <Col md={12}>
                            <Button
                                onClick={()=>{
                                    submit();
                                }}
                                disabled={isSending}
                                style={{
                                    width: '100%', borderColor: 'rgb(240, 98, 94)',
                                    backgroundColor: 'rgb(240, 98, 94)', fontFamily: 'Signika',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    fontWeight: '600',
                                    marginTop: 15,
                                }}>
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Col>

            </Row>
        </Container>
    )
}
