import React, { useEffect, useState } from "react";
import "./AllGroups.css";
import { NavLink, useNavigate } from "react-router-dom";
import image from "../images/wallpaper.jpg";
import { useSelector } from "react-redux";
const AllGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [noData,setNoData]=useState(false)


  useEffect(() => {
    if(localStorage.getItem('groups')){
      const groups=JSON.parse(localStorage.getItem('groups'))
            setGroups(groups)
            setNoData(true)
    }else{

    }
    fetch("http://localhost:5000/chat/fetchAllGroups", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === "success") {
         
            localStorage.setItem('groups',JSON.stringify(result.groups))
            setGroups(result.groups)
            setNoData(true)
         
         
        }
        else{

        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div
        className="back"
        style={{ backgroundImage: `url(../images/wallpaper.jpg)` }}
      >
        <div className="groups">
         {!noData ? <p>No Groups Found</p> : <p>Groups</p>}
        </div>
        {groups &&
          groups.map((group) => (
            <NavLink
              to={`group/:${group.id}`}
              style={{ textDecoration: "None" }}
            >
              <div className="group-boundary">
                <div className="group-icon">
                  <p>icon</p>
                </div>
                <div className="group-name">
                  <h4>{group.groupName}</h4>
                </div>
              </div>
            </NavLink>
          ))}
      </div>
    </>
  );
};

export default AllGroups;
