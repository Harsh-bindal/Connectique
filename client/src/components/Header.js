import React, {useState } from 'react'
import {ChatState} from "../context/ChatProvider"
import { Box, Text } from "@chakra-ui/layout";
import { useHistory } from 'react-router-dom';
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import NotificationBadge from "react-notification-badge";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { useToast } from "@chakra-ui/toast";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from './ProfileModal';
import { useDisclosure } from "@chakra-ui/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';
import ChatLoading from "../components/ChatLoading"
import UserListItem from "../components/UserListItem";
import { Effect } from "react-notification-badge";
import {getSender} from "./chatLogics"






const Header = () => {

  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState(false);
  const toast=useToast();
  const history=useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {user,chats,setChats,setSelectedChats,notification,setNotification,} = ChatState();

  const handleSearch = async ()=>{

  if(!search){
    toast({
      title:"Enter something to search section",
      status:"warning",
      duration:5000,
      isClosable:true,
      position:"top-left"
    })
    return;
  }

  try{
    setLoading(true);

    const config={
      headers:{
        Authorization: `Bearer ${user.token}`,
      },
    }
    const {data} =await axios.get(`api/user?search=${search}`,config);
    setLoading(false);
    setSearchResult(data);
  }
  catch(error)
  {
    toast({
      title:"error occured",
      description:"Failed to load search results",
      duration:5000,
      isClosable:true,
      position:"bottom-left",
      status:"error"
    
    })
  }

  }

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChats(data);
      setLoadingChat(false);
      onClose();
    
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  
  const logouthandler = ()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  return (
    <>
    <Box  display="flex" justifyContent="space-between" alignItems="center" backgroundColor="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
      
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} border="1px solid" >
            <i className="fa fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4} my={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>
      

      
      <Text fontSize="3xl" fontFamily="Work sans"  mt={4}><b><i>Connectique</i></b></Text>

     
      <div>
        <Menu>
         <MenuButton p={1}>
          <NotificationBadge count={notification.length} effect={Effect.SCALE} />
          <BellIcon fontSize="2xl" m={1}></BellIcon>
         </MenuButton>

         <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChats(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>

        </Menu>


         <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon/>}>
          <Avatar size='sm'cursor="pointer" src={user.profilePic} name={user.name}  />{' '}
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
            <MenuItem>Profile</MenuItem>{" "}
            </ProfileModal>
            <MenuDivider></MenuDivider>
            <MenuItem onClick={logouthandler} >Logout</MenuItem>
          </MenuList>
         </Menu>
      </div>
    </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
             <Input placeholder='Search by name or email' value={search} onChange={(e)=>setSearch(e.target.value)}></Input>
             <Button onClick={handleSearch}>Search</Button>
            </Box>
          
          {loading ? (<ChatLoading></ChatLoading>) : (searchResult?.map((user)=>(<UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}></UserListItem>)))}

         {loadingChat && <Spinner ml="auto" d="flex"></Spinner>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>



    </>
  )
}

export default Header