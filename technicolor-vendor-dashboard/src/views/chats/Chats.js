import {CCol, CRow} from "@coreui/react";
import React, {useRef, useState, useEffect} from "react";
import {MdSend} from "react-icons/md";
import Chat from "../../models/Chat";
import moment from "moment";

import placeholderPP from "../../assets/ic_user.png"

const Chats = () => {

  const chatRef = useRef(null);
  const [chatPartners, setChatPartners] = useState([])
  const [chatHistory, setChatHistory] = useState(null)

  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const list = document.getElementById("chat");

    if (list) {
      list.scrollTop = list.offsetHeight;
    }

    if(selectedUser){
      getChat()
    }

  }, [selectedUser])

  useEffect(() => {
    getChatPartners()
  }, [])

  function truncate(input) {
    if (input.length > 20) {
      return input.substring(0, 20) + '...';
    }
    return input;
  }

  const getChatPartners = async () => {
    try{
      let chatModel = new Chat()
      let result = await chatModel.getChatPartners()
      console.log(result)
      setChatPartners(result)
    }catch(e){
      console.log(e)
    }

  }

  const getChat = async () => {
    try{
      let chatModel = new Chat()
      let result = await chatModel.getChat(selectedUser.id)
      console.log(result)
      setChatHistory(result)

      const list = document.getElementById("chat");

      if (list) {
        list.scrollTo(0, list.scrollHeight)
      }



    }catch (e) {
      console.log(e)
    }

  }

  const sendMessage = async() =>{
    let chat = new Chat()
    let msg = message;
    setMessage("")

    try{
      let result = chat.sendChat({
        user_id : selectedUser.id,
        message : msg
      })

      getChat()

    }catch(e){
      console.log(e)
    }
  }


  return (
    <CRow style={{backgroundColor: 'white', marginBottom: 30}}>
      <CCol md={'6'} lg={'4'} style={{
        height: 'calc(100vh - 120px)',
        paddingTop: 20,
        borderRight: '1px solid #ebebeb',
        overflowY: 'scroll'
      }}
      >

        {
          chatPartners.map((obj, key) => {
            return <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 30,
                backgroundColor: obj?.user?.id === selectedUser?.id ? '#eaffee' : "white",
                padding: 10,
                borderRadius: 30,
                cursor: "pointer"
              }}
              onClick={() => {
                setSelectedUser(obj.user)
              }}
            >
              <img
                src={placeholderPP}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 35,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.075)',
                }}/>

              <div style={{flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 5}}>
                <div style={{fontSize: '1.25em', color: '#4a4a4a'}}>{obj?.user?.full_name}</div>
                <div style={{
                  fontSize: '.9em',
                  color: 'grey',
                  marginTop: 3,
                }}>
                  {truncate(obj.message)}
                </div>
              </div>
              <div style={{color: '#b8b8b8'}}>
                12 Des
              </div>
            </div>
          })
        }

      </CCol>

      <CCol md={'6'} lg={'8'} style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)',}}>
        {
          selectedUser === null ? null
            :
            <>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: 15,
                paddingBottom: 30
              }}
              >
                <img
                  src={placeholderPP}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 35,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.075)',
                  }}/>

                <div style={{fontWeight: '700', fontSize: '1.1em', marginLeft: 15, marginTop: 10}}>
                  {selectedUser?.full_name}
                </div>
              </div>

              <div style={{flex: 1, overflowY: 'scroll'}}
                   ref={chatRef}
                   id={"chat"}
              >

                {
                  chatHistory?.map((obj,key)=>{
                    if(obj.sender==="USER"){
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
                          <div style={{display: 'flex', alignItems: 'flex-end', fontSize: '.9em', color: '#b8b8b8'}}>
                            {new moment(obj.created_at).format('DD MMM YYYY, hh:mm')}
                          </div>
                        </div>
                      </>
                    }else{
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
                            <div style={{display: 'flex', alignItems: 'flex-end', fontSize: '.9em', color: '#b8b8b8'}}>
                              {new moment(obj.created_at).format('DD MMM YYYY, hh:mm')}
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
                    onChange={(event)=>{
                      setMessage(event.target.value)
                    }}
                    value={message}
                    type={'text'} placeholder={'Tulis pesan'} style={{borderWidth: 0, width : "100%"}}/>
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

      </CCol>
    </CRow>
  )
}

export default Chats
