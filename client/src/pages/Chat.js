import React, { useState } from 'react'
import Header from "../components/Header"
import { ChatState } from '../context/ChatProvider'
import {Box} from "@chakra-ui/layout"
import MyChats from "../components/MyChats"
import ChatBox from '../components/ChatBox'

const Chat = () => {
  
  const [fetchAgain,setFetchAgain]=useState();

  const {user} =ChatState();
  return (
    <div style={{width:"100%"}}>
     
      {user && <Header></Header>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
  )
}

export default Chat