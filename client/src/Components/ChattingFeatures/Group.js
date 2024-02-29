import React, { useMemo } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";

import "./Group.css";

import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import e from "cors";

const Group = ({ id }) => {
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
  useEffect(() => {
    fetch("http://localhost:5000/chat/getParticipants", {
      method: "POST",
      body: JSON.stringify({ groupId: params.groupId[1] }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProfiles(data.users);
        const me = data.users.filter((user) => user.emailAddress === email);
        setUserName(me);

        setName(me[0].name);
        const admins = JSON.parse(`[${data.admin}]`);
        setAdmins(admins);
      });

    fetch("http://localhost:5000/chat/getMessages", {
      method: "POST",
      body: JSON.stringify({
        groupId: params.groupId[1],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMessages(data.messages);
        setMessage("");
      });
  }, []);

  async function sendMessageHandler(e) {
    e.preventDefault();
    console.log("hello message is sent");
    const addMess = await fetch("http://localhost:5000/chat/addMessage", {
      method: "POST",
      body: JSON.stringify({
        groupId: params.groupId[1],
        message: message,
        token: token,
        sentBy: name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setMessage("");
    });

    fetch("http://localhost:5000/chat/getParticipants", {
      method: "POST",
      body: JSON.stringify({
        groupId: params.groupId[1],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProfiles(data.userData);
      });

    fetch("http://localhost:5000/chat/getMessages", {
      method: "POST",
      body: JSON.stringify({
        groupId: params.groupId[1],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMessages(data.messages);
        setMessage("");
      });
  }

  const makeAsAdmin = (e, profile) => {
    e.preventDefault();
    if (profile.email === email) {
      alert("you cannot be admin by yourself");
    } else {
      fetch("http://localhost:5000/chat/makeOrRemoveAsAdmin", {
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
          if (data.message === "removed as admin") {
            alert(`${profile.name} ${data.message}`);
          } else {
            alert(`${profile.name} ${data.message}`);
          }
        });
    }
  };

  const removeUser = (e, profile) => {
    e.preventDefault();
    if (admins.includes(userName[0].id)) {
      fetch("http://localhost:5000/chat/removeUser", {
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
    console.log(params.groupId[1]);
    navigate("/chat/fetchAllGroups");
  };
  return (
    <>
      <div className="backbutton">
        <button onClick={backButtonHandler}>⬅Back</button>
      </div>
      <div></div>

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
            <div className="icon">
              <button type="submit">⮞</button>
            </div>
          </div>
        </div>
      </form>
      <div style={{ display: "flex" }}>
        <div className="participants12">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>participants</h3>
          </div>

          <div className="profiles1">
            <div className="profile1">
              {profiles &&
                profiles.map((profile) => (
                  <div className="prof1">
                    {profile.status ? (
                      <p
                        className="p1"
                        style={{
                          backgroundColor: generateColor,
                          borderColor: "green",
                          color: "white",
                        }}
                      >
                        {profile.name[0]}
                      </p>
                    ) : (
                      <p
                        className="p1"
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
                      <p className="p2">Me</p>
                    ) : (
                      <p className="p2">{profile.name}</p>
                    )}
                    {admins.includes(profile.id) ? (
                      <button
                        className="admin"
                        onClick={(e) => makeAsAdmin(e, profile)}
                        style={{ backgroundColor: "green", color: "white" }}
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
    </>
  );
};

export default Group;
