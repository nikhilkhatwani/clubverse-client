import React, { useEffect, useState } from "react";
import { clubJoin, getClub } from "../../utils/api/calls/clubs";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

import "./index.css";
import {
  ClubAttendancePage,
  ClubDuesPage,
  ClubMembersPage,
  ClubSettingsPage,
  ClubAnnouncementsPage,
} from "../../components";

export default function ClubPage({ user, setUser }) {
  let current = new URLSearchParams(window.location.search).get("current");
  current = current ? current : 0;
  console.log(current);
  current = parseInt(current);

  const [isCurrent, setIsCurrent] = useState(
    current === 0 || current == 1 || current === 4
      ? true
      : ((current === 2 || current === 3) && user.type === "admin") ||
        user.type === "sponsor"
      ? true
      : false
  );

  const [selected, setSelectedIndex] = useState(isCurrent ? current : 0);
  const [club, setClub] = useState({});
  const [hasPermissions, setHasPermissions] = useState(false);
  const [foundUser, setFoundUser] = useState({});

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { clubId } = useParams();

  const setSelected = (index) => {
    if (index === 0 || index === 1 || index === 4) {
      if (foundUser || hasPermissions) setSelectedIndex(index);
    } else if (index === 2 || index === 3) {
      if (
        user.type === "admin" ||
        user.type === "sponsor" ||
        (foundUser && foundUser.role === "officer")
      ) {
        setSelectedIndex(index);
      }
    }

    navigate(`/${user.school.link}/${clubId}?current=${index}`);
  };

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

  useEffect(() => {
    async function getClubInfo() {
      setLoading(true);
      const response = await getClub(clubId);
      if (response.success) {
        setClub(response.club);

        const foundUser = response.club.members.find(
          (m) => m.user._id.toString() === user._id.toString()
        );

        const foundSponsor = response.club.sponsors.find(
          (s) => s._id === user._id
        );

        if (!foundSponsor && user.type === "sponsor") {
          navigate(`/${user.school.link}`);
        }

        if (response.club.pending) {
          navigate(`/${user.school.link}?pending=true`);
        }

        if (
          user.type === "admin" ||
          foundSponsor !== undefined ||
          (foundUser && foundUser.role === "officer")
        ) {
          setHasPermissions(true);
          if (current === 2 || current === 3) {
            setIsCurrent(true);
            setSelectedIndex(current);
          }
        }

        setFoundUser(foundUser);

        setLoading(false);
      } else {
        setLoading(false);
        navigate(`/${user.school.link}`);
      }
    }

    getClubInfo();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (club)
    return (
      <div className="club-body">
        <div className="nav-wrapper">
          <nav className="nav">
            <div>
              <h1>Clubverse</h1>
            </div>
            <div className="nav-list">
              <div>
                <Link to="/">Home</Link>
              </div>

              <div className="nav-login">
                <a href="login.html">
                  <img src="/assets/default.png" />
                  {user.firstName} {user.lastName !== "" ? user.lastName : null}
                </a>
              </div>
            </div>
          </nav>
        </div>
        <div className="club-header-wrapper">
          <div className="club-header">
            <div className="club-header-left">
              <h2>{club.name}</h2>
              <div className="club-header-right-hidden">
                <p>
                  {club.members.length}{" "}
                  {club.members.length !== 1 ? "members" : "member"}
                </p>
                <p>Rm. {club.room}</p>
              </div>
              <div className="club-header-nav">
                <a onClick={() => setSelected(0)}>
                  <div
                    className={
                      selected === 0
                        ? "club-header-link selected"
                        : "club-header-link"
                    }
                  >
                    Announcements
                  </div>
                </a>

                {foundUser == undefined && !hasPermissions ? (
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
                        ? "requested join-right-btn club-join-hidden"
                        : "join-right-btn club-join-hidden"
                    }
                  >
                    {club.requests.indexOf(
                      club.requests.find((u) => u._id == user._id)
                    ) !== -1
                      ? "Requested"
                      : "Join Club"}
                  </button>
                ) : null}

                {foundUser !== undefined || hasPermissions ? (
                  <a onClick={() => setSelected(1)}>
                    <div
                      className={
                        selected === 1
                          ? "club-header-link selected"
                          : "club-header-link"
                      }
                    >
                      Members
                    </div>
                  </a>
                ) : null}

                {hasPermissions && (
                  <a onClick={() => setSelected(2)}>
                    <div
                      className={
                        selected === 2
                          ? "club-header-link selected"
                          : "club-header-link"
                      }
                    >
                      Attendance
                    </div>
                  </a>
                )}

                {hasPermissions && (
                  <a onClick={() => setSelected(3)}>
                    <div
                      className={
                        selected === 3
                          ? "club-header-link selected"
                          : "club-header-link"
                      }
                    >
                      Dues
                    </div>
                  </a>
                )}

                {foundUser !== undefined || hasPermissions ? (
                  <a onClick={() => setSelected(4)}>
                    <div
                      className={
                        selected === 4
                          ? "club-header-link selected"
                          : "club-header-link"
                      }
                    >
                      Settings
                    </div>
                  </a>
                ) : null}
              </div>
            </div>
            <div className="club-header-right">
              {club.members.length}{" "}
              {club.members.length !== 1 ? "members" : "member"}
              <p>Rm. {club.room}</p>
              {foundUser == undefined && !hasPermissions ? (
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
              ) : null}
            </div>
          </div>
        </div>

        {selected === 0 ? (
          <ClubAnnouncementsPage
            club={club}
            user={user}
            setClub={setClub}
            setUser={setUser}
            setSelected={setSelected}
            hasPermissions={hasPermissions}
            foundUser={foundUser}
          />
        ) : selected === 1 ? (
          <ClubMembersPage
            club={club}
            user={user}
            setClub={setClub}
            setUser={setUser}
            setSelected={setSelected}
            hasPermissions={hasPermissions}
            foundUser={foundUser}
          />
        ) : selected === 2 ? (
          <ClubAttendancePage
            club={club}
            user={user}
            setClub={setClub}
            setUser={setUser}
            setSelected={setSelected}
            hasPermissions={hasPermissions}
            foundUser={foundUser}
          />
        ) : selected === 3 ? (
          <ClubDuesPage
            club={club}
            user={user}
            setClub={setClub}
            setUser={setUser}
            setSelected={setSelected}
            hasPermissions={hasPermissions}
            foundUser={foundUser}
          />
        ) : selected === 4 ? (
          <ClubSettingsPage
            club={club}
            user={user}
            setClub={setClub}
            setUser={setUser}
            setSelected={setSelected}
            hasPermissions={hasPermissions}
            foundUser={foundUser}
          />
        ) : null}
      </div>
    );
}
