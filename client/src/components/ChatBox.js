import { ChatState } from '../context/ChatProvider'
import SingleChat from "./SingleChat"
import {Box} from "@chakra-ui/react"

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChats} =ChatState();
  return (
   
    <Box display={{ base: selectedChats ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px" >

     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} ></SingleChat>
     
    </Box>
  )
}

export default ChatBox