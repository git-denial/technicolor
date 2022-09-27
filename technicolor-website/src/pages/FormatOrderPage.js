import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import GeneralRequest from "../util/GeneralRequest";
import Location from "../models/Location";
import Spinner from "react-bootstrap/Spinner";
import Select, {components} from "react-select";
import {FaAngleDown} from "react-icons/fa";

export default function FormatOrderPage(props) {
    const DropdownIndicator = props => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <FaAngleDown color={'grey'}/>
                </components.DropdownIndicator>
            )
        );
    };

    useEffect(() => {
        if(!localStorage.getItem('user')) props.history.push('/')
    }, [])

    const [phoneNo, setPhoneNo] = useState('')
    const [provinces, setProvinces] = useState([])
    const [provinceName, setProvinceName] = useState(null);
    const [cities, setCities] = useState([])
    const [quantity, setQuantity] = useState(1);
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
    const [selectedProvince, setSelectedProvince] = useState(0);
    const [selectedCity, setSelectedCity] = useState(0);
    const {cart} = props;

    useEffect(() => {
        findProvinces()
    }, [])

    useEffect(() => {
        if(cart.length === 0) {
            props.history.push('/')
        }
    } , [cart])


    const onProvinceChange = async (target) => {
        let found = false;

        let targetArr = target.split(',');
        targetArr[0] = parseInt(targetArr[0]);

        setSelectedCity(0)
        setProvinceName(targetArr[1]);

        let model = new Location();

        let cityQueryResult = await model.getCityById(target);

        const cities = [];

        console.log('cityQueryResult', cityQueryResult)

        cityQueryResult.rajaongkir.results.map(city => {
            console.log('user', user)
            console.log('city', city)

            console.log('==============')

            if(user.city === city.city_name) {
                found = true;
                setSelectedCity({value: city.city_id, label: city.city_name})
            }

            cities.push({value: city.city_id, label: city.city_name})
        })
        // setProvinces(provinces);

        if(!found) setSelectedCity(0)
        setCities(cities);
    }

    const findProvinces = async () => {
        let model = new Location();

        let result = await model.getAllProvince();
        console.log(result);
        const provinces = [];

        result.rajaongkir.results.map(province => {
            if(user.province === province.province) {
                onProvinceChange(province.province_id)
                setSelectedProvince({value: province.province_id, label: province.province})
            }

            provinces.push({value: province.province_id, label: province.province})
        })
        setProvinces(provinces);
    }

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
                    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em'}}>
                        Delivery Information
                    </div>

                    <Form style={{width: '100%', maxWidth: 550, alignSelf: 'center', marginTop: 40}}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                value={user.full_name}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        full_name: e.target.value
                                    })
                                }}
                                placeholder="Enter full name"/>
                            {/*<Form.Text className="text-muted">*/}
                            {/*    We'll never share your email with anyone else.*/}
                            {/*</Form.Text>*/}
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        phone_num: e.target.value
                                    })
                                }}
                                value={user.phone_num}
                                placeholder="Enter phone number"/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' placeholder="Enter email"
                                          value={user.email}
                                          onChange={(e) => setUser({
                                              ...user,
                                              email: e.target.value
                                          })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Address</Form.Label>
                            <Form.Control placeholder="Enter address"
                                          value={user.address}
                                          onChange={(e) => setUser({
                                              ...user,
                                              address: e.target.value
                                          })}/>
                        </Form.Group>

                        <Form.Group controlId="form_provinsi">
                            <Form.Label>Province</Form.Label>

                            <Select
                                onChange={(option) => {
                                    setSelectedProvince(option)
                                    onProvinceChange(option.value)
                                }}
                                placeholder={'Pick province destination'}
                                value={selectedProvince}
                                options={provinces}
                                styles={{
                                    option: (provided, state) => ({
                                        ...provided,
                                        cursor: 'pointer',

                                    }),
                                    control: provided => ({
                                        ...provided,
                                        borderColor: '#e6e6e6'
                                    }),
                                }}
                                components={{DropdownIndicator, IndicatorSeparator: () => null}}
                            />
                            {/*<Form.Control onChange={(e) => {*/}
                            {/*    onProvinceChange(e.target.value)*/}
                            {/*}} as="select">*/}
                            {/*    <option value={0}>Pilih provinsi tujuan</option>*/}
                            {/*    {*/}
                            {/*        provinces.map((obj, key) => {*/}
                            {/*            return <option*/}
                            {/*                value={obj.province_id + "," + obj.province}>{obj.province}</option>*/}
                            {/*        })*/}
                            {/*    }*/}
                            {/*</Form.Control>*/}
                        </Form.Group>

                        {selectedProvince !== 0 && cities.length === 0 &&
                        <>
                            <br/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Spinner size="sm" animation="border" variant="danger"/>
                        </>
                        }

                        {cities.length !== 0 &&
                        <Form.Group controlId="form_kota" disabled>
                            <Form.Label>City</Form.Label>

                            <Select
                                value={selectedCity}
                                onChange={(option) => {
                                    setSelectedCity(option)
                                }}
                                placeholder={'Pick city destination'}
                                // value={{value: 'FREE SIZE', label: 'FREE SIZE'}}
                                options={cities}
                                styles={{
                                    option: (provided, state) => ({
                                        ...provided,
                                        cursor: 'pointer',

                                    }),
                                    control: provided => ({
                                        ...provided,
                                        borderColor: '#e6e6e6'
                                    }),
                                }}
                                components={{DropdownIndicator, IndicatorSeparator: () => null}}
                            />

                            {/*<Form.Control as="select" onChange={(e) => {*/}
                            {/*    onCityChange(e.target.value)*/}
                            {/*}}>*/}
                            {/*    <option>Pilih kota tujuan</option>*/}
                            {/*    {*/}
                            {/*        cities ? cities.map((obj, key) => {*/}
                            {/*            return <option*/}
                            {/*                value={obj.city_id + "," + obj.city_name}>{obj.city_name}</option>*/}
                            {/*        }) : <option>Pilih Kota</option>*/}
                            {/*    }*/}
                            {/*</Form.Control>*/}
                        </Form.Group>
                        }

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control placeholder="Enter postal code"
                                          value={user.zip_code}
                                          onChange={(e) => setUser({
                                              ...user,
                                              zip_code: e.target.value
                                          })}/>
                        </Form.Group>


                        <Form.Group controlId="formBasicEmail">
                            <Form.Text className="text-muted">
                                Kindly read the terms and conditions before confirming payment (Dimohon untuk membaca
                                syarat dan ketentuan sebelum mengkonfirmasi pembayaran)
                            </Form.Text>
                        </Form.Group>

                        {/*<Link to={'summary'}>*/}
                            <Button
                                onClick={() => {
                                    if(!user.full_name) {
                                        return alert('Full name cannot be blank!')
                                    } else if (!user.phone_num) {
                                        return alert('Phone number cannot be blank!')
                                    } else if (!user.email) {
                                        return alert('Email cannot be blank!')
                                    } else if (!user.address) {
                                        return alert('Address cannot be blank!')
                                    } else if(!selectedProvince) {
                                        return alert('Please select at least 1 province!')
                                    } else if(!selectedCity) {
                                        return alert('Please select at least 1 city!')
                                    }  else if (user.zip_code.length === 0) {
                                        return alert('Postal code cannot be empty!')
                                    } else if (user.zip_code.length !== 5) {
                                        return alert('Postal code must be 5 digits long!')
                                    }  else {
                                        props.history.push('/summary', {
                                            user,
                                            city: selectedCity.value
                                        })
                                    }
                                }}
                                style={{
                                    width: '100%', borderColor: 'rgb(240, 98, 94)',
                                    backgroundColor: 'rgb(240, 98, 94)', fontFamily: 'Signika',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    fontWeight: '600',
                                    marginTop: 15
                                }}>
                                Next
                            </Button>
                        {/*</Link>*/}
                    </Form>
                </Col>

                {/*<Col*/}
                {/*    md={12}*/}
                {/*    style={{*/}
                {/*        backgroundColor: 'white', marginTop: 40, borderRadius: 10, paddingTop: 40,*/}
                {/*        paddingBottom: 40,*/}
                {/*        display: 'flex',*/}
                {/*        alignItems: 'center',*/}
                {/*        flexDirection: 'column',*/}
                {/*    }}>*/}
                {/*    <div style={{textAlign: 'center', fontFamily: 'Signika', fontWeight: '700', fontSize: '1.5em'}}>*/}
                {/*        Ringkasan Pembelian*/}
                {/*    </div>*/}

                {/*    <div style={{margin: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', paddingLeft: 50}}>*/}
                {/*        <MdStoreMallDirectory style={{fontSize: 20, color: 'rgb(240, 98, 94)'}}/>*/}

                {/*        <div style={{marginLeft: 20, fontFamily: 'Signika', fontWeight: '600'}}>*/}
                {/*            Toko Timberland Indonesia*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div style={{display: 'flex', flexDirection: 'row', paddingTop: 10, paddingLeft: 40, paddingRight: 40, width: '100%'}}>*/}
                {/*        <img src={'main-banner.png'} style={{*/}
                {/*            borderRadius: 7,*/}
                {/*            height: 180,*/}
                {/*            width: 130,*/}
                {/*            objectFit: 'cover'*/}
                {/*        }}/>*/}

                {/*        <div style={{*/}
                {/*            marginLeft: 20,*/}
                {/*            fontFamily: 'Signika',*/}
                {/*            marginTop: 10,*/}
                {/*            fontSize: '1.1em',*/}
                {/*            paddingLeft: 12,*/}
                {/*            paddingRight: 12,*/}
                {/*            flex: 1*/}
                {/*        }}>*/}
                {/*            <TextEllipsis*/}
                {/*                lines={1}*/}
                {/*                tag={'p'}*/}
                {/*                ellipsisChars={'...'}*/}
                {/*                tagClass={'className'}*/}
                {/*                useJsOnly={true}*/}
                {/*                style={{marginTop: 7, marginBottom: 3, paddingRight: 15}}*/}
                {/*            >*/}
                {/*                BUSY BOARD 30x20 CM*/}
                {/*            </TextEllipsis>*/}

                {/*            <div style={{fontSize: '.85em', color: '#949494', marginBottom: 3}}>*/}
                {/*                FREE SIZE*/}
                {/*            </div>*/}

                {/*            <div style={{fontSize: '.9em', fontWeight: '600'}}>*/}
                {/*                Rp209.000*/}
                {/*            </div>*/}

                {/*            <div style={{*/}
                {/*                display: 'flex',*/}
                {/*                flexDirection: 'row',*/}
                {/*                flex: 1,*/}
                {/*                width: '100%',*/}
                {/*                marginTop: 15,*/}
                {/*                alignItems: 'center',*/}
                {/*                paddingRight: 15*/}
                {/*            }}>*/}
                {/*                <div style={{flex: 1}}>*/}
                {/*                    <div style={{*/}
                {/*                        width: 120,*/}
                {/*                        border: '1px solid #e6e6e6',*/}
                {/*                        color: 'black',*/}
                {/*                        display: 'flex',*/}
                {/*                        flexDirection: 'row',*/}
                {/*                        alignItems: 'center',*/}
                {/*                        paddingTop: 4,*/}
                {/*                        paddingBottom: 4,*/}
                {/*                        borderRadius: 4,*/}
                {/*                        backgroundColor: '#f2f2f2',*/}
                {/*                    }}>*/}
                {/*                        <TiMinus*/}
                {/*                            size={13}*/}
                {/*                            style={{marginLeft: 15, cursor: quantity === 1 ? 'auto' : 'pointer'}}*/}
                {/*                            color={quantity === 1 ? 'grey' : 'black'} onClick={() => {*/}
                {/*                            if (quantity !== 1) setQuantity(quantity - 1)*/}
                {/*                        }}/>*/}
                {/*                        <div style={{flex: 1, textAlign: 'center', fontSize: '.9em'}}>{quantity}</div>*/}
                {/*                        <TiPlus*/}
                {/*                            size={13}*/}
                {/*                            style={{marginRight: 15, cursor: 'pointer'}}*/}
                {/*                            onClick={() => setQuantity(quantity + 1)}/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}


                {/*                <TiTrash size={25} style={{cursor: 'pointer'}}/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: 30, paddingRight: 20, width: '100%', marginTop: 50}}>*/}
                {/*        <div style={{fontFamily: 'Signika', color: 'grey', flex: 1}}>*/}
                {/*            TOTAL*/}
                {/*        </div>*/}

                {/*        <div style={{fontFamily: 'Signika', color: 'black'}}>*/}
                {/*            Rp209.000*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Col>*/}
            </Row>
        </Container>
    )
}
