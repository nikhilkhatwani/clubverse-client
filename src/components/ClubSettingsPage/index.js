import React, { useState, useEffect } from "react";
import { clubEdit } from "../../utils/api/calls/clubs";

export default function ClubSettingsPage({
  user,
  setUser,
  club,
  setClub,
  setSelected,
  hasPermissions,
}) {
  const [name, setName] = useState(club.name);
  const [description, setDescription] = useState(club.description);

  const [openNewTag, setOpenNewTag] = useState(false);
  const [openImportEvents, setOpenImportEvents] = useState(false);

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
                <div className="date-container-settings">
                  01/01/23 8:00
                  <div className="x">x</div>
                </div>
                <span
                  style={{
                    fontSize: ".9em",
                    color: "var(--neutral)",
                    textAlign: "center",
                    paddingBottom: "10px",
                  }}
                >
                  Regionals
                </span>
                <div className="date-container-settings">
                  01/01/23 8:00<div className="x">x</div>
                </div>
                <span
                  style={{
                    fontSize: ".9em",
                    color: "var(--neutral)",
                    textAlign: "center",
                    paddingBottom: "10px",
                  }}
                >
                  State
                </span>
                <button className="newTag">New Tag</button>
              </div>
              <div className="tags-right">
                <h4>New Event </h4>
                <div className="x">x</div>
                <input type="text" placeholder="Name" name="name" />
                <input type="datetime-local" name="datetime" />
                <button className="saveTag">Save</button>
              </div>
            </div>
          </section>
          <section className="message-tags">
            <h2>Message Tags</h2>
            <p>
              The following listed are tags that can be used with messages.
              Members can use these tags to filter out specific messages. By
              default, "Public" is a tag that when attached to a message, the
              message shows up for students that are not part of the club that
              are viewing the club.
            </p>
            <div className="tag-container">
              <div className="tags-left">
                <div
                  className="tag-settings"
                  style={{ backgroundColor: "#CB4F4F" }}
                >
                  Public
                </div>
                <div
                  className="tag-settings"
                  style={{ backgroundColor: "#E49191" }}
                >
                  Event
                  <div className="x">x</div>
                </div>
                <div
                  className="tag-settings"
                  style={{ backgroundColor: "#6EAD78" }}
                >
                  Important<div className="x">x</div>
                </div>
                <button className="newTag">New Tag</button>
              </div>
              <div className="tags-right">
                <h4>New Tag</h4>
                <div className="x">x</div>
                <input type="text" placeholder="Name" name="name" />
                <input type="color" name="color" />
                <button className="saveTag">Save</button>
              </div>
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
          <input type="checkbox" value="Announcements" />
          <label for="announcements">Announcements</label>
        </div>
        <div className="email-push-notifs-container">
          <input type="checkbox" value="Attendance updates" />
          <label for="css">Attendance updates</label>
        </div>
        <div className="email-push-notifs-container">
          <input type="checkbox" name="fav_language" value="Dues updates" />
          <label for="javascript">Dues updates</label>
        </div>
        <div className="email-push-notifs-container">
          <input type="checkbox" name="fav_language" value="Club changes" />
          <label for="javascript">Club changes</label>
        </div>
      </section>
      <section className="leave-club">
        <h2>Leave Club</h2>
        <p>
          By clicking the button below, you will leave this club. You may
          request to rejoin this club at any time on the dashboard.
        </p>
        <button className="leave-button">Leave</button>
      </section>
    </div>
  );
}
