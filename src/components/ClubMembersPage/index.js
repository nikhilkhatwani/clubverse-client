import React, { useState, useEffect } from "react";
import { clubMemberApproveDeny } from "../../utils/api/calls/clubs";

export default function ClubMembersPage({
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
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log(club);
    let sponsors1 = club.sponsors;
    let officers1 = club.members.filter((m) => m.role === "officer");
    let members1 = club.members.filter((m) => m.role === "member");
    let requests1 = club.requests;

    sponsors1.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      }
      if (a.lastName > b.lastName) {
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

    requests1.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      }
      if (a.lastName > b.lastName) {
        return 1;
      }
      return 0;
    });

    setSponsors(sponsors1);
    setOfficers(officers1);
    setMembers(members1);
    setRequests(requests1);
  }, [club]);

  const requestOperation = async (requestId, approveStatus) => {
    if (!hasPermissions) return;

    let club1 = { ...club };
    console.log(club1);
    let request = club1.requests.find(
      (req) => req._id.toString() === requestId
    );
    let newRequests = club1.requests.filter(
      (req) => req._id.toString() !== requestId
    );
    let newMembers = members;
    newMembers.push({
      user: request,
      role: "member",
    });
    if (approveStatus) {
      setRequests(newRequests);
      setMembers(newMembers);
    }

    const response = await clubMemberApproveDeny(
      club._id,
      user._id,
      requestId,
      approveStatus
    );
    if (response.success) {
      club1.requests = response.club.requests;
      club1.members = response.club.members;
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setSelected(0);
    }
  };

  //   const duesOperation = async (updateId, paidStatus) => {
  //     const findUser = club.members.find((u) => u._id == user._id);
  //     if (
  //       user.type !== "admin" &&
  //       user.type !== "sponsor" &&
  //       (findUser == null || findUser.role !== "officer")
  //     )
  //       return;

  //     let club1 = { ...club };

  //     const response = await clubUpdateDues(
  //       club._id,
  //       user._id,
  //       updateId,
  //       paidStatus
  //     );

  //     if (response.success) {
  //       club1.dues = response.club.dues;
  //       setClub(club1);
  //     } else {
  //       setSelected(0);
  //     }
  //   };

  return (
    <div className="club-members-page">
      <section className="sponsor">
        <h2>Sponsors ({sponsors.length})</h2>
        {sponsors.map((sponsor, i) => (
          <div className="member-page-member" key={i}>
            <div className="person">
              <img src="/assets/default.png" alt="" />
              <h4>
                {sponsor.lastName}, {sponsor.firstName}
              </h4>
            </div>
            <h4 class="ellipsis">...</h4>
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
            <h4 class="ellipsis">...</h4>
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
            <h4 class="ellipsis">...</h4>
          </div>
        ))}
      </section>
      {hasPermissions && (
        <section className="sponsor">
          <h2>Requests ({requests.length})</h2>
          {requests.map((request, i) => (
            <div className="member-page-member" key={i}>
              <div className="person">
                <img src="/assets/default.png" alt="" />
                <h4>
                  {request.lastName}, {request.firstName}
                </h4>
              </div>
              <div class="attendance-yes-no">
                <div
                  onClick={() => requestOperation(request._id, false)}
                  className="attendance-no"
                >
                  &#10005;
                </div>
                <div
                  onClick={() => requestOperation(request._id, true)}
                  className="attendance-yes"
                >
                  &#x2713;
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
