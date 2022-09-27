import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Palette from "../Palette";
import {Link} from "react-router-dom";
import TextEllipsis from "react-text-ellipsis";
import {MdStoreMallDirectory} from "react-icons/md";
import Alert from "react-bootstrap/Alert";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {AiOutlineShopping} from "react-icons/ai";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Order from "../models/Order";
import CartManager from "../util/CartManager";
import {MdSend} from "react-icons/all";
import moment from "moment";
import Chat from "../models/Chat";

import defaultShopIcon from "../assets/images/shop_icon.jpeg"
import {FaStore} from "react-icons/fa";
import {HiChatAlt2} from "react-icons/hi";
import {IoMdChatbubbles} from "react-icons/io";
import {isMobile} from "react-device-detect";
import Spinner from "react-bootstrap/Spinner";

let refreshInterval

export default function ChatPage(props) {

    const chatRef = useRef(null);

    const [chatPartners, setChatPartners] = useState([])
    const [chatHistory, setChatHistory] = useState(null)

    const [selectedVendor, setSelectedVendor] = useState(null)
    const [message, setMessage] = useState("")
    const [isChatSelected, setIsChatSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const list = document.getElementById("chat");

        if (list) {
            list.scrollTop = list.offsetHeight;
        }

        if (selectedVendor) {
            getChatByVendorId()
        }

    }, [selectedVendor])

    useEffect(() => {
        getChatPartners()

        refreshInterval = setInterval(() => {
            console.log('Interval is working!')
            console.log('Interval number', refreshInterval)
            if (selectedVendor) {
                getChatByVendorId();
            }

        }, 5000);

        return () => {
            console.log('Before clear', refreshInterval)
            clearInterval(refreshInterval);
            console.log('Page has been changed!')
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem('user')) getChatPartners()
        else props.history.push('/')
    }, [])

    const getChatPartners = async () => {
        try {
            let chatModel = new Chat()
            let result = await chatModel.getChatPartners()
            console.log('asdasd', result)
            setChatPartners(result)
        } catch (e) {
            console.log('asdasd', e)
        }
    }

    const sendMessage = async () => {
        let chat = new Chat()
        let msg = message;
        setMessage("")

        try {
            let result = await chat.sendChat({
                vendor_id: selectedVendor.id,
                message: msg
            })

            getChatByVendorId(selectedVendor.id)

        } catch (e) {
            console.log(e)
        }
    }

    function truncate(input) {
        if (input.length > 80) {
            return input.substring(0, 80) + '...';
        }
        return input;
    }

    const getChatByVendorId = async () => {
        try {
            const model = new Chat();

            const result = await model.getChatFromVendor(selectedVendor.id);
            console.log('asdasd', result)
            setChatHistory(result)

            const list = document.getElementById("chat");

            if (list) {
                list.scrollTo(0, list.scrollHeight)
            }

            setIsLoading(false);


        } catch (e) {
            console.log('asdasd', e)
        }
    }

    if (chatPartners.length === 0) {
        return (
            <Container>
                <Row style={{
                    backgroundColor: 'white',
                    height: '50vh',
                    marginTop: 50,
                    display: 'flex',
                    alignItems: 'center'
                }}>

                    <Col style={{textAlign: 'center', fontFamily: 'Signika', fontSize: '1.2em'}}>
                        <IoMdChatbubbles size={50} style={{marginBottom: 10}} color={Palette.PRIMARY}/><br/>
                        Start chatting by going to<br/>vendor's store front
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container>

            <Row style={{backgroundColor: 'white', marginBottom: 30, marginTop: 50, height: '70vh'}}>

                {
                    !isChatSelected &&
                    <Col md={'6'} lg={'4'} style={{
                        height: '100%',
                        paddingTop: 20,
                        borderRight: '1px solid #ebebeb',
                        overflowY: 'scroll'
                    }}
                    >

                        {
                            chatPartners.map((obj, key) => {
                                // console.log(obj.latest_chat)
                                return <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginBottom: 30,
                                        backgroundColor: obj?.vendor?.id === selectedVendor?.id ? '#eaffee' : "white",
                                        padding: 10,
                                        borderRadius: 30,
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        setSelectedVendor(obj.vendor)
                                        if (isMobile) {
                                            setIsChatSelected(true)
                                        }
                                    }}
                                >
                                    <img
                                        src={obj.vendor?.logo_url ? obj.vendor?.logo_url : defaultShopIcon}
                                        style={{
                                            width: 55,
                                            height: 55,
                                            borderRadius: 35,
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.075)',
                                        }}/>

                                    <div style={{flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 5}}>
                                        <div style={{fontSize: '1.25em', color: '#4a4a4a'}}>{obj?.vendor?.name}</div>
                                        <div style={{
                                            fontSize: '.9em',
                                            color: 'grey',
                                            marginTop: 3,
                                        }}>
                                            {truncate(obj.message)}
                                        </div>
                                    </div>
                                    <div style={{color: '#b8b8b8'}}>
                                        {new moment(obj.latest_chat).format("DD MMM")}
                                    </div>
                                </div>
                            })
                        }

                    </Col>
                }


                <Col md={'6'} lg={'8'} style={{
                    display: 'flex', flexDirection: 'column',
                    overflowY: 'auto', height: "100%"
                }}>
                    {
                        selectedVendor === null ? null
                            :
                            isLoading ?
                                <Spinner style={{width: '4rem', height: '4rem', marginLeft: '47%', marginTop: '15%'}}
                                         animation="border" variant="danger"/> :
                                <>
                                    {
                                        isMobile ?
                                            <small
                                                onClick={() => {
                                                    setIsChatSelected(false);
                                                    setSelectedVendor(null)
                                                }}
                                                style={{paddingTop: 5}}

                                            >{'<   ' + 'back to chats'}</small> : null
                                    }
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        paddingTop: 15,
                                        paddingBottom: 30
                                    }}
                                    >
                                        <img
                                            src={selectedVendor.logo_url}
                                            style={{
                                                width: 55,
                                                height: 55,
                                                borderRadius: 35,
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.075)',
                                            }}/>

                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '1.1em',
                                            marginLeft: 15,
                                            marginTop: 10
                                        }}>
                                            {selectedVendor?.name}
                                        </div>
                                    </div>

                                    <div style={{flex: 1, overflowY: 'scroll'}}
                                         ref={chatRef} id={"chat"}
                                    >

                                        {
                                            chatHistory?.map((obj, key) => {
                                                if (obj.sender === "USER") {
                                                    return <>
                                                        <div style={{
                                                            width: '70%',
                                                            border: '1px solid #e3e3e3',
                                                            padding: 15,
                                                            borderRadius: 20,
                                                            marginTop: 15,
                                                            borderTopLeftRadius: 0,
                                                            display: 'flex',
                                                            flexDirection: 'row'
                                                        }}>
                                                            <div style={{flex: 1}}>
                                                                {obj.message}
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                fontSize: '.9em',
                                                                color: '#b8b8b8'
                                                            }}>
                                                                {new moment(obj.created_at).format("HH:mm")}
                                                            </div>
                                                        </div>
                                                    </>
                                                } else {
                                                    return <>
                                                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                            <div style={{
                                                                width: '70%',
                                                                backgroundColor: '#f3f4f6',
                                                                padding: 15,
                                                                borderRadius: 20,
                                                                borderBottomRightRadius: 0,
                                                                marginTop: 15,
                                                                display: 'flex',
                                                                flexDirection: 'row'
                                                            }}>
                                                                <div style={{flex: 1}}>
                                                                    {obj.message}
                                                                </div>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-end',
                                                                    fontSize: '.9em',
                                                                    color: '#b8b8b8'
                                                                }}>
                                                                    {new moment(obj.created_at).format("HH:mm")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }

                                            })
                                        }

                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
                                    >
                                        <div style={{
                                            border: '1.5px solid #e3e3e3',
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: 100,
                                            marginBottom: 10,
                                            marginTop: 20,
                                            flex: 1
                                        }}>
                                            <input
                                                onChange={(event) => {
                                                    setMessage(event.target.value)
                                                }}
                                                value={message}
                                                type={'text'} placeholder={'Tulis pesan'}
                                                style={{borderWidth: 0, width: "100%"}}/>
                                        </div>

                                        <div
                                            onClick={() => {
                                                chatRef.current.scrollIntoView({behavior: 'smooth'})
                                                sendMessage()
                                            }}
                                            style={{
                                                height: 40,
                                                width: 40,
                                                borderRadius: 20,
                                                backgroundColor: '#00af06',
                                                marginLeft: 6,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}>
                                            <MdSend color={'white'} size={23}/>
                                        </div>
                                    </div>
                                </>
                    }

                </Col>
            </Row>

        </Container>
    )
}
