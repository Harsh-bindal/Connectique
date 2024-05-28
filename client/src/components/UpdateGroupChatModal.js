import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
}from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';


const UpdateGroupChatModal = ({fetchMessages,fetchAgain, setFetchAgain }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const {user,selectedChats,setSelectedChats} =ChatState();

  const handleRemove= async(u)=>{

    if (selectedChats.isAdmin._id !== user._id && u._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try{
      setLoading(true);
      const config={headers:{Authorization:`Bearer ${user.token}`}};

      const {data}=await axios.put(`api/chat/removeFromGroup`,{chatId:selectedChats._id,userId:u._id},config);

      
      toast({
        title:"User remove",
        description: u._id===user._id ? "You have left the group chat. All new messages and updates will no longer be visible to you" :  `${u.name} is removed from group`,
        duration:9000,
        isClosable:true,
        status:'warning'
      });
      user._id===u._id ? setSelectedChats() : setSelectedChats(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);

    }
    catch(error){
      toast({
        title:"Error occured",
        description:error.message,
        duration:5000,
        isClosable:true,
        status:'error'
      })
      setLoading(false);
    }

  };

  const handleAddUser=async(u)=>{
    
    if (selectedChats.users.find((user1) => u._id === user1._id)) {
      toast({
        title: `${u.name} is Already in group!`,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if(selectedChats.isAdmin._id !== user._id){
      toast({
        title:"Connectique rules",
        description:'Only admins can add new user',
        duration:2500,
        isClosable:true,
        status:'warning'
      })
    }

      try{
        setLoading(true);
        const config={headers:{Authorization:`Bearer ${user.token}`}};
  
        const {data}=await axios.put(`api/chat/addGroup`,{chatId:selectedChats._id,userId:u._id},config);
  
        
        toast({
          title:"User Added",
          description: `${u.name} is added to group`,
          duration:5000,
          isClosable:true,
          status:'success'
        });
        
        setSelectedChats(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
  
      }

    catch(error){
      toast({
        title:"Error occured",
        description:error.message,
        duration:5000,
        isClosable:true,
        status:'error'
      })
      setLoading(false);
    }



   

  };

  const handleRename =async()=>{

    if(!groupChatName) return;

    try{
      setRenameLoading(true);

      const config={headers:{Authorization:`Bearer ${user.token}`}};

      const {data}=await axios.put("api/chat/renameGroup",{chatId:selectedChats._id, newGroupName:groupChatName},config);
      
      setSelectedChats(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

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
      setRenameLoading(false);
    }
    setGroupChatName("");
     
    
  };

  const handleSearch= async(query)=>{
    setSearch(query);
   
   console.log(query);

    try{
      
      setLoading(true);
      const config={headers:{Authorization:`Bearer ${user.token}`}};

      const {data}=await axios.get(`api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);

    }
    catch(error)
    {
      toast({
        title:"Error Occured",
        duration:5000,
        isClosable:true,
        status:"error",
        description:"Fail to load users",
        position:"bottom-left"
      })
      setLoading(false);
    }
  
  }



  return (
    <>
      <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>

      <Modal onClose={onClose} isOpen={isOpen} isCentered >
        <ModalOverlay/>
        <ModalContent>

          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
            {selectedChats.chatName}
          </ModalHeader>
          <ModalCloseButton/>

        <ModalBody display="flex" flexDirection="column" alignItems="center">
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChats.users.map((u)=>(<UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)} />))}
          </Box>
          <FormControl display="flex">
            <Input placeholder='ChatName' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}></Input>
            <Button colorScheme='teal' isLoading={renameloading} ml={1} onClick={handleRename } variant="solid">Update</Button>
          </FormControl>

          <FormControl>
            <Input placeholder='Add user to group' onChange={(e)=>handleSearch(e.target.value)}></Input>
          </FormControl>
    
          {loading ? (<Spinner size="lg"></Spinner>) : (searchResult?.map((user)=>(<UserListItem key={user._id}  user={user} handleFunction={()=>handleAddUser(user)} />)))}
      

        </ModalBody>

        <ModalFooter>
          <Button onClick={()=>handleRemove(user)} colorScheme='red'>Exit Group</Button>
        </ModalFooter>

        </ModalContent>
      </Modal>

    </>
  )
}

export default UpdateGroupChatModal