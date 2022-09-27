import TextEllipsis from "react-text-ellipsis";
import moment from "moment";
import Row from "react-bootstrap/Row";
import React, {useEffect, useState} from "react";
import Chat from "../models/Chat";
import {AiOutlineClose, MdSend} from "react-icons/all";

let refreshInterval

export default function ChatWidget(props) {

    const {vendor, show} = props

    const [message, setMessage] = useState("")
    const [chatHistory, setChatHistory] = useState([])

    const getChatByVendorId = async () => {

        try {
            const model = new Chat();

            const result = await model.getChatFromVendor(vendor.id);

            setChatHistory(result)

            const list = document.getElementById("chat");

            if (list) {
                list.scrollTo(0, list.scrollHeight)
            }


        } catch (e) {
            console.log(e)
        }


    }
    const sendMessage = async () => {
        let chat = new Chat()
        let msg = message;
        setMessage("")

        try {
            let result = await chat.sendChat({
                vendor_id: vendor.id,
                message: msg
            })

            console.log(result);

            await getChatByVendorId();

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (props.show) {
            console.log("getting chat")
            getChatByVendorId()
        } else {
            console.log("not getting chat")
        }
    }, [props.show])

    useEffect(() => {

        refreshInterval = setInterval(() => {
            console.log('Interval is working!')

            getChatByVendorId();

        }, 5000);

        return () => {
            console.log('Before clear', refreshInterval)
            clearInterval(refreshInterval);
            console.log('Page has been changed!')
        }
    }, [])

    return <>
        <Row style={{position: 'fixed', bottom: 60, right: 40, display: show ? 'block' : 'none'}}>
            <div style={{
                backgroundColor: '#FFFFFFF2',
                width: 350,
                paddingTop: 18,
                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
                borderRadius: 8
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginBottom: -10
                }}>
                    <TextEllipsis
                        lines={1}
                        tag={'p'}
                        ellipsisChars={'...'}
                        tagClass={'className'}
                        useJsOnly={true}
                        style={{
                            fontFamily: 'Open Sans', fontWeight: '700', fontSize: '.95em',
                            flex: 1

                        }}
                    >
                        {vendor.name}
                    </TextEllipsis>

                    <AiOutlineClose size={20} style={{marginTop: 3, cursor: 'pointer'}}
                                    onClick={() => props.hide(false)}/>
                </div>

                {/*<a href={'#'} style={{paddingLeft: 15, fontFamily: 'Open Sans', fontSize: '.8em'}}>*/}
                {/*    Kembali ke daftar chat*/}
                {/*</a>*/}

                <div style={{height: 2, backgroundColor: '#f2f2f2', marginTop: 15, marginBottom: 15}}/>

                <div style={{flex: 1, overflowY: 'scroll', height: 400}}
                     id={'chat'}
                >
                    {
                        chatHistory.map((obj, key) => {

                            console.log(obj)

                            if (obj.sender === "VENDOR") {
                                return <>
                                    <div style={{
                                        width: '80%',
                                        border: '1px solid #e3e3e3',
                                        padding: 15,
                                        borderRadius: 20,
                                        borderTopLeftRadius: 0,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginLeft: 15,
                                        marginTop: 15
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
                                return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <div style={{
                                        width: '80%',
                                        backgroundColor: '#f3f4f6',
                                        padding: 15,
                                        borderRadius: 20,
                                        borderTopRightRadius: 0,
                                        marginTop: 15,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginRight: 15
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
                            }


                        })
                    }
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10
                }}>
                    <div style={{
                        border: '1.5px solid #e3e3e3',
                        paddingLeft: 15,
                        paddingRight: 15,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 100,
                        flex: 1
                    }}>
                        <input
                            onChange={(event) => {
                                setMessage(event.target.value)
                            }}
                            type={'text'}
                            value={message}
                            placeholder={'Chat here...'}
                            style={{borderWidth: 0, outline: 'none', width: "100%"}}/>
                    </div>

                    <div
                        onClick={() => {
                            console.log('Submit clicked!');
                            sendMessage()
                            getChatByVendorId();
                        }}
                        style={{
                            height: 36,
                            width: 36,
                            borderRadius: 20,
                            backgroundColor: '#00af06',
                            marginLeft: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}>
                        <MdSend color={'white'} size={19}/>
                    </div>
                </div>
            </div>
        </Row>
    </>
}
