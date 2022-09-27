import React, {useState} from "react";
import FAQCard from "../components/FAQCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function FAQPage() {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [selectedFAQ, setSelectedFAQ] = useState(0);

    const handleOrderChange = (key) => {
        setSelectedFAQ(selectedFAQ === key ? -1 : key);
    };

    return (
        <Container>
            <Row>
                <Col style={{
                    backgroundColor: 'white', marginTop: 40, borderRadius: 10, paddingTop: 40,
                    paddingBottom: 40,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <div style={{
                        textAlign: 'center',
                        fontFamily: 'Signika',
                        fontWeight: '700',
                        fontSize: '1.5em',
                        marginBottom: 30
                    }}>
                        Terms & Conditions
                    </div>
                    <Container>
                        <div>
                            <b>Welcome to Technicolor 2020!</b><br/>
                            We encourage you to read all of the terms and conditions before purchasing any products. By using our website and other related services, we ensure that you have agreed upon the terms and conditions in using this website.
                        </div><br/>
                        <div>
                            <b>General</b><br/>
                            The products and services on the website are contemplated for individual and non-commercial purposes only. By accessing the website, you agree to use it only for non-commercial purposes and in accordance with all state and local laws. Any modifications, copy, sell, lease, or with the aim of exploiting our website will receive further consequences.
                        </div><br/>
                        <div>
                            <b>Privacy</b><br/>
                            We guarantee the privacy of all customers’ information concerning the collection and disclosure to protect your information. This privacy policy is integrated into this agreement, and by accessing our website, you are bound to agree on the privacy policy.
                        </div><br/>
                        <div>
                            <b>Format Order</b><br/>
                            To alleviate a comfortable service environment, we expect you to read the format order carefully before filling, to prevent any unwanted changes. You have to provide accurate, detailed, and factual information regarding your shipping address. All of your information will remain confidential.
                        </div><br/>
                        <div>
                            <b>Purchases</b><br/>
                            Please note that all of the products are not reserved. Once you fill in the format order, you won’t be able to change or update any information as it directly connects to the web operator and respective online shop. You must inform the web operator through “Contact us” feature and respective online shop through “Chat” for the changes of information. Your orders will proceed once your payment is successful.
                        </div><br/>
                        <div>
                            <b>Return and Exchange Policy</b><br/>
                            We are not responsible for the causes of missing, damaged, or even receive the wrong product in any of your purchases. Therefore, the return and exchange policy is not available on our website. Once you place your order, your purchases will be under the responsibility of the respective online shops. You are allowed to contact the respective online shops regarding the return and exchange of your product. But, we don’t guarantee that all online shops will provide the return and exchange policy service.
                        </div><br/>
                        <div>
                            <b>Others</b><br/>
                            This website is under the control of web operator, which is a part of the Technicolor committee. By accessing the website, you are bound to agree to all of the Terms and Conditions. Any violation of the Terms and Conditions, further consequences will be applied and we will prohibit your access to this website permanently.
                        </div><br/>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}
