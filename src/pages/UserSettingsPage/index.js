import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loading } from "../../components";
import { userLogout, userSettings } from "../../utils/api/calls/users";
import { imageUpload } from "../../utils/api/imageUpload";

import "./index.css";

export default function UserSettingsPage({ user, setUser, setToken, token }) {
  let { schoolLink } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState(user.email);
  const [schoolData, setSchoolData] = useState({});
  const navigate = useNavigate();

  const handleProfilePicChange = async (e) => {
    const files = e.target.files;
    if (!files[0]) {
      return setError("Please select a file");
    }

    setIsLoading(true);

    await imageUpload(files)
      .then(async (images) => {
        let user1 = { ...user };
        let profilePic = images[0];

        user1.profilePic = profilePic;
        setUser(user1);

        setIsLoading(false);

        let response = await userSettings(
          { profilePic: user1.profilePic, email: user1.email },
          user1._id
        );
        if (response.success) {
          setError("");
          setUser((user) => ({
            ...user,
            profilePic: response.user.profilePic,
          }));
        } else {
          setError(response.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  const removeProfilePic = async () => {
    setIsLoading(true);

    let user1 = { ...user };
    user1.profilePic =
      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

    setUser(user1);

    setIsLoading(false);

    let response = await userSettings(
      { profilePic: user1.profilePic, email: user1.email },
      user1._id
    );
    if (response.success) {
      setError("");
      setUser((user) => ({ ...user, profilePic: response.user.profilePic }));
    } else {
      setError(response.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSave = async () => {
    let user1 = { ...user };
    user1.email = email;

    setUser(user1);

    let response = await userSettings(
      { profilePic: user1.profilePic, email: user1.email },
      user1._id
    );
    if (response.success) {
      setError("");
      setUser((user) => ({ ...user, email: response.user.email }));
    } else {
      setError(response.message);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    let response = await userLogout(token);
    if (response.success) {
      setIsLoading(false);
      setUser({});
      navigate("/");
    }
  };

  useEffect(() => {
    if (user.school === undefined || user.school.link !== schoolLink) {
      navigate(`/${user.school.link}/user/settings`);
    }
    console.log(user);
  }, []);

  return (
    <div className="user-settings-page">
      <div className="nav-wrapper">
        <nav className="nav">
          <div>
            <h1>Clubverse</h1>
          </div>
          <div className="nav-list">
            <div>
              <Link to="/">Home</Link>
            </div>

            <div
              className="nav-login"
              onClick={() => navigate(`/${user.school.link}/user/settings`)}
            >
              <a>
                <img src={user.profilePic} />
                {user.firstName} {user.lastName !== "" ? user.lastName : null}
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="user-settings-page-wrapper">
        <div className="user-settings-page-content">
          <div className="user-settings-title">
            <h1>User Settings</h1>
          </div>
          <div className="user-settings-page-content-body">
            <div className="user-settings-page-content-body-section-content">
              <div className="user-settings-page-content-body-section-content-item">
                <h3>Profile Picture</h3>
                {isLoading ? <Loading insideWrapper={false} /> : null}
                {error !== "" ? (
                  <p
                    style={{ marginTop: "5px", marginBottom: "5px" }}
                    className="error"
                  >
                    {error}
                  </p>
                ) : null}

                <div className="user-settings-page-content-body-section-content-item-content">
                  <div className="user-settings-page-content-body-section-content-item-content-pfp">
                    <img src={user.profilePic} />
                    <div className="user-settings-page-content-body-section-content-item-content-buttons">
                      <button
                        onClick={() =>
                          document.getElementById("btn_input").click()
                        }
                      >
                        Change
                      </button>
                      {user.profilePic !==
                      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" ? (
                        <button onClick={removeProfilePic}>Remove</button>
                      ) : null}

                      <input
                        type="file"
                        id="btn_input"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {user.email ? (
                <div className="user-settings-page-content-body-section-content-item">
                  <h3>Email</h3>
                  <div className="user-settings-page-content-body-section-content-item-content">
                    <input
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <button
                      disabled={email === user.email}
                      className={email === user.email ? "disabled" : ""}
                      onClick={handleEmailSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="user-settings-page-content-footer">
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
      {user.type === "admin" ? (
        <div className="user-settings-page-wrapper">
          <div className="user-settings-page-content">
            <div className="user-settings-title">
              <h1>School Settings</h1>
            </div>
            <div className="user-settings-page-content-body">
              <div className="user-settings-page-content-body-section-content">
                <div class="user-settings-page-school-info">
                  <label>Name: </label>
                  <input
                    name="name"
                    value={schoolData.name}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="user-settings-page-content-footer">
              {/* <button onClick={deleteSchool}>Delete School</button> */}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
