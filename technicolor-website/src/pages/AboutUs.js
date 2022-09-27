import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import gambarUtama from '../assets/images/gambar utama .jpg';
import gambarSamping from '../assets/images/gambar disamping objectives.jpg';
import frontFaceTalentCoordinator from '../assets/images/Bianca Allysa_Talent Coordinator.jpg';
import frontFacePublication1 from '../assets/images/Shereen Trixie_Publication.JPG'
import frontFacePublication2 from '../assets/images/Marco Tan Utama_Publication.jpg'
import frontFaceFrontHouseManager from '../assets/images/Erina Sutandi_Front of House Manager.JPG'
import tenantCoordinator1 from '../assets/images/Cheryl Gabriela_Tenant Coordinator.JPG';
import tenantCoordinator2 from '../assets/images/Dionisius Excel_Tenant Coordinator.JPG';
import tenantCoordinator3 from '../assets/images/Sarah Shakina_Tenant Coordinator.JPG';
import tenantCoordinator4 from '../assets/images/Ria Enjelita Damanik_Tenant Coordinator.jpeg';
import tenantManager from '../assets/images/Anastasia Marcelli Wiramihardja_Tenant Manager.jpeg';
import websiteAdmin1 from '../assets/images/Marcel Devara Sutrisno_Website Administrator.JPG';
import websiteAdmin2 from '../assets/images/Salsa Juniyar Solichin_ Website Administrator.jpeg';
import websiteAdmin3 from '../assets/images/Aurellia Angelica_Website Administrator.jpeg';
import websiteOperator1 from '../assets/images/Reynard Gautama Salim_Website Operator.JPG';
import websiteOperator2 from '../assets/images/Tasya Graciella Djamil_Website Operator.jpeg';
import websiteManager from '../assets/images/Garille Tasmara_Website Manager.JPG';
import ProgramDirector from '../assets/images/Erica Sutandi_Program Director.JPG';
import ViceHead from '../assets/images/Clasinta Cindy Widjaja_Vice Head of Technicolor Committee.jpeg';
import Head from '../assets/images/Elkalos Lesley Susilo_ Head of Technicolor Committee.JPG';
import AdministrativeOfficer from '../assets/images/Nana_Administrative Officer.jpeg';

import Palette from "../Palette";
import {Collapse, Fade} from "react-bootstrap";
import {FaChevronCircleLeft, FaChevronCircleRight} from "react-icons/all";

function AboutUs(props) {

    const [isBagHovered, setBagHovered] = useState(false);
    const [isBurgerHovered, setBurgerHovered] = useState(false);
    const [isPPHovered, setPPHovered] = useState(false); //PP stands for Profile Picture

    const [isTeamExpanded, setIsTeamExpanded] = useState(false)

    const [isExecutiveExpanded, setIsExecutiveExpanded] = useState(false)
    const [selectedMinds, setSelectedMinds] = useState("")

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    return (

        <Container style={{marginTop: 30, paddingBottom: 30}}>

            <Container style={{
                backgroundColor: 'white',
                paddingBottom: 10
            }}>
                <Row style={{
                    borderRadius: 5,
                    paddingTop: 20,
                    paddingBottom: 20,
                    display: "flex",
                    justifyContent: "center"
                }}
                >
                    <Col style={{display: 'flex', justifyContent: 'center'}} md={12}>
                        <img src={gambarUtama} style={{
                            width: '100%',
                            height: '100%',
                            maxHeight: 400,
                            borderRadius: 10,
                            objectFit: 'cover',
                            objectPosition: 'top'
                        }}/>
                    </Col>

                    <Col md={10} style={{color: Palette.PRIMARY, marginTop: 15}}>
                        <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.7em'}}>
                            About Technicolor 2021
                        </div>

                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Signika',
                            fontWeight: '300',
                            fontSize: '1.2em',
                            color: Palette.GREY,
                            marginTop: 10,
                            textIndent: '20px',
                            lineHeight: '1.7em'
                        }}>
                            Hi there, nice to see you here! We are from Technicolor 2021 held by Swiss German University Hotel and Tourism Management batch 2018. The event will be held for 2 days from Friday, 22nd January 2021 – Saturday, 23rd January 2021.  Technicolor act as a medium for businesses to trade and discover new opportunities and experience. Our goal is to help “YOU” as a business owner to introduce your product in return of gaining more awareness from society. Enhance creativity, unleash innovation and inspire the society.  Visualize your dream business with Technicolor.
                        </div>
                    </Col>
                </Row>

                <Row style={{
                    marginTop: 30
                }}
                >
                    <Col md={12} style={{
                        paddingBottom: 25
                    }}>
                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Signika',
                            fontWeight: '700',
                            fontSize: '1.7em',
                            color: Palette.PRIMARY
                        }}>
                            Objectives
                        </div>
                    </Col>
                    <Col md={6} style={{
                        color: Palette.GREY,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: '1.3em',
                        textAlign: "center"
                    }}>
                        To support all local start-up business.<br/><br/>
                        To support the act of using domestic products.<br/><br/>
                        To act as a medium to enhance experience of SGU Students.<br/><br/>
                        To become a media where people can broaden their network and gain awareness from the society.
                    </Col>
                    <Col md={6}>
                        <img src={gambarSamping} style={{
                            width: "100%",
                            height: 450,
                            objectFit: "cover",
                            borderRadius: 10,
                        }}/>
                    </Col>
                </Row>

                <Row style={{
                    marginTop: 30,
                    marginBottom: 20
                }}
                >
                    <Col md={12}>
                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Signika',
                            fontWeight: '700',
                            fontSize: '1.5em',
                            color: Palette.PRIMARY
                        }}>
                            Meet the Committee
                        </div>
                    </Col>

                    <Collapse in={!isTeamExpanded}>

                        <Col md={12}>


                            <div
                                onClick={() => {
                                    setIsTeamExpanded(true)
                                }}
                                style={{
                                    backgroundColor: Palette.YELLOW,
                                    color: Palette.PRIMARY,
                                    height: 300,
                                    marginTop: 30,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    textAlign: 'center',
                                    paddingLeft: 20, paddingRight: 20
                                }}>
                                <h4>Look who are behind the scenes</h4>
                            </div>
                        </Col>
                    </Collapse>

                    <Collapse in={isTeamExpanded}>
                        <div>

                        </div>
                    </Collapse>
                </Row>

                <Collapse in={isTeamExpanded}>

                    <Row>
                        <Col md={12}>

                            <div
                                onClick={() => {
                                    setIsExecutiveExpanded(true)
                                }}
                                style={{
                                    backgroundColor: Palette.AQUA,
                                    color: Palette.PRIMARY,
                                    height: 300,
                                    marginTop: 30,
                                    borderRadius: 10,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: isExecutiveExpanded ? null : "pointer"
                                }}>
                                <h4 style={{paddingBottom: 10}}>Meet The Executives</h4>

                                <Collapse in={isExecutiveExpanded}>
                                    <Row style={{width: "100%"}}>
                                        <Col md={4} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                        >
                                            <div style={{
                                                backgroundColor: Palette.SECONDARY,
                                                height: 160,
                                                width: 160,
                                                borderRadius: 80,
                                                padding: 4
                                            }}>
                                                <img
                                                    style={{
                                                        borderRadius: 80,
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                    src={ViceHead}/>
                                            </div>
                                            <b style={{
                                                width: "100%",
                                                textAlign: "center"
                                            }}>
                                                Clasinta Cindy Widjaja<br/>
                                            </b>
                                            <div>
                                                Vice Head of Technicolor Committee
                                            </div>
                                        </Col>
                                        <Col md={4} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                        >
                                            <div style={{
                                                backgroundColor: Palette.SECONDARY,
                                                height: 160,
                                                width: 160,
                                                borderRadius: 80,
                                                padding: 4
                                            }}>
                                                <img
                                                    style={{
                                                        borderRadius: 80,
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                    src={Head}/>
                                            </div>
                                            <b style={{
                                                width: "100%",
                                                textAlign: "center"
                                            }}>
                                                Elkalos Lesley Susilo<br/>
                                            </b>
                                            <div>
                                                Head of Technicolor Committee
                                            </div>
                                        </Col>
                                        <Col md={4} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center"
                                        }}
                                        >
                                            <div style={{
                                                backgroundColor: Palette.SECONDARY,
                                                height: 160,
                                                width: 160,
                                                borderRadius: 80,
                                                padding: 4
                                            }}>
                                                <img
                                                    style={{
                                                        borderRadius: 80,
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                    src={AdministrativeOfficer}/>
                                            </div>
                                            <b style={{
                                                width: "100%",
                                                textAlign: "center"
                                            }}>
                                                Nana<br/>
                                            </b>
                                            <div>
                                                Administrator Officer
                                            </div>
                                        </Col>
                                    </Row>
                                </Collapse>


                            </div>

                            {/*<Fade in={isExecutiveExpanded}>*/}
                            {/*    <div style={{*/}
                            {/*        backgroundColor: Palette.AQUA,*/}
                            {/*        color: Palette.PRIMARY,*/}
                            {/*        height: 300,*/}
                            {/*        marginTop: 30,*/}
                            {/*        borderRadius: 10,*/}
                            {/*        display: "flex",*/}
                            {/*        alignItems: "center",*/}
                            {/*        justifyContent: "center",*/}
                            {/*        cursor: "pointer"*/}
                            {/*    }}>*/}
                            {/*        <h4>Meet The Executives</h4>*/}
                            {/*    </div>*/}
                            {/*</Fade>*/}


                        </Col>
                        <Col md={12} style={{display: "flex", flexDirection: "row"}}>

                            <div
                                onClick={() => {
                                    setSelectedMinds("CREATIVE")
                                }}
                                style={{
                                    width: selectedMinds === "CREATIVE" ? "95%" : selectedMinds === "FRONT" && windowWidth >= 768 ? "5%" : selectedMinds === "FRONT" && windowWidth < 768 ? '10%'  : "50%",
                                    transition: 'width .2s',
                                    backgroundColor: Palette.SECONDARY,
                                    color: Palette.PRIMARY,
                                    marginTop: 30,
                                    borderRadius: "15px 0 0 15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}>
                                {
                                    selectedMinds !== "FRONT" ?
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            paddingTop: 20,
                                            paddingBottom: 20
                                        }}
                                        >
                                            <h4 style={{paddingBottom: 10, textAlign: 'center'}}> Meet The Creative Minds</h4>
                                            <Collapse
                                                timeout={1000}
                                                dimension={"width"}
                                                in={selectedMinds === "CREATIVE"}>
                                                <Row style={{width: "100%"}}>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={ProgramDirector}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Erica Sutandi<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Program Director
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={tenantManager}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Anastasia Marcelli Wiramihardja<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tenant Manager
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={tenantCoordinator2}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Dionisius Excel<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tenant Coordinator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={tenantCoordinator1}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Cheryl Gabriela<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tenant Coordinator
                                                        </div>
                                                    </Col>

                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={tenantCoordinator3}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                           Sarah Shakina<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tenant Coordinator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={tenantCoordinator4}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Ria Enjelita Damanik<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tenant Coordinator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteManager}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Garille Tasmara<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Manager
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteAdmin1}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Marcel Devara Sutrisno<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Administrator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteAdmin2}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Salsa Juniyar Solichin<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Administrator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteAdmin3}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Aurellia Angelica<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Administrator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteOperator2}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Tasya Graciella Djamil<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Operator
                                                        </div>
                                                    </Col>
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.AQUA,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={websiteOperator1}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Reynard Gautama Salim<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Website Operator
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Collapse>
                                        </div>
                                        :
                                        <>
                                            <FaChevronCircleRight size={22} style={{
                                                color: Palette.AQUA,
                                            }}/>
                                        </>

                                }
                            </div>

                            <div
                                onClick={() => {
                                    setSelectedMinds("FRONT")
                                }}
                                style={{
                                    width: selectedMinds === "FRONT" ? "95%" : selectedMinds === "CREATIVE"  && windowWidth >= 768? "5%" : selectedMinds === "CREATIVE"  && windowWidth < 768 ? '10%' : "50%",
                                    transition: 'width .2s',
                                    backgroundColor: Palette.AQUA,
                                    color: Palette.PRIMARY,
                                    marginTop: 30,
                                    borderRadius: "0 15px 15px 0px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}>
                                {
                                    selectedMinds !== "CREATIVE" ?
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            paddingTop: 20,
                                            paddingBottom: 20
                                        }}
                                        >
                                            <h4 style={{paddingBottom: 10,}}> Meet The Front Faces</h4>
                                            <Collapse
                                                dimension={"width"}
                                                timeout={1000}
                                                in={selectedMinds === "FRONT"}>
                                                <Row style={{width: "100%"}}>
                                                <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.SECONDARY,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={frontFaceFrontHouseManager}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Erina Sutandi<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Front of House Manager
                                                        </div>
                                                    </Col>
                                                    
                                                    
                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.SECONDARY,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={frontFaceTalentCoordinator}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Bianca Allysa<br/>
                                                        </b>
                                                        <div>
                                                            Talent Coordinator
                                                        </div>
                                                    </Col>

                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.SECONDARY,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={frontFacePublication1}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Shereen Trixie<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Publication
                                                        </div>
                                                    </Col>

                                                    <Col md={3} style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        marginBottom: 20
                                                    }}
                                                    >
                                                        <div style={{
                                                            backgroundColor: Palette.SECONDARY,
                                                            height: 140,
                                                            width: 140,
                                                            borderRadius: 80,
                                                            padding: 4
                                                        }}>
                                                            <img
                                                                style={{
                                                                    borderRadius: 80,
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                src={frontFacePublication2}/>
                                                        </div>
                                                        <b style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Marco Tan<br/>
                                                        </b>
                                                        <div style={{
                                                            width: "100%",
                                                            textAlign: "center"
                                                        }}>
                                                            Publication
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </Collapse>
                                        </div>
                                        :
                                        <>
                                            <FaChevronCircleLeft size={22} style={{
                                                color: Palette.SECONDARY,
                                            }}/>
                                        </>

                                }
                            </div>

                        </Col>
                    </Row>

                </Collapse>

            </Container>

        </Container>

    );

}

export default AboutUs;
