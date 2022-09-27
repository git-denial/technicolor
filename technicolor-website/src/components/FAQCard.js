import Col from "react-bootstrap/Col";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import Palette from "../Palette";
import React, {useEffect, useState} from "react";


export default function DODetailCard(props) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const {onClick, expanded} = props;

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    }

    return (
        <Col md={12}>

            <div
                style={{
                    boxShadow: '0 0 5px #9ecaed',
                    border: `1px solid ${Palette.PRIMARY}`,
                    paddingTop: 25,
                    paddingBottom: 25,
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginBottom: 15,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: isMobile ? 'flex-start' : "center",
                    borderRadius: 5
                }}
            >
                <div style={{flex: 1, display: "flex", flexDirection: "column", overflow: 'hidden'}}>
                    <div
                        onClick={onClick}
                        style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                        <div style={{flex: 1, fontFamily: 'Signika', fontWeight: '600', fontSize: '1.1em'}}>
                            {props.question}
                        </div>

                        <div style={{width: 22, height: 22, backgroundColor: Palette.PRIMARY, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {!expanded ? <FaChevronDown size={14} color={'white'}/> : <FaChevronUp size={14} color={'white'}/>}
                        </div>
                    </div>


                    <div style={{fontFamily: 'Open Sans', marginTop: expanded ? 10 : 0, height: expanded ? 'auto' : 0}}>
                        {props.answer}
                    </div>
                </div>
            </div>
        </Col>
    )
}
