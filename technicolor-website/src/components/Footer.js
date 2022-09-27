import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Palette from "../Palette";
import Container from "react-bootstrap/Container";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {isMobile} from "react-device-detect"

function Footer(props) {

    const [isBagHovered, setBagHovered] = useState(false);
    const [isBurgerHovered, setBurgerHovered] = useState(false);
    const [isPPHovered, setPPHovered] = useState(false); //PP stands for Profile Picture

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }


    return (
        <Row style={{
            boxShadow: '0 0px 8px rgba(100,100,100,.25)',
            paddingBottom: 15,
            backgroundColor: 'white',
            marginTop: 70,
        }}
        >

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <img src={'/logo.png'} style={{width: 65, height: 65, objectFit: 'contain', margin:'15px'}}/>

                {/* <img src={'/logo.png'} style={{width: 110, height: 110, marginLeft: 50, objectFit: 'contain'}}/> */}
            </div>
            {
                !isMobile && <>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>

                        <Link to={'/about'} style={{color: Palette.PRIMARY, fontWeight: '600',}}>Info</Link>

                        <span style={{marginLeft: 15, marginRight: 15, color: Palette.PRIMARY}}>|</span>

                        <Link to={'/faq'} style={{color: Palette.PRIMARY, fontWeight: '600',}}>FAQ</Link>

                        <span style={{marginLeft: 15, marginRight: 15, color: Palette.PRIMARY}}>|</span>

                        <Link to={'/terms-and-conditions'} style={{color: Palette.PRIMARY, fontWeight: '600'}}>Terms &
                            Conditions</Link>

                        <span style={{marginLeft: 15, marginRight: 15, color: Palette.PRIMARY}}>|</span>
                        <Link to={'/contact-us'} style={{color: Palette.PRIMARY, fontWeight: '600'}}>Contact
                            Us</Link>
                    </div>
                </>

            }
        </Row>
    )


    // return <Row style={{
    //     boxShadow: '0 5px 8px rgba(0,0,0,.5)',
    //     paddingTop: 30,
    //     paddingBottom: 30,
    //     backgroundColor: 'white',
    //     marginTop: 70,
    //     position: 'fixed',
    //     width: '100%',
    //     bottom: 0
    // }}
    // >
    //     <Col style={{display: 'flex', alignItems: 'center'}}>
    //         <div
    //             onMouseOver={() => setBurgerHovered(true)}
    //             onMouseLeave={() => setBurgerHovered(false)}
    //             style={{
    //                 backgroundColor: !isBurgerHovered ? Palette.PRIMARY : '#9BFBFF',
    //                 color: '#9BFBFF',
    //                 transition: 'background-color .4s',
    //                 width: 70,
    //                 height: 70,
    //                 borderRadius: 35,
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 flexDirection: 'column',
    //                 cursor: 'pointer'
    //             }}>
    //             <img src={'./logo.png'} style={{width: 110, height: 110, marginLeft: 30}}/>
    //         </div>
    //     </Col>
    //
    //     <Col style={{
    //         fontFamily: 'Open Sans',
    //         fontSize: 25,
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         color: Palette.PRIMARY,
    //         flexDirection: 'column',
    //         fontWeight: '700'
    //     }}>
    //         Info<br/>
    //         <Link to={'/faq'} style={{color: Palette.PRIMARY, fontWeight: '400', fontSize: 20, marginTop: 5}}>FAQ</Link>
    //         <Link to={'#'} style={{color: Palette.PRIMARY, fontWeight: '400', fontSize: 20, marginTop: 5}}>Terms &
    //             Conditions</Link>
    //         <Link to={'/contact-us'} style={{color: Palette.PRIMARY, fontWeight: '400', fontSize: 20, marginTop: 5}}>Contact
    //             Us</Link>
    //     </Col>
    //
    //     <Col style={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-end'
    //     }}>
    //         <img src={'./timberland.png'} style={{width: 140, height: 140, objectFit: 'contain'}}/>
    //     </Col>
    // </Row>
}

export default Footer
