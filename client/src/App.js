import logo from "./logo.svg";
import "./App.css";
import { Route,Routes } from "react-router-dom";
import NavigationBar from "./Components/Navigation/NavigationBar";
import Login from "./Components/Autentication/Login";
import SignUp from "./Components/Autentication/SignUp";
import Logout from "./Components/Autentication/Logout";
import { useSelector } from "react-redux";
import ForgotPassword from "./Components/Autentication/ForgotPassword";
import { useEffect, useState } from "react";
import PasswordReset from "./Components/Autentication/PasswordReset";

function App() {
  const [openingPage,setOpeningPage]=useState(true)
 
  useEffect(()=>{
setTimeout(()=>{
setOpeningPage(false)
},3000)
  },[])
 
  
  return (
    <>

:
<>
<header>
        <NavigationBar></NavigationBar>
      </header>
      <main>
        <Routes>
        <Route path="autentication/forgotPassword" element={<ForgotPassword/>}></Route> 
        <Route path="autentication/resetPassword/:id" element={<PasswordReset/>}></Route>
          <Route path="autentication/login" element={<Login/>}></Route>
          <Route path="autentication/signUp" element={<SignUp/>}></Route>
          <Route path="autentication/logout" element={<Logout/>}></Route>
  </Routes>
      </main>
 
</>

    
    
   
    </>
  );
}

export default App;
