import {createContext,useContext,useState,useEffect} from 'react'
import {useHistory} from "react-router-dom";

const ChatContext=createContext();

const ChatProvider = ({children}) => {

 const [user,setUser] = useState();
 const[chats,setChats] =useState([]);
 const[selectedChats,setSelectedChats]=useState();
 const [notification, setNotification ]=useState([]);

 const history=useHistory();

 useEffect(()=>{

    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if(!userInfo) history.push("/");

 },[history])


  return (
     <ChatContext.Provider value={{user,setUser,chats,setChats,selectedChats,setSelectedChats,notification, setNotification }}>{children}</ChatContext.Provider>
  )
};

export const ChatState=()=>{
    return useContext(ChatContext);
}

export default ChatProvider;
