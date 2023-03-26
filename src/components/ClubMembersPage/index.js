import React, { useState, useEffect } from "react";
import {
  clubAddSponsor,
  clubMemberApproveDeny,
  clubMemberPromoteDemote,
  clubMemberRemove,
  clubRemoveSponsor,
} from "../../utils/api/calls/clubs";

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
  const [selectedMember, setSelectedMember] = useState(null);
  const [newSponsor, setNewSponsor] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(-1);
  const [occupied, setOccupied] = useState(false);

  useEffect(() => {
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
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
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
      setOccupied(false);
      club1.requests = response.club.requests;
      club1.members = response.club.members;
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  const getAttendances = (member) => {
    let attendances = 0;
    let absences = 0;

    club.meetings.forEach((meeting) => {
      const find = meeting.attendance.find((a) => a.user._id == member._id);
      if (find) {
        if (find.status === "present") attendances++;
        if (find.status === "absent") absences++;
      }
    });

    return {
      attendances,
      absences,
    };
  };

  const getDues = (member) => {
    let duesPaidMember = club.dues.find((d) => d.user._id == member._id);
    if (!duesPaidMember) return "neutral";
    return duesPaidMember.paid;
  };

  const setMemberDropDown = (member) => {
    if (selectedMember !== null && selectedMember._id == member._id) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
      getAttendances(member);
    }
  };

  const promoteDemote = async (member) => {
    if (user.type !== "admin" && user.type !== "sponsor") return;
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    let member1 = club1.members.find((m) => m.user._id == member._id);

    if (!member1) return;

    if (member1.role === "member") {
      member1.role = "officer";
      club1.members = club1.members.filter((m) => m.user._id !== member._id);
      club1.members.push({
        user: member1.user,
        role: "officer",
      });
    } else {
      member1.role = "member";
      club1.members = club1.members.filter((m) => m.user._id !== member._id);
      club1.members.push({
        user: member1.user,
        role: "member",
      });
    }

    setClub(club1);

    let response = await clubMemberPromoteDemote(
      club._id,
      user._id,
      member._id
    );
    if (response.success) {
      setOccupied(false);
      club1.members = response.club.members;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  const removeMember = async (member) => {
    if (user.type !== "admin" && user.type !== "sponsor") return;
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    club1.members = club1.members.filter((m) => m.user._id !== member._id);
    club1.dues = club1.dues.filter((d) => d.user._id !== member._id);
    setClub(club1);
    setMembers(club1.members);
    setSelectedMember(null);
    let response = await clubMemberRemove(club._id, user._id, member._id);
    if (response.success) {
      setOccupied(false);
      club1.members = response.club.members;
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  const addSponsor = async (sponsor) => {
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    club1.sponsors.push(sponsor);
    club1.dues.push({
      user: sponsor,
      paid: "neutral",
    });
    setClub(club1);
    setNewSponsor(false);

    let response = await clubAddSponsor(club._id, user._id, sponsor._id);
    if (response.success) {
      setOccupied(false);
      club1.sponsors = response.club.sponsors;
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  const removeSponsor = async (sponsor) => {
    if (occupied) return;
    setOccupied(true);
    let club1 = { ...club };
    club1.sponsors = club1.sponsors.filter((s) => s._id !== sponsor._id);
    club1.dues = club1.dues.filter((d) => d.user._id !== sponsor._id);
    setClub(club1);

    let response = await clubRemoveSponsor(club._id, user._id, sponsor._id);
    if (response.success) {
      setOccupied(false);
      club1.sponsors = response.club.sponsors;
      club1.dues = response.club.dues;
      setClub(club1);
    } else {
      setOccupied(false);
      setSelected(0);
    }
  };

  return (
    <div className="club-members-page">
      {user.type === "admin" ||
      (user.type === "sponsor" &&
        club.sponsors.indexOf(club.sponsors.find((s) => s._id == user._id)) ==
          0) ? (
        <div className="meeting">
          {newSponsor ? (
            <>
              <select
                name="meeting"
                id="meeting"
                value={sponsorIndex}
                onChange={(e) => {
                  setSponsorIndex(e.target.value);
                }}
                defaultValue={-1}
              >
                <option value="-1" disabled selected>
                  Select a sponsor
                </option>

                {club.school.sponsors.map((m, i) => {
                  if (m._id == user._id) return;
                  if (club.sponsors.find((s) => s._id == m._id)) return;

                  return (
                    <option key={i} value={i}>
                      {m.firstName} {m.lastName}
                    </option>
                  );
                })}
              </select>
              <button
                className="create-meeting cancel-btn"
                onClick={() => setNewSponsor(false)}
              >
                Cancel
              </button>
              <button
                className={
                  sponsorIndex == -1
                    ? "create-meeting disabled"
                    : "create-meeting"
                }
                onClick={() => addSponsor(club.school.sponsors[sponsorIndex])}
                disabled={sponsorIndex == -1}
              >
                Add sponsor
              </button>
            </>
          ) : (
            <button
              className="create-meeting"
              onClick={() => setNewSponsor(true)}
            >
              Add a new sponsor
            </button>
          )}
        </div>
      ) : null}
      <section className="sponsor">
        <h2>Sponsors ({sponsors.length})</h2>
        {sponsors.map((sponsor, i) => (
          <>
            <div className="member-page-member" key={i}>
              <div className="person-wrapper pw">
                <div className="person">
                  <img src={sponsor.profilePic} alt="" />
                  <h4>
                    {sponsor.lastName}, {sponsor.firstName}
                  </h4>
                </div>
                <h4
                  className="ellipsis"
                  onClick={() => setMemberDropDown(sponsor)}
                >
                  ...
                </h4>
              </div>
              {selectedMember !== null && selectedMember._id == sponsor._id ? (
                <div className="member-dropdown">
                  <div className="member-dropdown-left">
                    <div>{`Email: ${sponsor.email}`}</div>
                    {hasPermissions ? (
                      <>
                        <div>{`${
                          getAttendances(sponsor).attendances
                        } presences | ${
                          getAttendances(sponsor).absences
                        } absences`}</div>
                        <div>{`Dues: ${getDues(sponsor)} `}</div>
                      </>
                    ) : null}
                  </div>
                  {user.type === "admin" ||
                  (user.type === "sponsor" &&
                    club.sponsors.indexOf(
                      club.sponsors.find((s) => s._id == user._id)
                    ) == 0) ? (
                    <div className="member-dropdown-right">
                      {selectedMember.type == "sponsor" &&
                        selectedMember._id !== user._id && (
                          <button
                            className="button-remove"
                            onClick={() => removeSponsor(sponsor)}
                          >
                            Remove Sponsor
                          </button>
                        )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ))}
      </section>
      <section className="officers">
        <h2>Officers ({officers.length})</h2>
        {officers.map((officer, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper pw">
              <div className="person">
                <img src={officer.user.profilePic} alt="" />
                <h4>
                  {officer.user.lastName}, {officer.user.firstName}
                </h4>
              </div>
              <h4
                className="ellipsis"
                onClick={() => setMemberDropDown(officer.user)}
              >
                ...
              </h4>
            </div>
            {selectedMember !== null &&
            selectedMember._id == officer.user._id ? (
              <div className="member-dropdown">
                <div className="member-dropdown-left">
                  <div>{`Username: ${officer.user.username}`}</div>
                  <div>{`Email: ${officer.user.email}`}</div>
                  {hasPermissions ? (
                    <>
                      <div>{`${
                        getAttendances(officer.user).attendances
                      } presences | ${
                        getAttendances(officer.user).absences
                      } absences`}</div>
                      <div>{`Dues: ${getDues(officer.user)} `}</div>
                    </>
                  ) : null}
                </div>
                {user.type == "admin" || user.type == "sponsor" ? (
                  <div className="member-dropdown-right">
                    {selectedMember.type !== "sponsor" &&
                    selectedMember.type !== "admin" ? (
                      <button
                        className="button-promote-demote"
                        onClick={() => promoteDemote(officer.user)}
                      >
                        {club.members.find(
                          (m) => m.user._id == selectedMember._id
                        )?.role === "officer"
                          ? "Demote Member"
                          : "Promote Member"}
                      </button>
                    ) : null}

                    {selectedMember.type !== "sponsor" && (
                      <button
                        className="button-remove"
                        onClick={() => removeMember(officer.user)}
                      >
                        Remove Member
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </section>
      <section className="sponsor">
        <h2>Members ({members.length})</h2>
        {members.map((member, i) => (
          <div className="member-page-member" key={i}>
            <div className="person-wrapper pw">
              <div className="person">
                <img src={member.user.profilePic} alt="" />
                <h4>
                  {member.user.lastName}, {member.user.firstName}
                </h4>
              </div>
              <h4
                className="ellipsis"
                onClick={() => setMemberDropDown(member.user)}
              >
                ...
              </h4>
            </div>
            {selectedMember !== null &&
            selectedMember._id == member.user._id ? (
              <div className="member-dropdown">
                <div className="member-dropdown-left">
                  <div>{`Username: ${member.user.username}`}</div>
                  <div>{`Email: ${member.user.email}`}</div>
                  {hasPermissions ? (
                    <>
                      <div>{`${
                        getAttendances(member.user).attendances
                      } presences | ${
                        getAttendances(member.user).absences
                      } absences`}</div>
                      <div>{`Dues: ${getDues(member.user)} `}</div>
                    </>
                  ) : null}
                </div>
                {user.type == "admin" || user.type == "sponsor" ? (
                  <div className="member-dropdown-right">
                    {selectedMember.type !== "sponsor" &&
                    selectedMember.type !== "admin" ? (
                      <button
                        className="button-promote-demote"
                        onClick={() => promoteDemote(member.user)}
                      >
                        {club.members.find(
                          (m) => m.user._id == selectedMember._id
                        )?.role === "officer"
                          ? "Demote Member"
                          : "Promote Member"}
                      </button>
                    ) : null}

                    {selectedMember.type !== "sponsor" && (
                      <button
                        className="button-remove"
                        onClick={() => removeMember(member.user)}
                      >
                        Remove Member
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </section>
      {hasPermissions && (
        <section className="sponsor">
          <h2>Requests ({requests.length})</h2>
          {requests.map((request, i) => (
            <div className="member-page-member" key={i}>
              <div className="person-wrapper pw">
                <div className="person">
                  <img src={request.profilePic} alt="" />
                  <h4>
                    {request.lastName}, {request.firstName}
                  </h4>
                </div>
                <div className="attendance-yes-no">
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
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
