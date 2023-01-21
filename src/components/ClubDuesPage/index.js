import React, { useState, useEffect } from "react";
import { clubUpdateDues } from "../../utils/api/calls/clubs";
import { useNavigate } from "react-router-dom";

export default function ClubDuesPage({
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

  useEffect(() => {
    let sponsors1 = club.dues.filter((due) => due.user.type === "sponsor");
    let officers1 = club.members.filter((m) => m.role === "officer");
    let members1 = club.dues.filter((due) => due.user.type === "student");

    // sort by last name
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
  }, [club]);

  const duesOperation = async (updateId, paidStatus) => {
    if (!hasPermissions) return;

    let club1 = { ...club };
    let due = club1.dues.find(
      (thing) => thing.user._id.toString() === updateId
    );
    let ind = club1.dues.indexOf(due);
    due.paid = paidStatus;
    club1.dues[ind] = due;
    setClub(club1);

    const response = await clubUpdateDues(
      club._id,
      user._id,
      updateId,
      paidStatus
    );

    if (response.success) {
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  return (
    <div className="club-dues-page">
      <section className="sponsor">
        <h2>Sponsors ({sponsors.length})</h2>
        {sponsors.map((sponsor, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper">
              <div className="person">
                <img src="/assets/default.png" alt="" />
                <h4>
                  {sponsor.user.lastName}, {sponsor.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() => duesOperation(sponsor.user._id, "unpaid")}
                  className={
                    sponsor.paid === "unpaid"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() => duesOperation(sponsor.user._id, "neutral")}
                  className={
                    sponsor.paid === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() => duesOperation(sponsor.user._id, "paid")}
                  className={
                    sponsor.paid === "paid"
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
                <img src="/assets/default.png" alt="" />
                <h4>
                  {officer.user.lastName}, {officer.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() => duesOperation(officer.user._id, "unpaid")}
                  className={
                    officer.paid === "unpaid"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() => duesOperation(officer.user._id, "neutral")}
                  className={
                    officer.paid === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() => duesOperation(officer.user._id, "paid")}
                  className={
                    officer.paid === "paid"
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
                <img src="/assets/default.png" alt="" />
                <h4>
                  {member.user.lastName}, {member.user.firstName}
                </h4>
              </div>
              <div className="attendance-yes-no">
                <div
                  onClick={() => duesOperation(member.user._id, "unpaid")}
                  className={
                    member.paid === "unpaid"
                      ? "attendance-no selected"
                      : "attendance-no"
                  }
                >
                  &#10005;
                </div>
                <div
                  onClick={() => duesOperation(member.user._id, "neutral")}
                  className={
                    member.paid === "neutral"
                      ? "attendance-neutral selected"
                      : "attendance-neutral"
                  }
                >
                  &#9711;
                </div>
                <div
                  onClick={() => duesOperation(member.user._id, "paid")}
                  className={
                    member.paid === "paid"
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
