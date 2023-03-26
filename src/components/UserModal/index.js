import { useEffect, useState } from "react";
import { clubPollUpdate } from "../../utils/api/calls/clubs";
import "./index.css";

export default function UserModal({
  users,
  title,
  setOpenUserModal,
  type = "userList",
  votingOptions = [],
  question = "",
  userId,
  clubId,
  announcementId,
  club,
  setClub,
  user,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (type === "voting") {
      const userVoted = votingOptions.find((option) =>
        option.votes.find((vote) => vote._id === userId)
      );

      if (userVoted) {
        setSelectedOption(userVoted._id);
      }
    }
  }, []);

  const changeVote = async () => {
    setOpenUserModal(false);
    const selectedIndex = votingOptions.findIndex(
      (option) => option._id === selectedOption
    );

    const newClub = { ...club };
    const foundAnnouncement = newClub.announcements.find(
      (announcement) => announcement._id === announcementId
    );
    const foundAnnouncementIndex =
      newClub.announcements.indexOf(foundAnnouncement);

    const userVoted = votingOptions.find((option) =>
      option.votes.find((vote) => vote._id === userId)
    );

    if (userVoted) {
      const previousOptionIndex = votingOptions.findIndex(
        (option) => option._id === userVoted._id
      );

      newClub.announcements[foundAnnouncementIndex].poll.options[
        previousOptionIndex
      ].votes = newClub.announcements[foundAnnouncementIndex].poll.options[
        previousOptionIndex
      ].votes.filter((vote) => vote._id !== userId);
    }

    newClub.announcements[foundAnnouncementIndex].poll.options[
      selectedIndex
    ].votes.push(user);

    setClub(newClub);

    let response = await clubPollUpdate(
      userId,
      clubId,
      announcementId,
      selectedIndex
    );

    console.log(response);

    // if (response.success) {
    //   newClub.announcements[foundAnnouncementIndex] =
    //     response.announcement;

    //   setClub(newClub);
    // }
  };

  const removeVote = async () => {
    setOpenUserModal(false);
    const newClub = { ...club };
    const foundAnnouncement = newClub.announcements.find(
      (announcement) => announcement._id === announcementId
    );
    const foundAnnouncementIndex =
      newClub.announcements.indexOf(foundAnnouncement);

    const userVoted = votingOptions.find((option) =>
      option.votes.find((vote) => vote._id === userId)
    );

    if (userVoted) {
      const previousOptionIndex = votingOptions.findIndex(
        (option) => option._id === userVoted._id
      );

      const updated = newClub.announcements[
        foundAnnouncementIndex
      ].poll.options[previousOptionIndex].votes.filter(
        (vote) => vote._id !== userId
      );

      newClub.announcements[foundAnnouncementIndex].poll.options[
        previousOptionIndex
      ].votes = updated;
    }

    setClub(newClub);

    let response = await clubPollUpdate(userId, clubId, announcementId, -1);

    console.log(response);
  };

  return (
    <div className="user-modal">
      <div className="modal-overlay">
        <div className="modal-wrapper">
          {type === "userList" && (
            <>
              <div className="modal-header">
                <h3>
                  {title} ({users.length})
                </h3>
                <span
                  className="close-modal"
                  onClick={() => setOpenUserModal(false)}
                >
                  &times;
                </span>
              </div>
              <div className="modal-body">
                {users.map((user) => (
                  <div className="user" key={user._id}>
                    <div className="user-container">
                      <img src={user.profilePic} alt="avatar" />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    {user.option && (
                      <div className="user-voted">
                        Voted for <span>{user.option}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {type == "voting" && (
            <>
              <div className="modal-header">
                <h3>{question}</h3>
                <span
                  className="close-modal"
                  onClick={() => setOpenUserModal(false)}
                >
                  &times;
                </span>
              </div>
              <div className="modal-body">
                {votingOptions.map((option) => (
                  <div className="user" key={option._id}>
                    <div className="user-fixation">
                      <div>
                        <div className="user-container">
                          <span>{option.option}</span>
                        </div>
                        <div className="user-voted">
                          {option.votes.length} votes
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        className="vote-checkbox"
                        checked={selectedOption === option._id}
                        onChange={() => setSelectedOption(option._id)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  disabled={!selectedOption}
                  onClick={changeVote}
                  className={
                    !selectedOption ? "vote-button disabled" : "vote-button"
                  }
                >
                  {votingOptions.find((option) =>
                    option.votes.find((vote) => vote._id === userId)
                  )
                    ? "Change Vote"
                    : "Vote"}
                </button>

                {votingOptions.find((option) =>
                  option.votes.find((vote) => vote._id === userId)
                ) && (
                  <button onClick={removeVote} className="vote-button cancel">
                    Remove Vote
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
