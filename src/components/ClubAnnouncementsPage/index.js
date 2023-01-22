import React, { useState, useEffect } from "react";
import moment from "moment";
import { clubJoin } from "../../utils/api/calls/clubs";

export default function ClubAnnouncementsPage({
  user,
  setUser,
  club,
  setClub,
  hasPermissions,
  foundUser,
}) {
  const joinClub = async () => {
    const club1 = { ...club };

    club1.requests.push(user);
    setClub(club1);

    let response = await clubJoin(club._id, user._id);
    if (response.success) {
      club1.requests = response.club.requests;
      setClub(club1);
    }
  };

  return (
    <div className="announcements-div club-main">
      <aside>
        <div className="description">
          <h1>Description</h1>
          <p>{club.description}</p>
        </div>
        <div className="important-dates">
          <h1>Important Dates</h1>
          <div className="dates">
            {club.importantDates.map((date, i) => (
              <div className="date">
                <div className="date-container">
                  {moment(date.date).format("MM/DD/YY hh:mm a")}
                </div>
                <p>{date.name}</p>
              </div>
            ))}
          </div>

          {club.importantDates.length === 0 && (
            <p style={{ textAlign: "center" }}>No important dates yet</p>
          )}
        </div>

        {foundUser !== undefined || hasPermissions ? (
          <div className="filter left">
            <h1>Filter</h1>
            <p>Sort by Relevance</p>
            <select name="" id=""></select>
            <p>Sort by Tag</p>
            <select name="" id=""></select>
            <p>Sort by User</p>
            <select name="" id=""></select>
          </div>
        ) : (
          <div className="filter left join">
            <h1>
              {club.requests.indexOf(
                club.requests.find((u) => u._id == user._id)
              ) !== -1
                ? "Pending Join Request"
                : "Join"}
            </h1>
            <p>
              {club.requests.indexOf(
                club.requests.find((u) => u._id == user._id)
              ) !== -1
                ? "Your join request is pending"
                : "Interested in joining this club? Request to join the club by clicking the button below."}
            </p>
            {
              <button
                onClick={joinClub}
                disabled={
                  club.requests.indexOf(
                    club.requests.find((u) => u._id == user._id)
                  ) !== -1
                }
                className={
                  club.requests.indexOf(
                    club.requests.find((u) => u._id == user._id)
                  ) !== -1
                    ? "requested join-right-btn"
                    : "join-right-btn"
                }
              >
                {club.requests.indexOf(
                  club.requests.find((u) => u._id == user._id)
                ) !== -1
                  ? "Requested"
                  : "Join Club"}
              </button>
            }
          </div>
        )}
      </aside>
      <div className="announcements">
        {club.announcements.length === 0 ? (
          <h3 style={{ textAlign: "center", color: "#757575" }}>
            No announcements yet
          </h3>
        ) : null}
        {club.announcements.map((announcement, i) => {
          <div className="announcement">
            <div className="announcement-top">
              <div className="announcement-author">
                <img src="/assets/default.png" alt="" />
                <h3>
                  {announcement.user.firstName}{" "}
                  {announcement.user.lastName !== "" ? user.lastName : null}
                </h3>
              </div>
              <p>{moment(announcement.dateCreated).fromNow()}</p>
            </div>

            <div className="announcement-tags">
              {announcement.tags.map((tag, i) => {
                <div className="tag" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </div>;
              })}

              {announcement.dateReminder !== null && (
                <div className="date-container">
                  {announcement.dateReminder}
                </div>
              )}
            </div>
            <div className="announcement-body">
              <p>{announcement.message}</p>
            </div>
          </div>;
        })}
      </div>
      <div className="members">
        <h1>Members ({club.members.length})</h1>
        <div className="main-member-list">
          {club.members.map((member, i) => (
            <div className="member">
              <img src="/assets/default.png" alt="" />
              <p>
                {member.user.firstName}{" "}
                {member.user.lastName !== "" && member.user.lastName}
              </p>
            </div>
          ))}

          {club.members.length === 0 && (
            <h2
              style={{ textAlign: "center", fontWeight: 200, fontSize: "15px" }}
            >
              No members yet
            </h2>
          )}
        </div>
      </div>

      {foundUser !== undefined || hasPermissions ? (
        <div className="filter right fl-r" style={{ display: "none" }}>
          <h1>Filter</h1>
          <p>Sort by Relevance</p>
          <select name="" id=""></select>
          <p>Sort by Tag</p>
          <select name="" id=""></select>
          <p>Sort by User</p>
          <select name="" id=""></select>
        </div>
      ) : (
        <div className="filter right join fl-r" style={{ display: "none" }}>
          <h1>
            {club.requests.indexOf(
              club.requests.find((u) => u._id == user._id)
            ) !== -1
              ? "Pending Join Request"
              : "Join"}
          </h1>
          <p>
            {club.requests.indexOf(
              club.requests.find((u) => u._id == user._id)
            ) !== -1
              ? "Your join request is pending"
              : "Interested in joining this club? Request to join the club by clicking the button below."}
          </p>
          {
            <button
              onClick={joinClub}
              style={
                club.requests.indexOf(
                  club.requests.find((u) => u._id == user._id)
                ) !== -1
                  ? {
                      backgroundColor: "#757575",
                      cursor: "not-allowed",
                      color: "white",
                      border: "none",
                    }
                  : {}
              }
            >
              {club.requests.indexOf(
                club.requests.find((u) => u._id == user._id)
              ) !== -1
                ? "Requested"
                : "Join Club"}
            </button>
          }
        </div>
      )}

      {/* <div className="filter right" style={{ display: "none" }}>
        <h1>Filter</h1>
        <p>Sort by Relevance</p>
        <select name="" id=""></select>
        <p>Sort by Tag</p>
        <select name="" id=""></select>
        <p>Sort by User</p>
        <select name="" id=""></select>
      </div>

      <div className="filter right join" style={{ display: "none" }}>
        <h1>Join</h1>
        <p>
          Interested in joining this club? Request to join the club by clicking
          the button below.
        </p>
        <button>Join club</button>
      </div> */}
    </div>
  );
}
