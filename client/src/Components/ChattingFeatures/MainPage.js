import React, { Profiler, useEffect, useState } from "react";
import "./MainPage.css";
import { useSelector } from "react-redux";
import { authActions } from "../Store/AuthStore";
const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetch("http://localhost:5000/chat/getParticipants")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProfiles(data.userData);
      });

    fetch("http://localhost:5000/chat/getMessages")
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
    const addMess = await fetch("http://localhost:5000/chat/addMessage", {
      method: "POST",
      body: JSON.stringify({ message: message, token: token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await fetch("http://localhost:5000/chat/getParticipants")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProfiles(data.userData);
      });

    await fetch("http://localhost:5000/chat/getMessages")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMessages(data.messages);
      });

    console.log(message);
  }

  const messageHandler = (e) => {
    setMessage(e.target.value);
  };

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="border">
          <div>
            <div className="messages">
              {messages &&
                messages.map((msg) => (
                    <div class="message other-message float-right" > 
                    {msg.message}
                  </div>
                ))}
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
        </div>
        <div className="participants">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>participants</h3>
          </div>

          <div className="profiles">
            <div className="profile">
              {profiles &&
                profiles.map((profile) => (
                  <div className="prof">
                    <p
                      className="p1"
                      style={{ backgroundColor: generateColor() }}
                    >
                      {profile.name[0]}
                    </p>
                    <p className="p2">{profile.name}</p>
                    {profile.status ? (
                      <p
                        className="p3"
                        style={
                          profile.status === true
                            ? { color: "#00FF09" }
                            : { color: "red" }
                        }
                      >
                        online
                      </p>
                    ) : (
                      <p
                        className="p3"
                        style={
                          profile.status === true
                            ? { color: "#00FF09" }
                            : { color: "red" }
                        }
                      >
                        offline
                      </p>
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

export default MainPage;
