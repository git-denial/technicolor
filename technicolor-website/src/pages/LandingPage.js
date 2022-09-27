import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import Palette from "../Palette";
import {Link} from "react-router-dom";
import {Carousel} from 'react-responsive-carousel';
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import HomeImage1 from '../assets/images/Home Picture Sliding 1.jpg';
import HomeImage2 from '../assets/images/Home Picture Sliding 2.jpeg';
import HomeImage3 from '../assets/images/Home Picture Sliding 3.jpg';
import HomeImg from '../assets/images/1. Home and Living .png';
import AntiquesImg from '../assets/images/3. Antiques .png';
import ShoesImg from '../assets/images/5. Shoes .png';
import ClothingImg from '../assets/images/2. Clothing .png';
import AccessoriesImg from '../assets/images/4. Accessories .png';

function LandingPage(props) {

    const [isBagHovered, setBagHovered] = useState(false);
    const [isBurgerHovered, setBurgerHovered] = useState(false);
    const [isPPHovered, setPPHovered] = useState(false); //PP stands for Profile Picture
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining({
                hours: moment('2021-01-23 17:00:00').diff(moment(), 'hours'),
                minutes: moment('2021-01-23 17:00:00').diff(moment(), 'minutes') % 60,
                seconds: moment('2021-01-23 17:00:00').diff(moment(), 'seconds') % 60
            })

            if (timeRemaining.hours < 0 || timeRemaining.minutes < 0 || timeRemaining.seconds < 0) clearInterval(interval)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Container fluid style={{backgroundColor: '#fafafa', minHeight: '100vh'}}>

            <Container style={{marginTop: 30}}>
                <Row style={{
                    borderRadius: 5,
                    paddingTop: 20,
                    paddingBottom: 20,
                    backgroundColor: 'white'
                }}>
                    <Col style={{display: 'flex', justifyContent: 'center'}} md={12}>
                        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>

                            <div style={{backgroundColor: 'white'}}>
                                <img src={HomeImage1} style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 300,
                                    borderRadius: 10,
                                    objectFit: 'cover'
                                }}/>
                            </div>

                            <div style={{backgroundColor: 'white'}}>
                                <img src={HomeImage2} style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 300,
                                    borderRadius: 10,
                                    objectFit: 'cover'
                                }}/>
                            </div>

                            <div style={{backgroundColor: 'white'}}>
                                <img src={HomeImage3} style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 300,
                                    borderRadius: 10,
                                    objectFit: 'cover'
                                }}/>
                            </div>
                        </Carousel>
                    </Col>

                    <Col style={{color: Palette.PRIMARY, marginTop: 15}}>
                        <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.9em'}}>
                            Welcome to Technicolor 2021
                        </div>

                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Signika',
                            fontWeight: '300',
                            fontSize: '1.15em',
                            color: '#9e9e9e',
                            marginTop: 10
                        }}>
                            {'We are committed in providing excellence by delivering priceless memories, and we are excited to announce that Technicolor 2021 is officially open from Friday, 22nd January 2021 – Saturday, 23rd January 2021. All purchases and payment must be done by 21:00 the latest. '}
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 15}}>

                            <Link to={"/about"}>
                                <Button style={{
                                    width: 200,
                                    backgroundColor: Palette.PRIMARY,
                                    borderWidth: 0,
                                    fontFamily: 'Signika',
                                    fontWeight: '700'
                                }}>
                                    More About Us
                                </Button>
                            </Link>

                        </div>
                    </Col>
                </Row>

                <Row style={{
                    borderRadius: 5,
                    paddingTop: 20,
                    paddingBottom: 20,
                    backgroundColor: 'white',
                    marginTop: 30
                }}>
                    <Col style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'Open Sans',
                        fontWeight: '700',
                        fontSize: '2.5em',
                        maxWidth: 230,
                    }}>
                        Shop<br/>By<br/>Category
                    </Col>

                    <Col style={{
                        color: Palette.PRIMARY,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Row>
                            <Col md={4} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Link to={"/category/home&living"} style={{color: Palette.PRIMARY}}>

                                    <img src={HomeImg}
                                         style={{width: 110, height: 110, borderRadius: 5, objectFit: 'cover'}}/>
                                    <div style={{
                                        fontFamily: 'Signika',
                                        marginTop: 3,
                                        fontSize: '.95em',
                                        width: "100%",
                                        textAlign: "center"
                                    }}>Home & Living
                                    </div>
                                </Link>

                            </Col>
                            <Col md={4} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Link to={"/category/shoes"} style={{color: Palette.PRIMARY}}>
                                    <img src={ShoesImg}
                                         style={{width: 110, height: 110, borderRadius: 5, objectFit: 'cover'}}/>
                                    <div style={{
                                        fontFamily: 'Signika',
                                        marginTop: 3,
                                        fontSize: '.95em',
                                        width: "100%",
                                        textAlign: "center"
                                    }}>Shoes
                                    </div>
                                </Link>
                            </Col>
                            <Col md={4} style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Link to={"/category/antiques"} style={{color: Palette.PRIMARY}}>
                                    <img src={AntiquesImg}
                                         style={{width: 110, height: 110, borderRadius: 5, objectFit: 'cover'}}/>
                                    <div style={{
                                        fontFamily: 'Signika',
                                        marginTop: 3,
                                        fontSize: '.95em',
                                        width: "100%",
                                        textAlign: "center"
                                    }}>Antiques
                                    </div>
                                </Link>
                            </Col>
                        </Row>

                        <Row style={{marginTop: 30}}>
                            <Col style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Link to={"/category/clothing"} style={{color: Palette.PRIMARY}}>
                                    <img src={ClothingImg}
                                         style={{width: 110, height: 110, borderRadius: 5, objectFit: 'cover'}}/>
                                    <div style={{
                                        fontFamily: 'Signika', marginTop: 3, fontSize: '.95em', width: "100%",
                                        textAlign: "center"
                                    }}>Clothing
                                    </div>
                                </Link>
                            </Col>

                            <Col style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Link to={"/category/accessories"} style={{color: Palette.PRIMARY}}>
                                    <img src={AccessoriesImg}
                                         style={{width: 110, height: 110, borderRadius: 5, objectFit: 'cover'}}/>
                                    <div style={{
                                        fontFamily: 'Signika', marginTop: 3, fontSize: '.95em', width: "100%",
                                        textAlign: "center"
                                    }}>Accessories
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                    </Col>

                </Row>

            </Container>


        </Container>
    );

}

export default LandingPage;
