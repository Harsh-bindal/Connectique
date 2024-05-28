import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text,Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from './ChatLoading';
import {getSender} from "./chatLogics"
import GroupChatModal from "./GroupChatModal";


const MyChats = ({fetchAgain}) => {


 const{chats,setChats,user,selectedChats,setSelectedChats}=ChatState();
 const toast=useToast();
 const [loggedUser, setLoggedUser] = useState();

 const fetchChats = async()=>{

    try{
        const config ={
          headers: { Authorization:`Bearer ${user.token}` }
        }

        const {data} = await axios.get("api/chat",config);
        setChats(data);

    }catch(error){
        toast({
         title:"Error Occured",
         description:'Failed to fetch chats',
         status:"error",
         duration:5000,
         isClosable:true,
         position:"bottom-left"

        })
    }
 }
 useEffect(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    setLoggedUser(JSON.parse(userInfo));
  }
    fetchChats();
  }, [fetchAgain,user]);


  return (
    <Box borderRadius="lg"  borderWidth="1px" bg="white" p={3} flexDirection="column" alignItems="center" w={{base:"100%",md:"31%"}} display={{base:selectedChats?"none" : "flex",md:"flex"}}  >
        
        <Box pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" display="flex" w="100%"  justifyContent="space-between" alignItems="center">
        My Chats
    
        <GroupChatModal>
        <Button display="flex" rightIcon={<AddIcon/>} fontSize={{base:"17px",md:"10px",lg:"17px"}} >New group Chat</Button>
        </GroupChatModal>
        
        </Box>


        <Box display="flex" flexDirection="column" borderRadius="lg" w="100%" h="100%" bg="#F8F8F8" p={3} overflowY="hidden">
        {chats? (
            <Stack overflowY="scroll">{chats.map((chat)=>(
              <Box key={chat._id} cursor="pointer" onClick={()=>setSelectedChats(chat)} borderRadius="lg" px={3} py={2} color={selectedChats===chat ? "white" : "black"} bg={selectedChats===chat? "#38B2AC" : "#E8E8E8"}>
              <Text fontFamily="Work sans" >{!chat.isGroupChat ? getSender(loggedUser,chat.users) : chat.chatName }</Text>
              {chat.latestMessage && chat.latestMessage.sender &&  (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
        ))}</Stack>) : (<ChatLoading/>)}

    </Box>
        </Box>
  )
}

export default MyChats