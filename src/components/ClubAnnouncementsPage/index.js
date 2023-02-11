import React, { useState, useEffect, useDeferredValue } from "react";
import moment from "moment";
import { clubAnnouncementNew, clubJoin } from "../../utils/api/calls/clubs";
import { imageUpload } from "../../utils/api/imageUpload";
import Loading from "../Loading";
import { uploadFile } from "../../utils/api/calls/files";

export default function ClubAnnouncementsPage({
  user,
  setUser,
  club,
  setClub,
  hasPermissions,
  foundUser,
}) {
  const [newAnnouncement, setNewAnnouncement] = useState({
    message: "",
    images: [],
    tags: [],
    files: [],
    files: [],
    dateReminder: null,
  });
  const [newAnnouncementError, setNewAnnouncementError] = useState("");

  const [filterData, setFilterData] = useState({
    relevance: 0,
    tag: -1,
    user: -1,
  });

  const [openSelect, setOpenSelect] = useState(false);
  const [openTagAdd, setOpenTagAdd] = useState(false);
  const [openDateAdd, setOpenDateAdd] = useState(false);
  const [selectedTag, setSelectedTag] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

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

  const onChange = (e, type) => {
    if (type === "announcementText") {
      setNewAnnouncement({ ...newAnnouncement, message: e.target.value });
    }
  };

  const sendAnnouncement = async () => {
    let { message, images, tags, files, dateReminder } = newAnnouncement;

    if (message.length === 0) {
      setNewAnnouncementError("Announcement text cannot be empty");
      return;
    }

    let club1 = { ...club };
    let announcement = {
      message,
      images,
      tags,
      files,
      dateReminder,
      user,
      createdAt: new Date().toISOString(),
      club,
    };

    club1.announcements.push(announcement);
    setClub(club1);

    setNewAnnouncement({
      message: "",
      images: [],
      tags: [],
      files: [],
      dateReminder: null,
    });

    setSelectedTag("0");
    setSelectedDate("");

    setOpenSelect(false);
    setOpenTagAdd(false);
    setOpenDateAdd(false);

    let response = await clubAnnouncementNew(club._id, user._id, announcement);

    if (response.success) {
      club1.announcements = response.club.announcements;
      setClub(club1);
    } else {
      setNewAnnouncementError(response.message);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    setImageLoading(true);

    await imageUpload(files).then(async (images) => {
      setNewAnnouncement({
        ...newAnnouncement,
        images: newAnnouncement.images.concat(images),
      });
      setImageLoading(false);
    });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    setFileLoading(true);

    const firstFile = files[0];

    const readFileContent = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    };

    let fileContent = await readFileContent(firstFile);
    let replace = fileContent.replace(
      ["data:" + firstFile.type + ";base64,"],
      [""]
    );

    let file = {
      name: firstFile.name,
      type: firstFile.type,
      size: firstFile.size,
      content: replace,
    };

    let response = await uploadFile(file);
    setFileLoading(false);
    if (response.success) {
      const newFile = {
        name: response.name,
        size: response.size,
        url: response.link,
      };
      console.log(newFile);
      setNewAnnouncement({
        ...newAnnouncement,
        files: newAnnouncement.files.concat(newFile),
      });
    } else {
      console.log(response.message);
    }
  };

  const timeFromNow = (date) => {
    let fixedDate = date.replace("T", " ");
    let now = new Date();
    let time = new Date(fixedDate);
    let diff = now - time;
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (seconds < 30) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds} ${seconds == 1 ? "second" : "seconds"} ago`;
    }

    if (minutes < 60) {
      return `${minutes} ${minutes == 1 ? "minute" : "minutes"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours == 1 ? "hour" : "hours"} ago`;
    }

    if (days < 7) {
      return `${days} ${days == 1 ? "day" : "days"} ago`;
    }

    return moment(date).format("MM/DD/YY hh:mm a");
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
              <div className="date" key={i}>
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
            <div className="filter-container">
              <p>Sort by Relevance</p>
              <select
                value={filterData.relevance}
                onChange={(e) => {
                  setFilterData({ ...filterData, relevance: e.target.value });
                  setClub(club);
                }}
              >
                <option value="0">Newest to Oldest (default)</option>
                <option value="1">Oldest to Newest</option>
              </select>
            </div>
            <div className="filter-container">
              <p>Sort by Tag</p>
              <select
                value={filterData.tag}
                style={
                  club.tags[filterData.tag]
                    ? {
                        color: club.tags[filterData.tag]?.color,
                        border: `1px solid ${club.tags[filterData.tag]?.color}`,
                      }
                    : {}
                }
                onChange={(e) => {
                  console.log(e.target.value);
                  setFilterData({ ...filterData, tag: e.target.value });
                  setClub(club);
                }}
              >
                <option style={{ color: "var(--primary-color)" }} value="-1">
                  No Tag (default)
                </option>
                {club.tags.map((tag, i) => (
                  <option value={i} key={i} style={{ color: tag.color }}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-container">
              <p>Sort by User</p>
              <select
                value={filterData.user}
                onChange={(e) => {
                  setFilterData({ ...filterData, user: e.target.value });
                  setClub(club);
                }}
              >
                <option value="-1">No User (default)</option>
                {club.sponsors
                  .concat(club.members.filter((m) => m.role == "officer"))
                  .map((m, i) => (
                    <option value={m.user ? m.user._id : m._id} key={i}>
                      {m.user
                        ? m.user.firstName + " " + m.user.lastName
                        : m.firstName + " " + m.lastName}
                    </option>
                  ))}
              </select>
            </div>
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
        {hasPermissions && (
          <div className="announcement">
            <div className="announcement-top">
              <div className="announcement-author">
                <img src={user.profilePic} alt="" />
                <h3>
                  {user.firstName} {user.lastName !== "" ? user.lastName : null}
                </h3>
              </div>
            </div>
            <div className="announcement-tags">
              {newAnnouncement.tags.map((tag, i) => (
                <div
                  className="tag-settings"
                  style={{ backgroundColor: tag.color }}
                  key={i}
                >
                  {tag.name}
                  <div
                    className="x"
                    onClick={() => {
                      let newAnnouncement1 = { ...newAnnouncement };
                      newAnnouncement1.tags.splice(i, 1);
                      setNewAnnouncement(newAnnouncement1);
                    }}
                  >
                    x
                  </div>
                </div>
              ))}
              {newAnnouncement.dateReminder !== null &&
              newAnnouncement.dateReminder !== undefined ? (
                <div className="date-container-settings">
                  {moment(newAnnouncement.dateReminder).format(
                    "MM/DD/YY h:mm a"
                  )}
                  <div
                    className="x"
                    onClick={() => {
                      let newAnnouncement1 = { ...newAnnouncement };
                      newAnnouncement1.dateReminder = null;
                      setNewAnnouncement(newAnnouncement1);
                    }}
                  >
                    x
                  </div>
                </div>
              ) : null}
              <div
                className="add-tag"
                onClick={() => {
                  setOpenSelect(!openSelect);
                  setOpenTagAdd(false);
                  setOpenDateAdd(false);
                  setSelectedTag("0");
                  setSelectedDate("");
                }}
              >
                {openTagAdd || openDateAdd || openSelect ? "x" : "+"}
              </div>

              {openSelect && (
                <div className="tag-choose">
                  <button
                    onClick={() => {
                      setOpenTagAdd(!openTagAdd);
                      setOpenSelect(!openSelect);
                    }}
                  >
                    Add New Tag
                  </button>

                  <button
                    onClick={() => {
                      setOpenDateAdd(!openDateAdd);
                      setOpenSelect(!openSelect);
                      if (newAnnouncement.dateReminder !== null) {
                        setSelectedDate(newAnnouncement.dateReminder);
                      }
                    }}
                  >
                    {newAnnouncement.dateReminder !== null
                      ? "Edit Date"
                      : "New Date"}
                  </button>
                </div>
              )}

              {openTagAdd && (
                <div className="tag-add">
                  <div className="add-tag-tag">
                    <select
                      onChange={(e) => {
                        setSelectedTag(e.target.value);
                      }}
                      value={selectedTag}
                    >
                      <option value="0" disabled selected>
                        Select a tag
                      </option>

                      {club.tags.map((tag, i) => (
                        <>
                          {newAnnouncement.tags.indexOf(tag) !== -1 ? null : (
                            <option
                              key={i}
                              style={{ color: tag.color }}
                              value={tag._id}
                            >
                              {tag.name}
                            </option>
                          )}
                        </>
                      ))}
                    </select>

                    <button
                      disabled={selectedTag === "0"}
                      className={selectedTag === "0" ? "disabled" : ""}
                      onClick={() => {
                        if (selectedTag === "0") return;
                        let newAnnouncement1 = { ...newAnnouncement };
                        newAnnouncement1.tags.push(
                          club.tags.find((tag) => tag._id === selectedTag)
                        );

                        setNewAnnouncement(newAnnouncement1);
                        setOpenTagAdd(false);
                        setSelectedTag("0");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {openDateAdd && (
                <div className="add-tag-date">
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                    }}
                  />

                  <button
                    disabled={selectedDate === ""}
                    className={selectedDate === "" ? "disabled" : ""}
                    onClick={() => {
                      if (selectedTag === "") return;
                      let newAnnouncement1 = { ...newAnnouncement };
                      newAnnouncement1.dateReminder = selectedDate;
                      setNewAnnouncement(newAnnouncement1);
                      setOpenDateAdd(false);
                      setSelectedDate("");
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            <textarea
              placeholder="Type something..."
              className="announcement-new"
              value={newAnnouncement.message}
              onChange={(e) => onChange(e, "announcementText")}
            />
            {newAnnouncement.files.length > 0 && (
              <div className="announcement-files">
                {newAnnouncement.files.map((file, i) => (
                  <div className="file-container" key={i}>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">
                        {file.size > 1000000
                          ? (file.size / 1000000).toFixed(2) + " MB"
                          : (file.size / 1000).toFixed(2) + " KB"}{" "}
                        | {file.name.split(".").pop()}
                      </div>
                    </div>
                    <div
                      className="x"
                      onClick={() => {
                        let newAnnouncement1 = { ...newAnnouncement };
                        newAnnouncement1.files.splice(i, 1);
                        setNewAnnouncement(newAnnouncement1);
                      }}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
            )}

            {newAnnouncement.images.length > 0 && (
              <div className="announcement-images">
                {newAnnouncement.images.map((image, i) => (
                  <div className="image-container" key={i}>
                    <img src={image} alt="announcement" />
                    <div
                      className="x"
                      onClick={() => {
                        let newAnnouncement1 = { ...newAnnouncement };
                        newAnnouncement1.images.splice(i, 1);
                        setNewAnnouncement(newAnnouncement1);
                      }}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bottom">
              <div className="bottom-left">
                <label
                  className={imageLoading ? "add-image disabled" : "add-image"}
                >
                  <input
                    type="file"
                    id="btn_input"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                  {imageLoading ? (
                    <Loading insideWrapper={false} size="small" />
                  ) : (
                    <>
                      <span>+</span>Add image
                    </>
                  )}
                </label>

                <label
                  className={fileLoading ? "add-image disabled" : "add-image"}
                >
                  <input
                    type="file"
                    id="btn_input"
                    accept="!image/*"
                    onChange={handleFileUpload}
                  />

                  {fileLoading ? (
                    <Loading insideWrapper={false} size="small" />
                  ) : (
                    <>
                      <span>+</span>Add file
                    </>
                  )}
                </label>
              </div>
              <button
                className="send-new-announcement"
                onClick={sendAnnouncement}
              >
                Send
              </button>
            </div>
          </div>
        )}
        {club.announcements.length === 0 ? (
          <h3 style={{ textAlign: "center", color: "#757575" }}>
            No announcements yet
          </h3>
        ) : null}
        {club.announcements
          .sort((a, b) => {
            if (filterData.relevance == 0) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
              return new Date(a.createdAt) - new Date(b.createdAt);
            }
          })
          .filter((announcement) => {
            if (filterData.tag == -1) return true;
            const tagFound = club.tags[filterData.tag];
            if (tagFound) {
              return (
                announcement.tags.indexOf(
                  announcement.tags.find((t) => t._id == tagFound._id)
                ) !== -1
              );
            } else {
              return true;
            }
          })
          .filter((announcement) => {
            if (filterData.user == -1) return true;
            return announcement.user._id == filterData.user;
          })
          .filter((announcement) => {
            const foundClub =
              club.members.find((m) => m.user._id == user._id) ||
              club.sponsors.find((m) => m._id == user._id);

            if (user.type === "admin" || foundClub) return true;

            const tag = club.tags.find((t) => t.default === true);
            if (tag) {
              return (
                announcement.tags.indexOf(
                  announcement.tags.find((t) => t._id == tag._id)
                ) !== -1
              );
            }
          })
          .map((announcement, i) => (
            <div className="announcement" key={i}>
              <div className="announcement-top">
                <div className="announcement-author">
                  <img src={announcement.user.profilePic} alt="" />
                  <h3>
                    {announcement.user.firstName}{" "}
                    {announcement.user.lastName !== ""
                      ? announcement.user.lastName
                      : null}
                  </h3>
                </div>
                <p>{timeFromNow(announcement.createdAt)}</p>
              </div>

              <div className="announcement-tags">
                {announcement.tags.map((tag, i) => (
                  <div
                    className="tag"
                    key={i}
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </div>
                ))}

                {announcement.dateReminder !== null &&
                announcement.dateReminder !== undefined ? (
                  <div className="date-container">
                    {moment(announcement.dateReminder).format(
                      "MM/DD/YY h:mm a"
                    )}
                  </div>
                ) : null}
              </div>
              <div className="announcement-body">
                <p>{announcement.message}</p>
              </div>
              {announcement.files.length > 0 && (
                <div className="announcement-files">
                  {announcement.files.map((file, i) => (
                    <div
                      className="file-container hover-file"
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(file.url);
                      }}
                    >
                      <div className="file-details">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">
                          {file.size > 1000000
                            ? (file.size / 1000000).toFixed(2) + " MB"
                            : (file.size / 1000).toFixed(2) + " KB"}{" "}
                          | {file.name.split(".").pop()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {announcement.images.length > 0 && (
                <div className="announcement-images">
                  {announcement.images.map((image, i) => (
                    <div className="image-container" key={i}>
                      <img src={image} alt="announcement" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="members">
        <h1>Members ({club.members.length})</h1>
        <div className="main-member-list">
          {club.members
            .filter((m) => m.role === "officer")
            .map((member, i) => (
              <div className="member" key={i}>
                <div className="member-bar-member-wrapper">
                  <img src={member.user.profilePic} alt="" />
                  <p>
                    {member.user.firstName}{" "}
                    {member.user.lastName !== "" && member.user.lastName}
                  </p>
                </div>
              </div>
            ))}
          {club.members
            .filter((m) => m.role !== "officer")
            .map((member, i) => (
              <div className="member" key={i}>
                <div className="member-bar-member-wrapper">
                  <img src={member.user.profilePic} alt="" />
                  <p>
                    {member.user.firstName}{" "}
                    {member.user.lastName !== "" && member.user.lastName}
                  </p>
                </div>
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
    </div>
  );
}
