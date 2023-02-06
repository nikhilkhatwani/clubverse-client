import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";

import { getFromStorage, setInStorage } from "./utils/api/storage";
import { userVerify } from "./utils/api/calls/users";

import {
  LandingPage,
  LoginPage,
  RegisterPage,
  SchoolPage,
  ClubPage,
  UserSettingsPage,
  SchoolSettingsPage,
  NotFoundPage,
} from "./pages";
import { Loading } from "./components";

export default function App() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      const obj = getFromStorage("Clubverse");
      if (obj && obj.token) {
        let response = await userVerify(obj.token);
        if (response.success) {
          setToken(obj.token);
          setUser(response.user);
          setIsLoading(false);
        } else {
          setInStorage("Clubverse", { token: "" });
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    verifyUser();
  }, []);

  useEffect(() => {
    if (token === "") return;
    setInStorage("Clubverse", { token: token });
  }, [token]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route
            exact
            path="/"
            element={
              JSON.stringify(user) !== "{}" ? (
                <Navigate replace to={`/${user.school.link}`} />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Login Page*/}
          <Route
            exact
            path="/login"
            element={
              JSON.stringify(user) !== "{}" ? (
                <Navigate replace to={`/${user.school.link}`} />
              ) : (
                <LoginPage setToken={setToken} setUser={setUser} />
              )
            }
          />

          {/* Signup Page w/ user logged in */}
          <Route
            exact
            path="/register"
            element={
              JSON.stringify(user) !== "{}" ? (
                <Navigate replace to={`/${user.school.link}`} />
              ) : (
                <RegisterPage setToken={setToken} setUser={setUser} />
              )
            }
          />

          {/* 404 Page */}
          <Route exact path="/404" element={<NotFoundPage />} />

          {/* School Page */}
          {/* NOTE: Need to check if this is user school in component */}
          <Route
            exact
            path="/:schoolLink"
            element={
              JSON.stringify(user) !== "{}" ? (
                <SchoolPage
                  user={user}
                  setUser={setUser}
                  setToken={setToken}
                  token={token}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Club Page */}
          {/* NOTE: Need to check if this is user school in component */}
          {/* NOTE: Need to check if user is non member or member of club in component so different views can be rendered */}
          <Route
            exact
            path="/:schoolLink/:clubId"
            element={
              JSON.stringify(user) !== "{}" ? (
                <ClubPage
                  user={user}
                  setUser={setUser}
                  token={token}
                  setToken={setToken}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* User Settings Page */}
          {/* NOTE: Need to check if this is user school in component */}
          <Route
            exact
            path="/:schoolLink/user/settings"
            element={
              JSON.stringify(user) !== "{}" ? (
                <UserSettingsPage
                  user={user}
                  setUser={setUser}
                  token={token}
                  setToken={setToken}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* School Settings Page */}
          {/* NOTE: Need to check if this is user school in component */}
          <Route
            exact
            path="/:schoolLink/settings"
            element={
              JSON.stringify(user) !== "{}" ? (
                user.type === "admin" ? (
                  <SchoolSettingsPage />
                ) : (
                  <Navigate replace to={`/${user.school.link}`} />
                )
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Redirect 404 Route */}
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </Router>
    </>
  );
}
