import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/Navigation/NavigationBar";
import Login from "./Components/Autentication/Login";
import SignUp from "./Components/Autentication/SignUp";
import Logout from "./Components/Autentication/Logout";
import { useSelector } from "react-redux";
import ForgotPassword from "./Components/Autentication/ForgotPassword";
import { useEffect, useState } from "react";
import PasswordReset from "./Components/Autentication/PasswordReset";

import CreateNewGroup from "./Components/ChattingFeatures/CreateNewGroup";
import AllGroups from "./Components/ChattingFeatures/AllGroups";
import Group from "./Components/ChattingFeatures/Group";

function App() {
  const [openingPage, setOpeningPage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOpeningPage(false);
    }, 3000);
  }, []);

  return (
    <>
      :
      <div >
        <header>
          <NavigationBar></NavigationBar>
        </header>
        <main>
          <Routes>
            <Route
              path="autentication/forgotPassword"
              element={<ForgotPassword />}
            ></Route>
            <Route
              path="autentication/resetPassword/:id"
              element={<PasswordReset />}
            ></Route>
            <Route path="autentication/login" element={<Login />}></Route>
            <Route path="autentication/signUp" element={<SignUp />}></Route>
            <Route path="autentication/logout" element={<Logout />}></Route>
            <Route
              path="chat/fetchAllGroups"
              element={<AllGroups></AllGroups>}
            ></Route>
            <Route
              path="chat/createGroup"
              element={<CreateNewGroup></CreateNewGroup>}
            ></Route>
            <Route
              path="chat/fetchAllGroups/group/:groupId"
              element={<Group></Group>}
            ></Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
