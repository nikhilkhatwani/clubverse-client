import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { schoolGetClubs } from "../../utils/api/calls/schools";

import "./index.css";

export default function SchoolPage({ user, setUser, setToken }) {
  let { schoolLink } = useParams();

  const [myClubs, setMyClubs] = useState([]);
  const [otherClubs, setOtherClubs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getClubs() {
      if (user.school.link !== schoolLink) {
        return navigate(`/${user.school.link}`);
      } else {
        let response = await schoolGetClubs(user._id);
        if (response.success) {
          if (response.myClubs) setMyClubs(response.myClubs);
          if (response.otherClubs) setOtherClubs(response.otherClubs);
          if (response.allClubs) setOtherClubs(response.allClubs);
          if (response.pendingClubs) setOtherClubs(response.pendingClubs);

          console.log(response);
          console.log(otherClubs);
        } else {
          return navigate(`/${user.school.link}`);
        }
      }
    }

    getClubs();
  }, []);

  return (
    <div className="schools-wrapper">
      <div className="nav-wrapper">
        <nav className="nav">
          <div>
            <h1>Clubverse</h1>
          </div>
          <div className="nav-list">
            <div>
              <a href={`/${user.school.link}`}>Home</a>
            </div>

            <div className="nav-login">
              <a href="login.html">
                <img src="/assets/default.png" />
                Aayush Mitra
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="school-clubs-wrapper">
        <section className="school-clubs">
          <div>
            <h1 className="school-clubs-title">
              {user.type === "admin" ? "All Clubs" : "My Clubs"}
            </h1>
            <section className="my-clubs">
              {myClubs.map((club) => {
                <div className="club-card">
                  <div className="club-card-color">
                    <div className="icon"></div>
                  </div>
                  <div className="club-card-inner">
                    <div className="club-card-upper">
                      <h1>{club.name}</h1>
                      <h4>
                        Sponsor: {club.sponsor.firstName}{" "}
                        {club.sponsor.lastName}
                      </h4>
                    </div>
                    <div className="club-card-lower">
                      <div className="club-card-lower-left">
                        <p>{club.members.length} members</p>
                        <p>Rm. {club.room}</p>
                      </div>
                      <div className="club-card-lower-right">
                        <Link to={`/${user.school.link}/${club._id}`}>
                          <button>Go to club</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>;
              })}
            </section>
            <h1 className="school-clubs-title">
              {user.type === "admin" ? "Pending Clubs" : "Other Clubs"}
            </h1>
            <section className="other-clubs">
              {otherClubs.map((club) => {
                <div className="club-card">
                  <div className="club-card-color">
                    <div className="icon"></div>
                  </div>
                  <div className="club-card-inner">
                    <div className="club-card-upper">
                      <h1>{club.name}</h1>
                      <h4>
                        Sponsor: {club.sponsor.firstName}{" "}
                        {club.sponsor.lastName}
                      </h4>
                    </div>
                    <div className="club-card-lower">
                      <div className="club-card-lower-left">
                        <p>{club.members.length} members</p>
                        <p>Rm. {club.room}</p>
                      </div>
                      <div className="club-card-lower-right">
                        <Link to={`/${user.school.link}/${club._id}`}>
                          <button>Go to club</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>;
              })}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
