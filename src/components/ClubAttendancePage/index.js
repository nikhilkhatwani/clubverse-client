import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  clubMeetingNew,
  clubMeetingEdit,
  clubMeetingDelete,
} from "../../utils/api/calls/clubs";

export default function ClubAttendancePage({
  user,
  setUser,
  club,
  setClub,
  setSelected,
  hasPermissions,
}) {
  const [sponsors, setSponsors] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [members, setMembers] = useState([]);
  const [meetingIndex, setMeetingIndex] = useState(club.meetings.length - 1); // by default, sets meeting to the most recent
  const [error, setError] = useState("");
  const [occupied, setOccupied] = useState(false);

  const attendanceOperation = async (updateId, attendStatus) => {
    if (!hasPermissions) return;
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    let current = club1.meetings[meetingIndex].attendance.find(
      (a) => a.user._id === updateId
    );

    let ind = club1.meetings[meetingIndex].attendance.indexOf(current);
    club1.meetings[meetingIndex].attendance[ind].status = attendStatus;
    setClub(club1);
    const response = await clubMeetingEdit(
      user._id,
      club.meetings[meetingIndex]._id,
      updateId,
      attendStatus
    );

    if (response.success) {
      setOccupied(false);
      club1.meetings = response.club.meetings;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  const createMeeting = async () => {
    if (occupied) return;
    setOccupied(true);
    const currentDate = Date.now();
    let club1 = { ...club };

    club1.meetings.push({
      date: currentDate,
      club,
      attendance: [
        ...club.sponsors.map((s) => {
          return {
            user: s,
            status: "neutral",
          };
        }),
        ...club.members.map((m) => {
          return {
            user: m.user,
            status: "neutral",
          };
        }),
      ],
    });
    setClub(club1);
    setMeetingIndex(club1.meetings.length - 1);

    let response = await clubMeetingNew(club._id, user._id, currentDate);
    if (response.success) {
      setOccupied(false);
      club1.meetings = response.club.meetings;
      setClub(club1);
    } else {
      setOccupied(false);
      setError(response.message);
    }
  };

  const deleteMeeting = async () => {
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    const found = club.meetings[meetingIndex]._id;

    let set = meetingIndex - 1;

    if (set < 0) set = 0;
    if (set > club.meetings.length - 1) set = club.meetings.length - 1;
    if (club.meetings.length === 1) set = -1;

    setMeetingIndex(set);
    setSponsors([]);
    setOfficers([]);
    setMembers([]);

    club1.meetings.splice(meetingIndex, 1);
    setClub(club1);

    let response = await clubMeetingDelete(club._id, user._id, found);
    if (response.success) {
      setOccupied(false);
      club1.meetings = response.club.meetings;
      setClub(club1);
    } else {
      setOccupied(false);
      setError(response.message);
    }
  };

  useEffect(() => {
    if (!club.meetings[meetingIndex]) {
      return;
    } else {
      const meeting = club.meetings[meetingIndex];
      let sponsors1 = meeting.attendance.filter(
        (a) => a.user.type === "sponsor"
      );
      let officers1 = [];
      let members1 = [];

      club.members
        .filter((m) => m.role === "officer")
        .forEach((officer) => {
          let found = meeting.attendance.find(
            (a) => a.user._id === officer.user._id
          );
          if (found) officers1.push(found);
        });

      club.members
        .filter((m) => m.role === "member")
        .forEach((member) => {
          let found = meeting.attendance.find(
            (a) => a.user._id === member.user._id
          );
          if (found) members1.push(found);
        });

      // ISSUE: Previously a member (no longer in club) doesn't show up in previous meetings that user was part of
      // CAUSED BY: Lines 78-85; cannot find because user is not in club.members

      sponsors1.sort((a, b) => {
        if (a.user.lastName < b.user.lastName) {
          return -1;
        }
        if (a.user.lastName > b.user.lastName) {
          return 1;
        }
        return 0;
      });

      officers1.sort((a, b) => {
        if (a.user.lastName < b.user.lastName) {
          return -1;
        }
        if (a.user.lastName > b.user.lastName) {
          return 1;
        }
        return 0;
      });

      members1.sort((a, b) => {
        if (a.user.lastName < b.user.lastName) {
          return -1;
        }
        if (a.user.lastName > b.user.lastName) {
          return 1;
        }
        return 0;
      });

      setSponsors(sponsors1);
      setOfficers(officers1);
      setMembers(members1);
    }
  }, [club, meetingIndex]);

  return (
    <div className="club-attendance-page">
      <div className="meeting">
        <select
          name="meeting"
          id="meeting"
          value={meetingIndex}
          onChange={(e) => {
            setMeetingIndex(e.target.value); // [object Object]
          }}
          defaultValue={club.meetings[meetingIndex]}
        >
          <option value="-1" disabled selected={club.meetings.length == 0}>
            Select a meeting
          </option>

          {club.meetings.map((m, i) => (
            <option key={i} value={i}>
              Meeting {i + 1} - {moment(m.date).format("MM/DD/YYYY")}
            </option>
          ))}
        </select>
        <button className="create-meeting" onClick={createMeeting}>
          Create Meeting
        </button>
        {meetingIndex !== -1 && (
          <button
            className="create-meeting delete-meeting"
            onClick={deleteMeeting}
          >
            Delete Meeting
          </button>
        )}
      </div>
      <section className="sponsor">
        <h2>Sponsors ({sponsors.length})</h2>
        {sponsors.map((sponsor, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper">
              <div className="person">
                <img src={sponsor.user.profilePic} alt="" />
                <h4>
                  {sponsor.user.lastName}, {sponsor.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() =>
                    attendanceOperation(sponsor.user._id, "absent")
                  }
                  className={
                    sponsor.status === "absent"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(sponsor.user._id, "neutral")
                  }
                  className={
                    sponsor.status === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(sponsor.user._id, "present")
                  }
                  className={
                    sponsor.status === "present"
                      ? "attendance-yes selected"
                      : "attendance-yes"
                  }
                >
                  &#x2713;
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="officers">
        <h2>Officers ({officers.length})</h2>
        {officers.map((officer, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper">
              <div className="person">
                <img src={officer.user.profilePic} alt="" />
                <h4>
                  {officer.user.lastName}, {officer.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() =>
                    attendanceOperation(officer.user._id, "absent")
                  }
                  className={
                    officer.status === "absent"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(officer.user._id, "neutral")
                  }
                  className={
                    officer.status === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(officer.user._id, "present")
                  }
                  className={
                    officer.status === "present"
                      ? "attendance-yes selected"
                      : "attendance-yes"
                  }
                >
                  &#x2713;
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="sponsor">
        <h2>Members ({members.length})</h2>
        {members.map((member, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper">
              <div className="person">
                <img src={member.user.profilePic} alt="" />
                <h4>
                  {member.user.lastName}, {member.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() => attendanceOperation(member.user._id, "absent")}
                  className={
                    member.status === "absent"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(member.user._id, "neutral")
                  }
                  className={
                    member.status === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() =>
                    attendanceOperation(member.user._id, "present")
                  }
                  className={
                    member.status === "present"
                      ? "attendance-yes selected"
                      : "attendance-yes"
                  }
                >
                  &#x2713;
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
