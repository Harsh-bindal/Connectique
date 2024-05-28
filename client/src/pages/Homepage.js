import React, { useEffect } from 'react'
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import { useHistory } from 'react-router-dom';

const Homepage = () => {

  const history=useHistory();

  useEffect(()=>{
    
    const user=JSON.parse(localStorage.getItem("userInfo"));

    if(user) history.push("/chats");
    

  },[history])

  const refreshPag=()=>{
    window.location.reload(false);
  }

  return (
    <div className="container ">
      {refreshPag}
       <div className="row justify-content-center">
        <div className="col-lg-6 col-sm-8 p-3 mt-5 mb-5 rounded-pill fs-5 text-center" style={{backgroundColor:"#d49674"}}>Connectique</div>
       </div>
       <div className="row  justify-content-center">
        <div className="col-lg-6 col-sm-8">  
       <ul className="nav nav-pills nav-fill">
      <li className="nav-item ">
        <a className="nav-link active" data-toggle="tab"  href="#Login">LogIn</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" data-toggle="tab" href="#Signup">SignUp</a>
      </li>
    </ul>
        </div>
    <div className="tab-content">
      <div className="tab-pane fade show active" id="Login" >{<Login></Login>} </div>
      <div className="tab-pane fade" id="Signup">{<Signup></Signup>}</div>
    </div>

       </div>
    </div>
       
  )
}

export default Homepage