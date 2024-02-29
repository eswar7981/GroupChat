import React, { useEffect, useState } from "react";
import "./CreateNewGroup.css";
import { useSelector } from "react-redux";

const CreateNewGroup = () => {
  const [allParticipants, setAllParticipants] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetch("http://localhost:5000/chat/getParticipants", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          console.log(data.participants);
          setAllParticipants(data.participants);
        }
      });
  }, []);

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  const [groupParticipants, setGroupParticipants] = useState([]);
  const [groupName, setGroupName] = useState("");

  const makeAsAdmin = (e, profile) => {
    e.preventDefault();

    const addedAdmin = groupParticipants.map((user) => {
      console.log(user);
      if (user.name === profile.name) {
        if (user.admin === true) {
          user.admin = false;
        } else {
          user.admin = true;
        }

        return user;
      } else {
        return user;
      }
    });

    setGroupParticipants(addedAdmin);
  };

  const removeParticipant = (e, participant) => {
    e.preventDefault();

    const removedParticipants = groupParticipants.filter(
      (partic) => partic.name !== participant.name
    );
    setGroupParticipants([...removedParticipants]);
  };

  const addparticipantHandler = async (e, participant) => {
    e.preventDefault();

    const exist = groupParticipants.filter(
      (participant1) => participant.name === participant1.name
    );
    if (exist.length !== 0) {
      alert("participant already exists");
    } else {
      setGroupParticipants([...groupParticipants, participant]);
    }
  };

  const groupHandler = (e) => {
    e.preventDefault();
    var admins=''
    groupParticipants.map((partici) => {
      if (partici.admin) {
        admins=admins+`${partici.id}` + ","
      }
    });


    if (groupParticipants.length === 0) {
      alert("add atleast One participant");
    } else {
      const ids = groupParticipants.reduce((data, user) => {
        return (data = data + user.id + ",");
      }, "");

      fetch("http://localhost:5000/chat/createGroup", {
        method: "POST",
        body: JSON.stringify({
          name: groupName,
          participants: ids,
          token: token,
          admins:admins
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          if (result.status === "success") {
            alert(`${groupName} Group is created successfully`);
            fetch("http://localhost:5000/chat/getParticipants", {
              method: "GET",
              headers: {
                token: token,
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                if (data.status === "success") {
                  console.log(data.participants);
                  setAllParticipants(data.participants);
                }
              });
          } else {
            alert("Sorry, group creation is unsuccessful");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setGroupParticipants([]);
      setGroupName("");
      
    }
  };

  const groupNameHandler = (e) => {
    setGroupName(e.target.value);
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="group">
          <div className="border1">
            <div className="form1">
              <div className="labels">
                <label>Group Name</label>
              </div>
              <div className="inputss">
                <input
                  type="text"
                  value={groupName}
                  onChange={groupNameHandler}
                ></input>
              </div>
            </div>
            <div className="form2">
              <div className="labels">
                <label>Add a participant</label>
              </div>
              <div className="inputss">
                <div className="dropdown1">
                  <button className="addparticipant">+</button>
                  <div className="dropdown-content1">
                    {allParticipants &&
                      allParticipants.map((participant) => (
                        <div
                          className="list-item"
                          style={{
                            display: "flex",
                            backgroundColor: "grey",
                            margin: "5px 5px",
                            borderRadius: "20px",
                            color: "white",
                          }}
                        >
                          <li style={{ fontWeight: "700px" }}>
                            {participant.name}
                          </li>
                          <div className="add">
                            <button
                              onClick={(e) =>
                                addparticipantHandler(e, participant)
                              }
                            >
                              <p>Add+</p>
                            </button>
                          </div>
                        </div>
                      ))}
                    <div className="create">
                      <button onClick={groupHandler}>Create Group</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="groupParticipants1">
          <div className="participants1">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>participants</h3>
            </div>

            <div className="profiles1">
              <div className="profile1">
                {groupParticipants &&
                  groupParticipants.map((profile) => (
                    <div className="prof1">
                      <p
                        className="p1"
                        style={{ backgroundColor: generateColor() }}
                      >
                        {profile.name[0]}
                      </p>
                      <p className="p2">{profile.name}</p>
                      <button
                        onClick={(e) => removeParticipant(e, profile)}
                        className="remove"
                      >
                        remove
                      </button>
                      <button
                        className="adminbutton"
                        style={
                          profile.admin
                            ? { backgroundColor: "#28BB00" }
                            : { backdroundColor: "white" }
                        }
                        onClick={(e) => makeAsAdmin(e, profile)}
                      >
                        admin
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewGroup;
