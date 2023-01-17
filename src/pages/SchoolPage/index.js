import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loading } from "../../components";
import { schoolGetClubs } from "../../utils/api/calls/schools";
import { userLogout } from "../../utils/api/calls/users";

import { NewClub } from "../";

import "./index.css";
import { clubApprove, clubJoin } from "../../utils/api/calls/clubs";
import { getColor } from "../../utils/api/colors";

export default function SchoolPage({ user, setUser, setToken, token }) {
  let { schoolLink } = useParams();

  const [myClubs, setMyClubs] = useState([]);
  const [otherClubs, setOtherClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubForm, setClubForm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getClubs = async (refresh) => {
    if (refresh) setLoading(true);
    if (user.school.link !== schoolLink) {
      return navigate(`/${user.school.link}`);
    } else {
      let response = await schoolGetClubs(user._id);
      if (response.success) {
        setMyClubs(response.myClubs);
        setOtherClubs(response.otherClubs);
        if (refresh) setLoading(false);
      } else {
        return navigate(`/${user.school.link}`);
      }
    }
  };

  useEffect(() => {
    getClubs(true);
  }, []);

  const newClub = async () => {
    setClubForm(true);
  };

  const logout = async () => {
    setLoading(true);
    let response = await userLogout(token);
    if (response.success) {
      setLoading(false);
      setUser({});
      navigate("/");
    }
  };

  const clubDecision = async (club, decision) => {
    if (decision) {
      setMyClubs((prev) => [...prev, club]);
    }
    setOtherClubs((prev) => prev.filter((c) => c._id !== club._id));
    let response = await clubApprove(user._id, club._id, decision);
    if (response.success) {
      let newUser = user;
      newUser.school = response.school;
      setUser(newUser);
      getClubs(false);
    } else {
      setError(response.message);
    }
  };

  const joinClub = async (club) => {
    let response = await clubJoin(club._id, user._id);
    if (response.success) {
      setOtherClubs((prev) => prev.filter((c) => c._id !== club._id));

      let newClub = response.club;
      newClub.sponsors = club.sponsors;
      setOtherClubs((prev) => [...prev, newClub]);
    } else {
      setError(response.message);
    }
  };

  if (clubForm) {
    return (
      <NewClub
        user={user}
        setUser={setUser}
        setToken={setToken}
        token={token}
      />
    );
  }

  return (
    <div className="schools-wrapper">
      <div className="nav-wrapper">
        <nav className="nav">
          <div>
            <h1>Clubverse</h1>
          </div>
          <div className="nav-list">
            <div className="nav-option-home">
              <a href={`/${user.school.link}`}>Home</a>
            </div>

            <div className="nav-login">
              <a onClick={logout}>
                <img src="/assets/default.png" />
                {user.firstName} {user.lastName !== "" ? user.lastName : null}
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="school-clubs-wrapper">
        <section className="school-clubs">
          <div>
            {error && <p className="error">{error}</p>}
            <h1 className="school-clubs-title">
              {user.type === "admin" ? "All Clubs" : "My Clubs"}
            </h1>
            <section className="my-clubs">
              {loading ? (
                <Loading insideWrapper={false} />
              ) : (
                <>
                  {myClubs.map((club, i) => (
                    <div className="club-card" key={i}>
                      <div
                        className="club-card-color"
                        style={{ backgroundColor: getColor(i) }}
                      >
                        <div className="icon"></div>
                      </div>
                      <div className="club-card-inner">
                        <div className="club-card-upper">
                          <h1>{club.name}</h1>
                          <h4>
                            Sponsor: {club.sponsors[0].firstName}{" "}
                            {club.sponsors[0].lastName}
                          </h4>
                        </div>
                        <div className="club-card-lower">
                          <div className="club-card-lower-left">
                            <p>{club.members.length} members</p>
                            <p>Rm. {club.room}</p>
                          </div>
                          <div className="club-card-lower-right">
                            <Link to={`/${user.school.link}/${club._id}`}>
                              <button>
                                {user.type === "admin" ||
                                user.type === "sponsor"
                                  ? "Manage"
                                  : "Go to club"}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {myClubs.length === 0 && !loading && (
                    <div className="no-clubs">
                      <p className="no-clubs-text">
                        {user.type === "sponsor"
                          ? "You have no clubs. Create one by clicking the + button below."
                          : user.type === "admin"
                          ? "No clubs created yet. You can approve any pending clubs below."
                          : "You are not part of any clubs. Join one by looking at the clubs below."}
                      </p>
                    </div>
                  )}
                  {user.type === "sponsor" ? (
                    <div
                      onClick={newClub}
                      className="club-card club-card-new"
                      style={{ backgroundColor: "#EFEFEF" }}
                    >
                      <span>+</span>
                    </div>
                  ) : null}
                </>
              )}
            </section>

            {user.type !== "sponsor" ? (
              <>
                <h1 className="school-clubs-title">
                  {user.type === "admin" ? "Pending Clubs" : "Other Clubs"}
                </h1>
                <section className="other-clubs">
                  {loading ? (
                    <Loading insideWrapper={false} />
                  ) : (
                    <>
                      {otherClubs.map((club, i) => {
                        return (
                          <div className="club-card" key={i}>
                            <div className="club-card-color">
                              <div className="icon"></div>
                            </div>
                            <div className="club-card-inner">
                              <div className="club-card-upper">
                                <h1>{club.name}</h1>
                                <h4>
                                  Sponsor: {club.sponsors[0].firstName}{" "}
                                  {club.sponsors[0].lastName}
                                </h4>
                              </div>
                              <div className="club-card-lower">
                                <div className="club-card-lower-left">
                                  <p>{club.members.length} members</p>
                                  <p>Rm. {club.room}</p>
                                </div>
                                {user.type === "admin" ? (
                                  <div className="club-card-lower-right">
                                    <div
                                      className="member-yes-no"
                                      style={{ padding: "0px" }}
                                    >
                                      <div
                                        onClick={() =>
                                          clubDecision(club, false)
                                        }
                                        className="member-no"
                                      >
                                        &#10005;
                                      </div>
                                      <div
                                        onClick={() => clubDecision(club, true)}
                                        className="member-yes"
                                      >
                                        &#x2713;
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="club-card-lower-right">
                                    <button
                                      onClick={() => joinClub(club)}
                                      disabled={club.requests.includes(
                                        user._id
                                      )}
                                      style={
                                        club.requests.includes(user._id)
                                          ? {
                                              backgroundColor: "#757575",
                                              cursor: "not-allowed",
                                            }
                                          : { backgroundColor: "#004e78" }
                                      }
                                    >
                                      {club.requests.includes(user._id)
                                        ? "Requested"
                                        : "Join Club"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {otherClubs.length === 0 &&
                        !loading &&
                        user.type !== "sponsor" && (
                          <div className="no-clubs">
                            <p className="no-clubs-text">
                              {user.type === "admin"
                                ? "There are no pending clubs to approve."
                                : "There are no other clubs to join. Talk to your sponsor to create one."}
                            </p>
                          </div>
                        )}
                    </>
                  )}
                </section>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
