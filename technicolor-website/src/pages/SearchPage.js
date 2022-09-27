import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {MdLocationOn} from "react-icons/md";
import TextEllipsis from 'react-text-ellipsis';
import {Link} from "react-router-dom";
import {GoSearch} from "react-icons/go";
import Button from "react-bootstrap/Button";
import Palette from "../Palette";
import Product from "../models/Product";
import Location from "../models/Location";

export default function StorePage(props) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const {keyword} = props.match.params;
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        getSearchResult();

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const getSearchResult = async () => {

        try {
            let model = new Product();
            let locationModel = new Location();

            const result = await model.searchVendorOrProduct(keyword)

            console.log('res chks', result)


            if(result.vendor.length > 0) {
                let cities = await locationModel.getAllCities();

                cities = cities.rajaongkir.results;

                result.vendor.map((store, idx) => {
                    cities.map(city => {
                        if(store.city_code === city.city_id) {
                            result.vendor[idx].city_name = city.city_name
                        }
                    })
                })
            }

            setStores(result.vendor)
            setProducts(result.product)

            console.log('chks res', result)
        } catch (e) {
            console.log('chks err', e)
        }
    }

    const handleResize = () => {


        setWindowWidth(window.innerWidth)
    }

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <Container style={{minHeight: 'calc(100vh - 433px)', paddingTop: 50}}>
            <Row style={{
                backgroundColor: 'white',
                borderRadius: 10,
                paddingLeft: windowWidth < 768 ? 0 : 50,
                paddingRight: windowWidth < 768 ? 0 : 50,
                paddingBottom: 10
            }}>

                <Col md={12} style={{marginTop: 40, marginBottom: 25}}>
                    <div style={{fontFamily: 'Open Sans', fontWeight: '700', fontSize: '1.2em'}}>
                        Search Result For : {keyword}
                    </div>
                </Col>


                {products.length !== 0 &&
                <Col md={12} style={{marginTop: 15, marginBottom: 25}}>
                    <div style={{fontFamily: 'Open Sans', fontWeight: '700', fontSize: '1.1em'}}>
                        Products
                    </div>
                </Col>
                }
                {products.map(product => {
                    console.log('product', product)

                    return (
                        <Col md={3} style={{cursor: 'pointer', textDecoration: 'none'}}>
                            <Link to={`/product/${product.id}`} style={{textDecoration: 'none'}}>
                                <div style={{
                                    fontFamily: 'Open Sans',
                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                                    borderRadius: 10,
                                    fontSize: '.9em',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: 0,
                                    marginBottom: 30,
                                    color: 'black',
                                }}>
                                    <img
                                        src={product.main_photo_url ? product.main_photo_url : '/no-image-placeholder.jpg'}
                                        style={{
                                            width: '100%',
                                            borderTopLeftRadius: 10,
                                            borderTopRightRadius: 10,
                                            height: 150,
                                            objectFit: 'cover'
                                        }}/>


                                    <div style={{height: 60}}>
                                        <TextEllipsis
                                            lines={2}
                                            tag={'p'}
                                            ellipsisChars={'...'}
                                            tagClass={'className'}
                                            useJsOnly={true}
                                            style={{
                                                fontFamily: 'Open Sans',
                                                paddingLeft: 12,
                                                paddingRight: 12,
                                                marginTop: 7
                                            }}
                                        >
                                            {product.name}
                                        </TextEllipsis>
                                    </div>

                                    <div style={{
                                        paddingTop: 8,
                                        paddingLeft: 12,
                                        paddingBottom: 12,
                                        fontFamily: 'Open Sans',
                                        fontWeight: '700'
                                    }}>
                                        Rp{thousandSeparator(product.price)}
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    )
                })}

                {/*<Col md={12} style={{marginBottom: 25}}>*/}
                {/*    <div style={{*/}
                {/*        fontFamily: 'Open Sans',*/}
                {/*        fontWeight: '700',*/}
                {/*        color: Palette.PRIMARY,*/}
                {/*        cursor: "pointer",*/}
                {/*        textAlign: "right"*/}
                {/*    }}>*/}
                {/*        <a>See All</a>*/}
                {/*    </div>*/}
                {/*</Col>*/}

                {stores.length !== 0 &&
                <Col md={12} style={{marginTop: 15, marginBottom: 25}}>
                    <div style={{fontFamily: 'Open Sans', fontWeight: '700', fontSize: '1.1em'}}>
                        Stores
                    </div>
                </Col>
                }

                {stores.map(store => {
                    console.log(store)

                    return (
                        <Col md={3} style={{cursor: 'pointer'}}>
                            <Link to={`/store/${store.id}`} style={{textDecoration: 'none'}}>
                                <div style={{
                                    fontFamily: 'Open Sans',
                                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                                    borderRadius: 10,
                                    fontSize: '.9em',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    paddingTop: 0,
                                    marginBottom: 30,
                                    color: 'black'
                                }}>
                                    <img
                                        style={{
                                            width: "100%",
                                            height: 150,
                                            objectFit: 'cover'
                                        }}
                                        src={store.logo_url ? store.logo_url : '/no-image-placeholder.jpg'}/>
                                    <div style={{height: 30}}>
                                        <TextEllipsis
                                            lines={2}
                                            tag={'p'}
                                            ellipsisChars={'...'}
                                            tagClass={'className'}
                                            useJsOnly={true}
                                            style={{
                                                fontFamily: 'Open Sans',
                                                paddingLeft: 12,
                                                paddingRight: 12,
                                                marginTop: 7
                                            }}
                                        >
                                            <b>{store.name}</b>
                                        </TextEllipsis>
                                    </div>
                                    <div style={{
                                        paddingLeft: 12,
                                        paddingBottom: 12,
                                        fontFamily: 'Open Sans',
                                    }}>
                                        {store.city_name}
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    )
                })}


                {/*<Col md={3} style={{cursor: 'pointer'}}>*/}
                {/*    <Link to={"/product"} style={{textDecoration: 'none'}}>*/}
                {/*        <div style={{*/}
                {/*            fontFamily: 'Open Sans',*/}
                {/*            boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',*/}
                {/*            borderRadius: 10,*/}
                {/*            fontSize: '.9em',*/}
                {/*            paddingLeft: 0,*/}
                {/*            paddingRight: 0,*/}
                {/*            paddingTop: 0,*/}
                {/*            marginBottom: 30,*/}
                {/*            color: 'black'*/}
                {/*        }}>*/}
                {/*            <img*/}
                {/*                style={{*/}
                {/*                    width: "100%",*/}
                {/*                    height: "100%",*/}
                {/*                    objectFit: "contain"*/}
                {/*                }}*/}
                {/*                src={"/timberland-small.png"}/>*/}
                {/*            <div style={{height: 30}}>*/}
                {/*                <TextEllipsis*/}
                {/*                    lines={2}*/}
                {/*                    tag={'p'}*/}
                {/*                    ellipsisChars={'...'}*/}
                {/*                    tagClass={'className'}*/}
                {/*                    useJsOnly={true}*/}
                {/*                    style={{fontFamily: 'Open Sans', paddingLeft: 12, paddingRight: 12, marginTop: 7}}*/}
                {/*                >*/}
                {/*                    <b>Timberland Official</b>*/}
                {/*                </TextEllipsis>*/}
                {/*            </div>*/}
                {/*            <div style={{*/}
                {/*                paddingLeft: 12,*/}
                {/*                paddingBottom: 12,*/}
                {/*                fontFamily: 'Open Sans',*/}
                {/*            }}>*/}
                {/*                Jakarta*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </Link>*/}
                {/*</Col>*/}

                {/*<Col md={12} style={{marginBottom: 25}}>*/}
                {/*    <div style={{*/}
                {/*        fontFamily: 'Open Sans',*/}
                {/*        fontWeight: '700',*/}
                {/*        color: Palette.PRIMARY,*/}
                {/*        cursor: "pointer",*/}
                {/*        textAlign: "right"*/}
                {/*    }}>*/}
                {/*        <a>See All</a>*/}
                {/*    </div>*/}
                {/*</Col>*/}

            </Row>
        </Container>
    )
}
