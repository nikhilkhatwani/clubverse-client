import React, { useState, useEffect } from "react";
import moment from "moment";
import { clubMeetingNew, clubMeetingEdit } from "../../utils/api/calls/clubs";

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
  const [meetingIndex, setMeetingIndex] = useState(0);
  const [error, setError] = useState("");

  const attendanceOperation = async (updateId, attendStatus) => {
    if (!hasPermissions) return;

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
      club1.meetings = response.club.meetings;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  const createMeeting = async () => {
    const currentDate = Date.now();
    let club1 = { ...club };
    let response = await clubMeetingNew(club._id, user._id, currentDate);
    if (response.success) {
      club1.meetings = response.club.meetings;
      setClub(club1);
      setMeetingIndex(club1.meetings.length - 1);
    } else {
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
      let officers1 = club.members.filter((m) => m.role === "officer");
      let members1 = meeting.attendance.filter(
        (a) => a.user.type === "student"
      );

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
    <div class="club-attendance-page">
      <div class="meeting">
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
      </div>
      <section className="sponsor">
        <h2>Sponsors ({sponsors.length})</h2>
        {sponsors.map((sponsor, i) => (
          <div className="member-page-member" key={i}>
            <div className="person">
              <img src="/assets/default.png" alt="" />
              <h4>
                {sponsor.user.lastName}, {sponsor.user.firstName}
              </h4>
            </div>
            <div className="attendance-yes-no">
              <div
                onClick={() => attendanceOperation(sponsor.user._id, "absent")}
                className={
                  sponsor.status === "absent"
                    ? "attendance-no selected"
                    : "attendance-no"
                }
              >
                &#10005;
              </div>
              <div
                onClick={() => attendanceOperation(sponsor.user._id, "neutral")}
                className={
                  sponsor.status === "neutral"
                    ? "attendance-neutral selected"
                    : "attendance-neutral"
                }
              >
                &#9711;
              </div>
              <div
                onClick={() => attendanceOperation(sponsor.user._id, "present")}
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
        ))}
      </section>
      <section className="officers">
        <h2>Officers ({officers.length})</h2>
        {officers.map((officer, i) => (
          <div className="member-page-member" key={i}>
            <div className="person">
              <img src="/assets/default.png" alt="" />
              <h4>
                {officer.user.lastName}, {officer.user.firstName}
              </h4>
            </div>
            <div className="attendance-yes-no">
              <div
                onClick={() => attendanceOperation(officer.user._id, "absent")}
                className={
                  officer.status === "absent"
                    ? "attendance-no selected"
                    : "attendance-no"
                }
              >
                &#10005;
              </div>
              <div
                onClick={() => attendanceOperation(officer.user._id, "neutral")}
                className={
                  officer.status === "neutral"
                    ? "attendance-neutral selected"
                    : "attendance-neutral"
                }
              >
                &#9711;
              </div>
              <div
                onClick={() => attendanceOperation(officer.user._id, "present")}
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
        ))}
      </section>
      <section className="sponsor">
        <h2>Members ({members.length})</h2>
        {members.map((member, i) => (
          <div className="member-page-member" key={i}>
            <div className="person">
              <img src="/assets/default.png" alt="" />
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
                onClick={() => attendanceOperation(member.user._id, "neutral")}
                className={
                  member.status === "neutral"
                    ? "attendance-neutral selected"
                    : "attendance-neutral"
                }
              >
                &#9711;
              </div>
              <div
                onClick={() => attendanceOperation(member.user._id, "present")}
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
        ))}
      </section>
    </div>
  );
}
