import React, {useState} from "react";
import FAQCard from "../components/FAQCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function FAQPage() {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [selectedFAQ, setSelectedFAQ] = useState(0);


    const FAQs = [
        {
            question: 'How long do the Technicolor 2020 last?',
            answer: 'Technicolor 2020 will start on Friday, 22 January 2020 – Saturday, 23 January 2020. Our website open from 10:00 WIB – 21:00 WIB.'
        },
        {
            id: 2,
            question: 'Is all of my information safe?',
            answer: 'We can guarantee that all of your information will be confidential.'
        },
        {
            question: 'Where does Technicolor products ship?',
            answer: 'Technicolor 2020 is a platform for online shops to sell the goods available for customers. Online shops currently ship to Jabodetabek and Tangerang area. '
        },
        {
            question: 'When will my order ship?',
            answer: 'Steps:\n' +
                'Order\n' +
                'Payment process\n' +
                'Ship\n' +
                '\n' +
                'Technicolor collaborate with various categories of online shops. All of your purchases will be derived to the respective online shops for shipping process. The latest purchase is on 21:00 WIB. You will get a shipment notification to your email along with the tracking number as soon as your package ship.\n'
        },
        {
            question: 'Is there guarantee if my package is missing, damage or receive the wrong product?',
            answer: 'We do apologize, we are not responsible for the causes of missing, damage, or even receive the wrong product in any of your purchases. Once you place your order, your purchases will be under the responsibility of the respective online shops. '
        },
        {
            question: 'Can I change my order?',
            answer: 'Unfortunately, once your order has been placed, you won’t be able to make any changes in the Technicolor website. We cannot guarantee for you to be able to do any changes but you may directly contact the respective online shops for the availability regarding changes or update. '
        },
        {
            question: 'What if I input the wrong address?',
            answer: 'As you directly input the address in the system, you won’t be able to make any changes. However, you can use “Contact Us” feature regarding the updated address and inform the updated address to respective online shop through “chat” feature.'
        },
        {
            question: 'About payment',
            answer: 'We only accept payment via bank transfer to the bank account number provided, which will be listed once you checkout your purchases and fill the format order. You must attach the evidence of transaction to proceed the shipment process.'
        },
    ]

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
                        Frequently Asked Questions
                    </div>

                    {
                        FAQs.map((obj, key) => {
                            return(
                                <FAQCard
                                    expanded={selectedFAQ === key}
                                    question={obj.question}
                                    answer={obj.answer}
                                    onClick={()=>{
                                        handleOrderChange(key)
                                    }}
                                />
                            )
                        })
                    }
                </Col>
            </Row>
        </Container>
    )
}
