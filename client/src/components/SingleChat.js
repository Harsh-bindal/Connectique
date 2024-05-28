import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import ProfileModal from './ProfileModal';
import {getSender,getSenderFull} from "./chatLogics"
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { ArrowBackIcon } from '@chakra-ui/icons';
import ScrollChat from './ScrollChat';
import axios from "axios"
import "./styles.css"
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json"


const ENDPOINT = "https://connectique.onrender.com";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

const[messages,setMessages]=useState([]);
const[newMessage,setNewMessage]=useState();
const [loading,setLoading]=useState(false);
const toast=useToast();


const {user,selectedChats,setSelectedChats,notification, setNotification } =ChatState();
const [socketConnected, setSocketConnected] = useState(false);
const [typing, setTyping] = useState(false);
const [istyping, setIsTyping] = useState(false);

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const fetchMessages = async () => {
  if (!selectedChats) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    setLoading(true);

    const { data } = await axios.get(
      `api/message/${selectedChats._id}`,
      config
    );
    setMessages(data);
    setLoading(false);

    
    socket.emit("join chat", selectedChats._id);

  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};


useEffect(() => {
  socket = io(ENDPOINT);
  socket.emit("setup", user);
  socket.on("connected", () => setSocketConnected(true));
  socket.on("typing", () => setIsTyping(true));
  socket.on("stop typing", () => setIsTyping(false));

}, []);

useEffect(()=>{
  fetchMessages();

  selectedChatCompare =selectedChats;
},[selectedChats]);


const sendMessage= async(event)=>{

  if(event.key==='Enter' && newMessage)
    {
      socket.emit("stop typing", selectedChats._id);
      try{

        const config={headers:{"Content-type":"application/json",Authorization:`Bearer ${user.token}`}};

        setNewMessage(""); 

        const {data}=await axios.post("api/message",{content:newMessage,chatId:selectedChats._id},config);

        socket.emit("new message", data);
        setMessages([...messages,data]);

      }

      catch(error)
      {
        toast({
          title: "Error Occured!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

    }

}


useEffect(() => {
  socket.on("message recieved", (newMessageRecieved) => {
    if (
      !selectedChatCompare || // if chat is not selected or doesn't match current chat
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      if (!notification.includes(newMessageRecieved)) {
        setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain);
      }
    } else {
      setMessages([...messages, newMessageRecieved]);
    }
  });
});


const typingHandler = (e)=>{
  setNewMessage(e.target.value);

  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChats._id);
  }
  let lastTypingTime = new Date().getTime();
  var timerLength = 3000;
  setTimeout(() => {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", selectedChats._id);
      setTyping(false);
    }
  }, timerLength);


}


  return (
    <>
     {selectedChats ?
      (<>
        <Text fontFamily="Work sans" display="flex" alignItems="center" justifyContent={{base:"space-between"}} w="100%" pb={3} px={2} fontSize={{base:"28px",md:"30px"}} >
          <IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChats("")} ></IconButton>
          {messages && !selectedChats.isGroupChat ? (<>{getSender(user,selectedChats.users)} <ProfileModal user={getSenderFull(user,selectedChats.users)} ></ProfileModal></>) 
          : (<>{selectedChats.chatName.toUpperCase()} <UpdateGroupChatModal  fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> </>)}
        </Text>

        <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hedden" > 
          {loading ? (<Spinner size="xl" w={20} h={20} alignItems="center" margin="auto" />) : (<div className='messages'> <ScrollChat messages={messages} /> </div>)}

          <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3} >

            {istyping ? (<div><Lottie options={defaultOptions} width={70}   style={{ marginBottom: 15, marginLeft: 0 }}></Lottie></div>) : (<></>)}
            <Input variant='filled' bg="#E0E0E0" placeholder='Enter a message....' value={newMessage} onChange={typingHandler} ></Input>
          </FormControl>
        </Box>
     </>)
     
     : 
     
     (<Box display="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans" >Click on a user to start chatting</Text>
     </Box>)}
    </>
  )
}

export default SingleChat