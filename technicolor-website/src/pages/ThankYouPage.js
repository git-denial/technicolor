import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";

export default function ThankYouPage () {
    return (
        <Container>
            <Row>
                <Col style={{
                    backgroundColor: 'white', marginTop: 40, borderRadius: 10, paddingTop: 30,
                    paddingBottom: 25,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginBottom: 25
                }}>
                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em'}}>
                       Thank you for shopping with us!
                    </div>

                    <div style={{textAlign: 'center', fontFamily: 'Open Sans', fontSize: '1.2em'}}>
                        Your package will be delivered soon
                    </div>

                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em'}}>
                        Have a good day!
                    </div>

                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em', marginTop: 30}}>
                        - Technicolor 2020 -
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
