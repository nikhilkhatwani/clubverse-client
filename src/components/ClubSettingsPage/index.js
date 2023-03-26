import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  clubEdit,
  clubLeave,
  clubDelete,
  clubTagNew,
  clubTagEdit,
  clubTagDelete,
} from "../../utils/api/calls/clubs";
import { useNavigate } from "react-router-dom";
import { userNotificationsManage } from "../../utils/api/calls/users";

export default function ClubSettingsPage({
  user,
  setUser,
  club,
  setClub,
  setSelected,
  hasPermissions,
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(club.name);
  const [description, setDescription] = useState(club.description);

  const [openNewTag, setOpenNewTag] = useState(false);
  const [openImportEvents, setOpenImportEvents] = useState(false);

  const [openEditTag, setOpenEditTag] = useState(false);
  const [openEditImportEvents, setOpenEditImportEvents] = useState(false);

  const [selectedTag, setSelectedTag] = useState(0);
  const [selectedImportEvent, setSelectedImportEvent] = useState(0);

  const [tagFormData, setTagFormData] = useState({
    name: "",
    color: "#000000",
  });

  const [importEventsFormData, setImportEventsFormData] = useState({
    name: "",
    date: "",
  });

  const [importEventsError, setImportEventsError] = useState("");
  const [tagError, setTagError] = useState("");

  const [notifications, setNotifications] = useState({
    announcements:
      user.notifications.find((n) => n.club === club._id)?.announcements ||
      false,
    attendanceUpdates:
      user.notifications.find((n) => n.club === club._id)?.attendanceUpdates ||
      false,
    duesUpdates:
      user.notifications.find((n) => n.club === club._id)?.duesUpdates || false,
    clubChanges:
      user.notifications.find((n) => n.club === club._id)?.clubChanges || false,
  });

  useEffect(() => {
    const update = async () => {
      const found = user.notifications.find((n) => n.club === club._id);
      if (found) {
        if (notifications.announcements !== found.announcements) {
          let notifications1 = [...user.notifications];
          notifications1[
            notifications1.indexOf(
              notifications1.find((n) => n.club == club._id)
            )
          ].announcements = notifications.announcements;
          setUser({ ...user, notifications: notifications1 });

          let response = await userNotificationsManage(
            notifications1[notifications1.indexOf(found)],
            user._id,
            club._id
          );
          if (response.success) {
            // console.log("Success");
          } else {
            // console.log("Error");
          }
        }

        if (notifications.attendanceUpdates !== found.attendanceUpdates) {
          let notifications1 = [...user.notifications];
          notifications1[
            notifications1.indexOf(
              notifications1.find((n) => n.club == club._id)
            )
          ].attendanceUpdates = notifications.attendanceUpdates;
          setUser({ ...user, notifications: notifications1 });

          let response = await userNotificationsManage(
            notifications1[notifications1.indexOf(found)],
            user._id,
            club._id
          );
          if (response.success) {
            // console.log("Success");
          } else {
            // console.log("Error");
          }
        }

        if (notifications.duesUpdates !== found.duesUpdates) {
          let notifications1 = [...user.notifications];
          notifications1[
            notifications1.indexOf(
              notifications1.find((n) => n.club == club._id)
            )
          ].duesUpdates = notifications.duesUpdates;
          setUser({ ...user, notifications: notifications1 });

          let response = await userNotificationsManage(
            notifications1[notifications1.indexOf(found)],
            user._id,
            club._id
          );
          if (response.success) {
            // console.log("Success");
          } else {
            // console.log("Error");
          }
        }

        if (notifications.clubChanges !== found.clubChanges) {
          let notifications1 = [...user.notifications];
          notifications1[
            notifications1.indexOf(
              notifications1.find((n) => n.club == club._id)
            )
          ].clubChanges = notifications.clubChanges;
          setUser({ ...user, notifications: notifications1 });

          let response = await userNotificationsManage(
            notifications1[notifications1.indexOf(found)],
            user._id,
            club._id
          );
          if (response.success) {
            // console.log("Success");
          } else {
            // console.log("Error");
          }
        }
      } else {
        let notifications1 = [...user.notifications];
        notifications1.push({
          club: club._id,
          announcements: notifications.announcements,
          attendanceUpdates: notifications.attendanceUpdates,
          duesUpdates: notifications.duesUpdates,
          clubChanges: notifications.clubChanges,
        });
        setUser({ ...user, notifications: notifications1 });

        let response = await userNotificationsManage(
          notifications1[notifications1.length - 1],
          user._id,
          club._id
        );
        if (response.success) {
          // console.log("Success");
        } else {
          // console.log("Error");
        }
      }
    };

    update();
  }, [notifications]);

  const onChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
  };

  const onSubmit = async (type) => {
    const club1 = { ...club };
    if (type === "name") {
      club1.name = name;
      setClub(club1);

      let response = await clubEdit(user._id, club._id, club1);
      if (response.success) {
        club1.name = response.club.name;
        setClub(club1);
      } else {
        setSelected(0);
      }
    } else if (type === "description") {
      club1.description = description;
      setClub(club1);

      let response = await clubEdit(user._id, club._id, club1);
      if (response.success) {
        club1.description = response.club.description;
        setClub(club1);
      } else {
        setSelected(0);
      }
    }
  };

  const onDeleteClub = async () => {
    let club1 = { ...club };
    const response = await clubDelete(club1._id, user._id);
    navigate(`/${user.school.link}`);
  };

  const onLeaveClub = async () => {
    let club1 = { ...club };
    const response = await clubLeave(club1._id, user._id);
    if (response.success) {
      navigate(`/${user.school.link}`);
    } else {
      navigate(`/${user.school.link}`);
    }
  };

  const createTag = async () => {
    const { name, color } = tagFormData;
    if (name === "") {
      setTagError("Please fill out all fields.");
      return;
    } else {
      let club1 = { ...club };
      setOpenNewTag(false);
      setTagFormData({
        name: "",
        color: "#000000",
      });
      setTagError("");
      club1.tags.push({
        club: club._id,
        name,
        color,
      });
      setClub(club1);
      let response = await clubTagNew(club._id, user._id, name, color);
      if (response.success) {
        club1.tags = response.club.tags;
        setClub(club1);
      } else {
        setSelected(0);
      }
    }
  };

  const editTag = async () => {
    const tagInd = selectedTag;
    const tagObj = club.tags[tagInd];
    let club1 = { ...club };
    const { name, color } = tagFormData;
    if (name === "") {
      setTagError("Please fill out all fields.");
      return;
    } else {
      club1.tags[tagInd].name = name;
      club1.tags[tagInd].color = color;
      setOpenEditTag(false);
      setSelectedTag(0);

      setTagFormData({
        name: "",
        color: "#000000",
      });
      setTagError("");
      setClub(club1);
      let response = await clubTagEdit(user._id, tagObj._id, name, color);
      if (response.success) {
        club1.tags[tagInd] = response.tag;
        setClub(club1);
      } else {
        setSelected(0);
      }
    }
  };

  const deleteTag = async () => {
    const tagInd = selectedTag;
    const tagObj = club.tags[tagInd];
    let club1 = { ...club };
    club1.tags.splice(tagInd, 1);
    setOpenEditTag(false);
    setSelectedTag(0);

    setTagFormData({
      name: "",
      color: "",
    });

    setTagError("");
    setClub(club1);

    let response = await clubTagDelete(user._id, tagObj._id);
    if (response.success) {
      club1.tags = response.club.tags;
      club1.announcements = response.club.announcements;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  const newEvent = async () => {
    const { name, date } = importEventsFormData;

    if (name === "" || date === "") {
      setImportEventsError("Please fill out all fields.");
      return;
    }

    let club1 = { ...club };
    club1.importantDates.push({
      date,
      name,
    });
    setClub(club1);
    setOpenImportEvents(false);
    setImportEventsFormData({
      name: "",
      date: "",
    });
    setImportEventsError("");

    let response = await clubEdit(user._id, club._id, club1);
    if (response.success) {
      club1.importantDates = response.club.importantDates;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  const editEvent = async () => {
    const eventInd = selectedImportEvent;
    let club1 = { ...club };
    const { name, date } = importEventsFormData;
    if (name === "" || date === "") {
      setImportEventsError("Please fill out all fields.");
      return;
    } else {
      club1.importantDates[eventInd].name = name;
      club1.importantDates[eventInd].date = date;
      setOpenEditImportEvents(false);
      setSelectedImportEvent(0);

      setImportEventsFormData({
        name: "",
        date: "",
      });
      setImportEventsError("");
      setClub(club1);
      let response = await clubEdit(user._id, club._id, club1);
      if (response.success) {
        club1.importantDates = response.club.importantDates;
        setClub(club1);
      } else {
        setSelected(0);
      }
    }
  };

  const deleteEvent = async () => {
    const eventInd = selectedImportEvent;
    let club1 = { ...club };
    club1.importantDates.splice(eventInd, 1);
    setOpenEditImportEvents(false);
    setSelectedImportEvent(0);

    setImportEventsFormData({
      name: "",
      date: "",
    });

    setClub(club1);
    let response = await clubEdit(user._id, club._id, club1);
    if (response.success) {
      club1.importantDates = response.club.importantDates;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  return (
    <div className="club-settings-page">
      {user.type === "sponsor" || user.type === "admin" ? (
        <>
          <section className="club-name">
            <h2>Club Name</h2>
            <p>This is the name of your club.</p>
            <input value={name} onChange={onChange} type="text" name="name" />
            <br />
            <button
              className={name === club.name ? "newTag disabled" : "newTag"}
              onClick={() => onSubmit("name")}
              disabled={name === club.name}
            >
              Save
            </button>
          </section>

          <section className="club-description">
            <h2>Club Description</h2>
            <p>This is the description of your club.</p>

            <textarea
              onChange={onChange}
              value={description}
              name="description"
              style={{ width: "587px", height: "133px", resize: "none" }}
            />

            <br />
            <button
              className={
                description === club.description ? "newTag disabled" : "newTag"
              }
              onClick={() => onSubmit("description")}
              disabled={description === club.description}
            >
              Save
            </button>
          </section>
        </>
      ) : null}
      {hasPermissions ? (
        <>
          <section className="important-events">
            <h2>Important Events</h2>
            <p>
              The following listed are events that show up to members on the
              main dashboard. The max amount of events that can be listed is 3.
            </p>
            <div className="tag-container">
              <div className="tags-left">
                {club.importantDates.length > 0 ? (
                  club.importantDates.map((event, index) => (
                    <>
                      <div className="date-container-settings">
                        {moment(event.date).format("MM/DD/YY h:mm a")}
                        <div
                          className="x"
                          onClick={() => {
                            setSelectedImportEvent(index);
                            setOpenEditImportEvents(true);
                            if (openImportEvents) setOpenImportEvents(false);
                            setImportEventsFormData({
                              name: event.name,
                              date: event.date,
                            });
                          }}
                        >
                          &#x22EE;
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: ".9em",
                          color: "var(--neutral)",
                          textAlign: "center",
                          paddingBottom: "10px",
                        }}
                      >
                        {event.name}
                      </span>
                    </>
                  ))
                ) : (
                  <span
                    style={{
                      fontSize: ".9em",
                      color: "var(--neutral)",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    No events
                  </span>
                )}
                <button
                  className={
                    club.importantDates.length === 3 && !openEditImportEvents
                      ? "newTag disabled"
                      : "newTag"
                  }
                  onClick={() => {
                    if (
                      club.importantDates.length === 3 &&
                      !openEditImportEvents
                    )
                      return;

                    if (openEditImportEvents) {
                      setOpenEditImportEvents(false);
                      setImportEventsFormData({
                        name: "",
                        date: "",
                      });
                    } else {
                      setOpenImportEvents(!openImportEvents);
                      setImportEventsFormData({
                        name: "",
                        date: "",
                      });
                    }
                  }}
                >
                  {openImportEvents || openEditImportEvents
                    ? "Close"
                    : club.importantDates.length === 3
                    ? "Max Events Created"
                    : "New Event"}
                </button>
              </div>
              {openImportEvents && !openEditImportEvents && (
                <div className="tags-right">
                  <h4>New Event </h4>
                  {importEventsError && (
                    <p className="error">{importEventsError}</p>
                  )}
                  <div className="x" onClick={() => setOpenImportEvents(false)}>
                    x
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={importEventsFormData.name}
                    onChange={(e) => {
                      setImportEventsFormData({
                        ...importEventsFormData,
                        name: e.target.value,
                      });
                    }}
                  />
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={importEventsFormData.date}
                    onChange={(e) => {
                      setImportEventsFormData({
                        ...importEventsFormData,
                        date: e.target.value,
                      });
                    }}
                  />
                  <button className="saveTag" onClick={newEvent}>
                    Save
                  </button>
                </div>
              )}
              {!openImportEvents && openEditImportEvents && (
                <div className="tags-right">
                  <h4>Edit Event </h4>
                  {importEventsError && (
                    <p className="error">{importEventsError}</p>
                  )}
                  <div
                    className="x"
                    onClick={() => {
                      setImportEventsFormData({
                        name: "",
                        date: "",
                      });
                      setOpenEditImportEvents(false);
                    }}
                  >
                    x
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={importEventsFormData.name}
                    onChange={(e) => {
                      setImportEventsFormData({
                        ...importEventsFormData,
                        name: e.target.value,
                      });
                    }}
                  />
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={moment(importEventsFormData.date).format(
                      "YYYY-MM-DDTkk:mm"
                    )}
                    onChange={(e) => {
                      setImportEventsFormData({
                        ...importEventsFormData,
                        date: e.target.value,
                      });
                    }}
                  />
                  <button className="saveTag" onClick={editEvent}>
                    Save
                  </button>
                  <button className="saveTag deleteTag" onClick={deleteEvent}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </section>
          <section className="message-tags">
            <h2>Message Tags</h2>
            <p>
              The following listed are tags that can be used with messages.
              Members can use these tags to filter out specific messages. By
              default, "Public" is a tag that when attached to a message, the
              message shows up for students that are not part of the club but
              are viewing the club.
            </p>
            <div className="tag-container">
              <div className="tags-left">
                {club.tags.length > 0 ? (
                  club.tags.map((tag, index) => (
                    <div
                      className="tag-settings"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                      <div
                        className="x"
                        onClick={() => {
                          setSelectedTag(index);
                          if (openNewTag) setOpenNewTag(false);
                          setOpenEditTag(true);
                          setTagFormData({
                            name: tag.name,
                            color: tag.color,
                          });
                        }}
                      >
                        &#x22EE;
                      </div>
                    </div>
                  ))
                ) : (
                  <span
                    style={{
                      fontSize: ".9em",
                      color: "var(--neutral)",
                      textAlign: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    No tags
                  </span>
                )}
                <button
                  className="newTag"
                  onClick={() => {
                    if (openEditTag) {
                      setOpenEditTag(false);
                      setTagFormData({ name: "", color: "" });
                    } else {
                      setTagFormData({ name: "", color: "" });
                      setOpenNewTag(!openNewTag);
                    }
                  }}
                >
                  {openNewTag || openEditTag ? "Close" : "New Tag"}
                </button>
              </div>

              {openNewTag && !openEditTag && (
                <div className="tags-right">
                  <h4>New Tag</h4>
                  {tagError && <p className="error">{tagError}</p>}
                  <div
                    className="x"
                    onClick={() => {
                      setOpenNewTag(false);
                    }}
                  >
                    x
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={tagFormData.name}
                    onChange={(e) => {
                      setTagFormData({
                        ...tagFormData,
                        name: e.target.value,
                      });
                    }}
                  />
                  <input
                    type="color"
                    name="color"
                    value={tagFormData.color}
                    onChange={(e) => {
                      setTagFormData({ ...tagFormData, color: e.target.value });
                    }}
                  />
                  <button className="saveTag" onClick={createTag}>
                    Save
                  </button>
                </div>
              )}
              {openEditTag && !openNewTag && (
                <div className="tags-right">
                  <h4>Edit Tag</h4>
                  {tagError && <p className="error">{tagError}</p>}
                  <div
                    className="x"
                    onClick={() => {
                      setOpenEditTag(false);
                      setTagFormData({ name: "", color: "" });
                    }}
                  >
                    x
                  </div>

                  {club.tags[selectedTag].default == true ? (
                    <div className="defaultTag">
                      <p>Default tags cannot be edited.</p>
                      <p>
                        This is a public tag. Non-members who are viewing
                        insights of this club will be able to see announcements
                        that have this tag attached.
                      </p>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={tagFormData.name}
                        onChange={(e) => {
                          setTagFormData({
                            ...tagFormData,
                            name: e.target.value,
                          });
                        }}
                      />
                      <input
                        type="color"
                        name="color"
                        value={tagFormData.color}
                        onChange={(e) => {
                          setTagFormData({
                            ...tagFormData,
                            color: e.target.value,
                          });
                        }}
                      />
                      <button className="saveTag" onClick={editTag}>
                        Save
                      </button>
                      <button className="saveTag deleteTag" onClick={deleteTag}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
      <section className="email-push-notifs">
        <h2>Email push notifications</h2>
        <p>
          For each of the following options, an email will be sent to your
          school email based on what is checked.
        </p>
        <div className="email-push-notifs-container">
          <input
            type="checkbox"
            value="Announcements"
            checked={notifications.announcements}
            onChange={(e) => {
              setNotifications({
                ...notifications,
                announcements: !notifications.announcements,
              });
            }}
          />
          <label for="announcements">Announcements</label>
        </div>
        <div className="email-push-notifs-container">
          <input
            type="checkbox"
            value="Attendance updates"
            checked={notifications.attendanceUpdates}
            onChange={(e) => {
              setNotifications({
                ...notifications,
                attendanceUpdates: !notifications.attendanceUpdates,
              });
            }}
          />
          <label for="css">Attendance updates</label>
        </div>
        <div className="email-push-notifs-container">
          <input
            type="checkbox"
            name="fav_language"
            value="Dues updates"
            checked={notifications.duesUpdates}
            onChange={(e) => {
              setNotifications({
                ...notifications,
                duesUpdates: !notifications.duesUpdates,
              });
            }}
          />
          <label for="javascript">Dues updates</label>
        </div>
        <div className="email-push-notifs-container">
          <input
            type="checkbox"
            name="fav_language"
            value="Club changes"
            checked={notifications.clubChanges}
            onChange={(e) => {
              setNotifications({
                ...notifications,
                clubChanges: !notifications.clubChanges,
              });
            }}
          />
          <label for="javascript">Club changes</label>
        </div>
      </section>
      <section className="leave-club">
        <h2>
          {user.type === "sponsor" || user.type === "admin"
            ? "Delete"
            : "Leave"}{" "}
          Club
        </h2>
        <p>
          {" "}
          {user.type === "sponsor"
            ? "By clicking the button below, you will delete this club and all of the information inside of it. This action cannot be undone."
            : "By clicking the button below, you will leave this club. You may request to rejoin this club at any time on the dashboard."}
        </p>
        <button
          onClick={
            user.type === "sponsor" || user.type === "admin"
              ? () => onDeleteClub()
              : () => onLeaveClub()
          }
          className="leave-button"
        >
          {user.type === "sponsor" || user.type === "admin"
            ? "Delete"
            : "Leave"}
        </button>
      </section>
    </div>
  );
}
