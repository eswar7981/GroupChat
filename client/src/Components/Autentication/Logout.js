import React from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import './Logout.css'
import { useDispatch } from 'react-redux'
import { authActions } from '../Store/AuthStore'

import { useSelector } from 'react-redux'

const Logout = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  async function submitHandler(e){
    e.preventDefault()
    const res=await fetch(`${process.env.REACT_APP_BACKEND_URL}/autentication/logout`,{
      method:"POST",
      body:JSON.stringify({token:token}),
      headers:{
        'Content-Type':"application/json"
      }
    }).then(()=>{
      dispatch(authActions.setLogin())
      navigate('/autentication/login')
    })

  }

  return (
    <div style={{ display: "grid", justifyContent: "center" }}>
    <form onSubmit={submitHandler}>
      <div
        className="title"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h3>LogOut</h3>
      </div>
      <div className="formBoundary">
        <div className="form">
          <div className="labels">
            <label>Are you Sure</label>
          </div>
        </div>
        <div className="logoutbutton">
          <button type="submit">LogOut</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>

        </div>
      </div>
    </form>
  </div>
  )
}

export default Logout
