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
  setOpenUserModal,
  setModalSettings,
}) {
  const [newAnnouncement, setNewAnnouncement] = useState({
    message: "",
    images: [],
    tags: [],
    files: [],
    files: [],
    dateReminder: null,
    poll: null,
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
  const [openPollAdd, setOpenPollAdd] = useState(false);
  const [selectedTag, setSelectedTag] = useState("0");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPoll, setSelectedPoll] = useState({
    question: "",
    options: [],
  });

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
    let { message, images, tags, files, dateReminder, poll } = newAnnouncement;

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
      poll,
    };

    let copy = { ...announcement };

    copy.poll.options.map(
      (o, i) => (copy.poll.options[i] = { option: o, votes: [] })
    );

    club1.announcements.push(copy);
    setClub(club1);

    setNewAnnouncement({
      message: "",
      images: [],
      tags: [],
      files: [],
      dateReminder: null,
      poll: null,
    });

    setSelectedTag("0");
    setSelectedDate("");
    setSelectedPoll({
      question: "",
      options: [],
    });

    setOpenSelect(false);
    setOpenTagAdd(false);
    setOpenDateAdd(false);
    setOpenPollAdd(false);

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
      setNewAnnouncement({
        ...newAnnouncement,
        files: newAnnouncement.files.concat(newFile),
      });
    } else {
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
                  setOpenPollAdd(false);
                  setSelectedTag("0");
                  setSelectedDate("");
                }}
              >
                {openTagAdd || openDateAdd || openPollAdd || openSelect
                  ? "x"
                  : "+"}
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

                  <button
                    onClick={() => {
                      setOpenPollAdd(!openPollAdd);
                      setOpenSelect(!openSelect);
                      if (newAnnouncement.poll !== null) {
                        setSelectedPoll(newAnnouncement.poll);
                      }
                    }}
                  >
                    {newAnnouncement.poll !== null ? "Edit Poll" : "New Poll"}
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
                    {newAnnouncement.dateReminder !== null ? "Edit" : "Add"}
                  </button>
                </div>
              )}

              {openPollAdd && (
                <div className="add-tag-poll">
                  <div className="poll-container">
                    <h3>Question</h3>
                    <input
                      type="text"
                      placeholder="Poll Question"
                      className="poll-question"
                      value={selectedPoll.question}
                      onChange={(e) => {
                        let newPoll = { ...selectedPoll };
                        newPoll.question = e.target.value;
                        setSelectedPoll(newPoll);
                      }}
                    />

                    <div className="poll-options">
                      <h3>Options</h3>
                      {selectedPoll.options.map((option, i) => (
                        <div className="poll-option" key={i}>
                          <input
                            type="text"
                            placeholder="Option"
                            value={option}
                            onChange={(e) => {
                              let newPoll = { ...selectedPoll };
                              newPoll.options[i] = e.target.value;
                              setSelectedPoll(newPoll);
                            }}
                          />
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              let newPoll = { ...selectedPoll };
                              newPoll.options.splice(i, 1);
                              setSelectedPoll(newPoll);
                            }}
                          >
                            x
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="add-option"
                    onClick={() => {
                      let newPoll = { ...selectedPoll };
                      newPoll.options.push("");
                      setSelectedPoll(newPoll);
                    }}
                  >
                    + Add Option
                  </div>
                  <button
                    disabled={selectedPoll.question === ""}
                    className={
                      selectedPoll.question === ""
                        ? "disabled"
                        : selectedPoll.options.length < 2
                        ? "disabled"
                        : selectedPoll.options.some((option) => option === "")
                        ? "disabled"
                        : ""
                    }
                    onClick={() => {
                      if (selectedPoll.question === "") return;
                      if (selectedPoll.options.length < 2) return;
                      if (selectedPoll.options.some((option) => option === ""))
                        return;
                      let newAnnouncement1 = { ...newAnnouncement };
                      newAnnouncement1.poll = selectedPoll;
                      setNewAnnouncement(newAnnouncement1);
                      setOpenPollAdd(false);
                      setSelectedPoll({
                        question: "",
                        options: [],
                      });
                    }}
                  >
                    {newAnnouncement.poll !== null ? "Edit" : "Add"}
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

            {newAnnouncement.poll !== null &&
            newAnnouncement.poll !== undefined &&
            !openPollAdd ? (
              <div className="add-tag-poll poll-underneath">
                <div className="poll-container">
                  <div className="poll-header">
                    <h3>Question</h3>
                    <div
                      className="x"
                      onClick={() => {
                        let newAnnouncement1 = { ...newAnnouncement };
                        newAnnouncement1.poll = null;
                        setNewAnnouncement(newAnnouncement1);
                      }}
                    >
                      x
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Poll Question"
                    className="poll-question"
                    value={newAnnouncement.poll.question}
                    disabled
                  />

                  <div className="poll-options">
                    <h3>Options</h3>
                    {newAnnouncement.poll.options.map((option, i) => (
                      <div className="poll-option" key={i}>
                        <input
                          type="text"
                          placeholder="Option"
                          value={option}
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

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
                  <link
                    type="image/png"
                    sizes="16x16"
                    rel="icon"
                    href=".../icons8-link-16.png"
                  ></link>
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

              {announcement.poll?.question &&
              announcement.poll.options.length !== 0 ? (
                <div className="add-tag-poll">
                  <div className="poll-container">
                    <div className="poll-header poll-extended">
                      <h3>Question</h3>
                      <div className="poll-header-right">
                        <div
                          className="poll-votes"
                          style={
                            announcement.poll.options
                              .map((option) => option.votes)
                              .flat()
                              .map((user) => {
                                const option = announcement.poll?.options?.find(
                                  (option) =>
                                    option?.votes?.find(
                                      (vote) => vote._id == user._id
                                    )
                                );
                                return {
                                  ...user,
                                  option: option?.option,
                                };
                              }).length === 0
                              ? { cursor: "not-allowed" }
                              : { cursor: "pointer" }
                          }
                          onClick={() => {
                            const users = announcement.poll.options
                              .map((option) => option.votes)
                              .flat()
                              .map((user) => {
                                const option = announcement.poll.options.find(
                                  (option) =>
                                    option.votes.find(
                                      (vote) => vote._id == user._id
                                    )
                                );
                                return {
                                  ...user,
                                  option: option.option,
                                };
                              });

                            if (users.length === 0) return;

                            setOpenUserModal(true);
                            setModalSettings({
                              title: "Voters",
                              users,
                            });
                          }}
                        >
                          {announcement.poll?.options
                            .map((option) => option?.votes?.length)
                            .reduce((a, b) => a + b, 0)}{" "}
                          {announcement.poll.options
                            .map((option) => option?.votes?.length)
                            .reduce((a, b) => a + b, 0) !== 1
                            ? "votes"
                            : "vote"}
                        </div>

                        <button
                          className="poll-vote"
                          onClick={() => {
                            setOpenUserModal(true);
                            setModalSettings({
                              question: announcement.poll.question,
                              votingOptions: announcement.poll.options,
                              type: "voting",
                              announcementId: announcement._id,
                              clubId: club._id,
                              userId: user._id,
                              club,
                            });
                          }}
                        >
                          {announcement.poll?.options
                            .map((option) => option.votes)
                            .flat()
                            .find((u) => u?._id == user._id)
                            ? "Change Vote"
                            : "Vote"}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Poll Question"
                      className="poll-question"
                      value={announcement.poll?.question}
                      disabled
                    />
                    <h3>Options</h3>
                    <div className="poll-options">
                      {announcement.poll.options.map((option, i) => (
                        <div className="poll-option-display" key={i}>
                          <div className="option-upper">
                            <div className="option-name">
                              {option?.option}{" "}
                              {option?.votes?.length ===
                                Math.max(
                                  ...announcement.poll.options.map(
                                    (option) => option?.votes?.length
                                  )
                                ) &&
                              announcement.poll.options.filter(
                                (option) =>
                                  option.votes?.length ===
                                  Math.max(
                                    ...announcement.poll.options.map(
                                      (option) => option.votes?.length
                                    )
                                  )
                              ).length === 1
                                ? " | 🏆"
                                : null}
                            </div>
                            <div
                              className="option-votes"
                              style={
                                option.votes?.map((user) => {
                                  return {
                                    ...user,
                                    option: option.option,
                                  };
                                }).length === 0
                                  ? { cursor: "not-allowed" }
                                  : {}
                              }
                              onClick={() => {
                                const users = option.votes?.map((user) => {
                                  return {
                                    ...user,
                                    option: option.option,
                                  };
                                });

                                if (users.length === 0) return;

                                setOpenUserModal(true);
                                setModalSettings({
                                  title: "Voters",
                                  users,
                                });
                              }}
                            >
                              {option.votes?.length}{" "}
                              {option.votes?.length !== 1 ? "votes" : "vote"} |{" "}
                              {(
                                (option.votes?.length /
                                  announcement.poll?.options
                                    .map((option) => option?.votes?.length)
                                    .reduce((a, b) => a + b, 0)) *
                                100
                              ).toFixed(0) === "NaN"
                                ? 0
                                : (
                                    (option.votes?.length /
                                      announcement.poll.options
                                        .map((option) => option?.votes?.length)
                                        .reduce((a, b) => a + b, 0)) *
                                    100
                                  ).toFixed(0)}
                              %
                            </div>
                          </div>
                          <div className="option-bar">
                            <div
                              className="option-bar-fill"
                              style={{
                                width:
                                  (
                                    (option.votes?.length /
                                      announcement.poll.options
                                        .map((option) => option?.votes?.length)
                                        .reduce((a, b) => a + b, 0)) *
                                    100
                                  ).toFixed(0) == "NaN"
                                    ? 0 + "%"
                                    : (
                                        (option.votes?.length /
                                          announcement.poll.options
                                            .map(
                                              (option) => option?.votes?.length
                                            )
                                            .reduce((a, b) => a + b, 0)) *
                                        100
                                      ).toFixed(0) + "%",
                                backgroundColor:
                                  option.votes?.length ===
                                    Math.max(
                                      ...announcement.poll.options.map(
                                        (option) => option.votes?.length
                                      )
                                    ) &&
                                  announcement.poll.options.filter(
                                    (option) =>
                                      option.votes?.length ===
                                      Math.max(
                                        ...announcement.poll.options.map(
                                          (option) => option.votes?.length
                                        )
                                      )
                                  ).length === 1
                                    ? "#fdd813"
                                    : "var(--primary-color)",
                              }}
                            ></div>
                          </div>
                          {option.votes?.find(
                            (vote) => vote._id == user._id
                          ) ? (
                            <div className="option-voted">
                              You voted for this option
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
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
