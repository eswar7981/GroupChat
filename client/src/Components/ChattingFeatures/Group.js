import React, { useMemo } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";

import "./Group.css";
import io from "socket.io-client";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import e from "cors";

const Group = ({ id }) => {
  const socket = io("http://localhost:5000");
  const navigate = useNavigate();
  const params = useParams();

  const [admins, setAdmins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email);
  const [userName, setUserName] = useState([]);
  const [name, setName] = useState("");
  const [finalFile, setFinalFile] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(
    "initial" | "uploading" | "success" | "fail"
  );



  

  useEffect(() => {
    const details = {
      groupId: params.groupId[1],
      token: token,
    };
    socket.emit("getPartcipants", details.groupId);
    socket.on("recievePartcipants", (data) => {
      setProfiles(data);
      const user = data.filter((user) => user.emailAddress === email);
      setName(user[0].name);
      setUserName(user[0]);
    });

    socket.emit("getAdmins", details);
    socket.on("adminData", (data) => {
      setAdmins(data.split(","));
    });

    socket.emit("getMessage", details.groupId);
    socket.on("data", (mess) => {
      setMessages(mess);
      socket.emit("disconnection");
    });
  }, []);

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");
       socket.emit("image", file.toString("base64"));
      setFinalFile(null);
    }
  };

  async function sendMessageHandler(e) {
    e.preventDefault();

    const details = {
      groupId: params.groupId[1],
      message: message,
      token: token,
      sentBy: name,
    };

   socket.emit("sendMessage", details)

     socket.emit("getPartcipants", details.groupId);
    socket.on("recievePartcipants", (data) => {
      setProfiles(data);
    })
    setMessage("");


    setInterval(()=>{
      socket.emit("getMessage", params.groupId[1]);
      socket.on("data", (mess) => {
        setMessages(mess);
        socket.emit("disconnection");
      });
    },500)

  }


  

  const makeAsAdmin = (e, profile) => {
    e.preventDefault();
    if (profile.emailAddress === email) {
      alert("you cannot be admin by yourself");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/makeOrRemoveAsAdmin`, {
        method: "POST",
        body: JSON.stringify({
          groupId: params.groupId[1],
          id: profile.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setTimeout(() => {
            const details = {
              groupId: params.groupId[1],
              token: token,
            };
            socket.emit("getAdmins", details);
            socket.on("adminData", (data) => {
              setAdmins(data.split(","));
            });
            if (data.message === "removed as admin") {
              alert(`${profile.name} ${data.message}`);
            } else {
              alert(`${profile.name} ${data.message}`);
            }
          }, 500);
        });
    }
  };

  const removeUser = (e, profile) => {
    e.preventDefault();

    if (admins.includes(userName.id.toString())) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/removeUser`, {
        method: "POST",
        body: JSON.stringify({
          groupId: params.groupId[1],
          id: profile.id,
          userId: userName.id.toString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const details = {
            groupId: params.groupId[1],
            message: message,
            token: token,
            sentBy: name,
          };
          setTimeout(() => {
            socket.emit("getPartcipants", details.groupId);
            socket.on("recievePartcipants", (data) => {
         
              setProfiles(data);
            });
          }, 1000);

          alert(`${profile.name} is removed from group`);
        });
    } else {
      alert("you are not admin");
    }
  };

  const messageHandler = (e) => {
    setMessage(e.target.value);
  };

  const generateColor = useMemo(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  }, []);

  const backButtonHandler = (e) => {
    e.preventDefault();
 
    navigate("/chat/fetchAllGroups");
  };
  return (
    <div>
      <div className="backbutton">
        <button onClick={backButtonHandler}>⬅Back</button>
      </div>
      <div className="groupName">
        <p></p>
      </div>

      <div className="border">
        <div>
          <div className="messages">
            {messages &&
              messages.map((msg) => (
                <>
                  {name && name == msg.sentBy ? (
                    <>
                      {" "}
                      <div className="msgCol1">
                        {" "}
                        <div className="msg">{msg.message}</div>
                        <div className="sentBy1">
                          <p>-You</p>
                        </div>{" "}
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="msgCol">
                        <div className="msg">{msg.message}</div>
                        <div className="sentBy">
                          <p>-{msg.sentBy}</p>
                        </div>{" "}
                      </div>
                    </>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>

      <form onSubmit={sendMessageHandler}>
        <div className="messageCol">
          <div className="textbox">
            <div>
              <input
                type="text"
                required
                onChange={messageHandler}
                value={message}
              ></input>
            </div>
            <div className="input-group">
              <button className="submit12">⮞</button>
            </div>
          </div>
        </div>
      </form>

      

      <div style={{ display: "flex" }}>
        <div className="participants12">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>participants</h3>
          </div>

          <div className="profiles12">
            <div className="profile12">
              {profiles &&
                profiles.map((profile) => (
                  <div
                    className="prof12"
                    style={{ marginTop: "12px", height: "70px" }}
                  >
                    {profile.status ? (
                      <p
                        className="p12"
                        style={
                          profile.emailAddress === email
                            ? {
                                backgroundColor: "yellow",
                                borderColor: "green",
                              }
                            : {
                                backgroundColor: generateColor,
                                borderColor: "green",
                              }
                        }
                      >
                        {profile.name[0]}
                      </p>
                    ) : (
                      <p
                        className="p12"
                        style={{
                          backgroundColor: generateColor,
                          borderColor: "red",
                          color: "white",
                        }}
                      >
                        {" "}
                        {profile.name[0]}
                      </p>
                    )}

                    {profile.emailAddress == email ? (
                      <p className="p23">Me</p>
                    ) : (
                      <p className="p23">{profile.name}</p>
                    )}
                    {admins && admins.includes(profile.id.toString()) ? (
                      <button
                        className="admin"
                        onClick={(e) => makeAsAdmin(e, profile)}
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          marginTop: "20px",
                        }}
                      >
                        admin
                      </button>
                    ) : (
                      <button
                        className="admin"
                        onClick={(e) => makeAsAdmin(e, profile)}
                      >
                        admin
                      </button>
                    )}
                    {profile.emailAddress == email ? (
                      <></>
                    ) : (
                      <button
                        className="remove1"
                        onClick={(e) => removeUser(e, profile)}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
