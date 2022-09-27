import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Vendor from "../models/Vendor";
import Palette from "../Palette";
import {Link} from "react-router-dom";
import Location from "../models/Location";
import Spinner from "react-bootstrap/Spinner";

function CategoryDetailPage(props) {

    const [isBagHovered, setBagHovered] = useState(false);
    const [isBurgerHovered, setBurgerHovered] = useState(false);
    const [isPPHovered, setPPHovered] = useState(false); //PP stands for Profile Picture
    const [isLoading, setIsLoading] = useState(true)

    const [vendors, setVendors] = useState([]);
    let {category} = props.match.params;
    category = category.charAt(0).toUpperCase() + category.slice(1)
    category = category.replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
    });

    useEffect(() => {
        console.log(props)
        getVendors()
    }, [category])

    const getVendors = async () => {
        setIsLoading(true);
        let model = new Vendor();
        let locationModel = new Location();

        try {
           let result = await model.getByCategory(category);

            if(result.length > 0) {
                let cities = await locationModel.getAllCities();

                cities = cities.rajaongkir.results;
                console.log(cities)

                result.map((store, idx) => {

                    cities.map(city => {
                        if(store.city_code === city.city_id) {
                            result[idx].city_name = city.city_name
                        }
                    })
                })
            }

           setVendors(result)
            setIsLoading(false);

           console.log('result', result)
        } catch (e) {
            console.log('e', e)
        }
    }

    return (
        <Container fluid style={{backgroundColor: '#fafafa', minHeight: '100vh'}}>

            <Container style={{marginTop: 30}}>

                <Row>
                    <Col md={12} style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <h1 style={{
                            color: Palette.PRIMARY
                        }}>
                            {category === 'Home&living' ? 'Home & Living' : category}
                        </h1>
                    </Col>
                </Row>

                {
                    isLoading ?
                        <Spinner style={{width:'4rem', height:'4rem', marginLeft:'47%', marginTop:'15%'}}animation="border" variant="danger"/> :
                        <Row style={{
                            borderRadius: 5,
                            paddingTop: 20,
                            paddingBottom: 20,
                        }}>
                            {
                                vendors.map(vendor => {
                                    return (
                                        <Col md={6}>
                                            <Col style={{
                                                display: 'flex', flexDirection: "column", borderRadius: 15,
                                                justifyContent: 'center', background: "white", paddingTop: 15, paddingBottom: 15,
                                                marginBottom: 25, marginTop: 25
                                            }}>
                                                <Row>
                                                    <Col md={12} lg={6}
                                                         style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                                                        <div style={{
                                                            width: 75,
                                                            height: 75,
                                                            padding: 5,
                                                            marginRight: 8
                                                        }}>
                                                            <img
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    borderRadius: 8
                                                                }}
                                                                src={vendor.logo_url ? vendor.logo_url : '/no-image-placeholder.jpg'}/>
                                                        </div>

                                                        <div style={{
                                                            flex: 1
                                                        }}>
                                                            <b>{vendor.name}</b><br/>
                                                            {vendor.city_name}
                                                        </div>
                                                    </Col>

                                                    <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                                        <Link to={`/store/${vendor.id}`}>
                                                            <Button style={{
                                                                width: 125,
                                                                backgroundColor: Palette.PRIMARY,
                                                                borderWidth: 0,
                                                                fontFamily: 'Signika',
                                                                fontWeight: '700'
                                                            }}>
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </Col>

                                                </Row>
                                            </Col>
                                        </Col>
                                    )
                                })
                            }
                        </Row>

                }


            </Container>


        </Container>
    );

}

export default CategoryDetailPage;
