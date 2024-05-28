import React, { useState } from 'react'
import { useToast } from "@chakra-ui/toast";
import axios from "axios"
import { useHistory } from "react-router-dom";
import { ChatState } from '../../context/ChatProvider';

const Login = () => {

  const [email,setemail] =useState();
  const [password, setpassword] =useState();
  const [show,setshow] =useState(false);
  const [loading,setLoading] =useState(false);
  const toast = useToast();
  const history =useHistory();

  const handleclick = () => {setshow(!show)};
  const { setUser } = ChatState();
  
  const submitHandler = async ()=>{
    setLoading(true);
    if(!email || !password){
      toast({
        title:"please fill all the details",
        status: "warning",
        duration : 5000,
        isClosable :true,
        position : "bottom"
      })
      setLoading(false);
      return;
    }

    try{
      const config ={
        headers : {"Content-type": "application/json"},
      };
      const {data} =await axios.post("api/user/login",{email,password},config);
      console.log(data);
      
      toast({
        title:"Login Successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setUser(data);
    
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    }
     catch(error)
     {
      toast({
        title:"Error Occured",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setLoading(false);

     }

  }


  
  return (
    <div className="container">
      <div className="row py-2 mt-2 justify-content-center">
        <div className="col-lg-6 col-sm-8">
          <div className="form-group my-2">
            <label>Email Address</label>
            <input type={email} onChange={(e)=>setemail(e.target.value)} value={email}  required placeholder='xyz@email.com' className="form-control" />
          </div>
          <div className="form-group my-2">
            <label>Password</label>
            <div className="input-group">
            <input type={show ? "text" : "password"} value={password} onChange={(e)=>setpassword(e.target.value)} required placeholder="Password" className="form-control"/>
            <div className="input-group-append">
             <button className='btn btn-secondary' onClick={handleclick} >{show ? "hide" : "Show" }</button>
            </div>
            </div>
            
          </div>

         <button className="btn btn-success w-100 my-2" onClick={submitHandler}>{loading ?<div className="spinner-border text-muted"></div> : "LogIn"  }</button>
         <button className="btn btn-danger w-100 my-2" onClick={()=>{setemail("guestCredential@email.com"); setpassword("123456")}} >Guest credentials</button>
        </div>
      </div>
    </div>
  )
}

export default Login