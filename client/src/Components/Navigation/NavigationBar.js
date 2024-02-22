import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthStore";
import useRazorpay from "react-razorpay";

const NavigationBar = () => {
  const [Razorpay] = useRazorpay();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const login = useSelector((state) => state.auth.login);

  

  return (
    <>
      <nav>
        {!login && (
          <ul style={{ listStyleType: "None" }}>
            <div className="navigation">
              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="autentication/login"
                >
                  <div className="btn">Login</div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="autentication/signUp"
                >
                  <div className="btn">Sign Up</div>
                </NavLink>
              </li>
            </div>
          </ul>
        )}

        {login && (
          <div className="navi">
            <ul style={{ listStyleType: "None" }}>
              <div className="dropdown">
                <button className="dropbtn">
                  <div className="menu"></div>
                  <div className="menu"></div>
                  <div className="menu"></div>
                </button>
                <div className="dropdown-content">
                 
                  <li>
                    <NavLink
                      style={{ textDecoration: "None" }}
                      to="chat/mainPage"
                    >
                      <div className="btn">Group Chat</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      style={{ textDecoration: "None" }}
                      to="autentication/logout"
                    >
                      <div className="btn">Logout</div>
                    </NavLink>
                  </li>
                </div>
              </div>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;
