import React, { useState } from 'react'
import { useToast } from "@chakra-ui/toast";
import axios from "axios"
import { useHistory } from "react-router-dom";

const Signup = () => {

  const [name,setname] =useState();
  const [email,setemail] =useState();
  const [password, setpassword] =useState();
  const [confirmpassword,setconfirmpassword]=useState();
  const [show,setshow] =useState(false);
  const [pic,setPic]=useState();
  const [picLoading,setPicLoading]=useState(false);
  const handleclick = () => {setshow(!show)};
  const toast=useToast();
  const history = useHistory();

  const submitHandler = async ()=>{
    setPicLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title:"Please fill all the details",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setPicLoading(false);
      return;
    }
    if(password !== confirmpassword){
      toast({
        title:"Password not match",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:"bottom"
      });
      setPicLoading(false);
      return;
    }
    console.log(name,email,password,pic);
   
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          profilePic:pic,
        },config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      window.location.reload();
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }

  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "connectique");
      data.append("cloud_name", "dqdp7sxsi");
      fetch("https://api.cloudinary.com/v1_1/dqdp7sxsi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Error occured",
            description:err.message,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an jpeg/png Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="container ">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-sm-8">
      <div className="form-group my-2">
        <label>Name</label>
        <input type="text" onChange={(e)=>setname(e.target.value)} required placeholder='Enter your Name' className='form-control' ></input>
      </div>
      <div className="form-group my-2">
        <label>Email</label>
        <input type="email" onChange={(e)=>setemail(e.target.value)}  required placeholder='xyz@email.com' className="form-control" />
      </div>
      <div className="form-group mt-2">
        <label>Password</label>
        <div className="input-group">
        <input type={show ? "text" : "password"} onChange={(e)=>setpassword(e.target.value)}  className="form-control" />
         <div className="input-group-append">
          <button className='btn btn-secondary' onClick={handleclick} >{show ? "Hide" : "Show"}</button>
         </div>
        </div>
      </div>
      <small>Password should be atleast 6 characters</small>
      <div className="form-group my-2">
        <label>Confirm-password</label>
        <div className="input-group">
        <input type={show ? "text" : "password"} onChange={(e)=>setconfirmpassword(e.target.value)}  className="form-control" />
        <div className="input-group-append">
          <button className="btn btn-secondary" onClick={handleclick} >{show ? "Hide" :"show" }</button>
        </div>
        </div>
      </div>
      <div className="form-group my-2">
        <label>Profile pic</label>
        <input type="file" className="form-control" accept='image/*' onChange={(e)=> postDetails(e.target.files[0])}  />
      </div>

      <button className="btn btn-success w-100 my-2"  onClick={submitHandler}>{picLoading ?<div className="spinner-border text-muted"></div> : "SignUp"  }</button>
        </div>
      </div>
    </div>
  )
}

export default Signup