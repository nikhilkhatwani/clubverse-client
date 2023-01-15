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
  LoginPage,
  RegisterPage,
  SchoolPage,
  ClubPage,
  ClubMemberPage,
  ClubAttendancePage,
  ClubDuesPage,
  ClubSettingsPage,
  UserSettingsPage,
  SchoolSettingsPage,
} from "./pages";

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

  if (isLoading) {
    return <div>Loading...</div>;
    // replace with component of loading animation later
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route exact path="/">
            {/* Landing Page Component Here */}
          </Route>

          {/* Login Page*/}
          <Route
            exact
            path="/login"
            element={
              Object.keys(user).length !== 0 ? (
                <Navigate replace to={`/${user.school.link}`} />
              ) : (
                LoginPage
              )
            }
          />

          {/* Signup Page w/ user logged in */}
          <Route
            exact
            path="/register"
            element={
              Object.keys(user).length !== 0 ? (
                <Navigate replace to={`/${user.school.link}`} />
              ) : (
                RegisterPage
              )
            }
          />

          {/* School Page */}
          {/* NOTE: Need to check if this is user school in component */}
          <Route
            exact
            path="/:schoolLink"
            element={
              Object.keys(user).length !== 0 ? (
                SchoolPage
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
              Object.keys(user).length !== 0 ? (
                ClubPage
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Club Member Page */}
          {/* NOTE: Need to check if this is user school in component */}
          {/* NOTE: User needs to be a member, officer, sponsor, or admin of club. Check in component so views can be rendered */}
          <Route
            exact
            path="/:schoolLink/:clubId/members"
            element={
              Object.keys(user).length !== 0 ? (
                ClubMemberPage
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Club Attendance Page */}
          {/* NOTE: Need to check if this is user school in component */}
          {/* NOTE: User needs to be an officer, sponsor, or admin of club. Check in component so views can be rendered */}
          <Route
            exact
            path="/:schoolLink/:clubId/attendance"
            element={
              Object.keys(user).length !== 0 ? (
                ClubAttendancePage
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Club Dues Page */}
          {/* NOTE: Need to check if this is user school in component */}
          {/* NOTE: User needs to be an officer, sponsor, or admin of club. Check in component so views can be rendered */}
          <Route
            exact
            path="/:schoolLink/:clubId/dues"
            element={
              Object.keys(user).length !== 0 ? (
                ClubDuesPage
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Club Settings Page */}
          {/* NOTE: Need to check if this is user school in component */}
          {/* NOTE: User needs to be a member, officer, sponsor, or admin of club. Check in component so views can be rendered */}
          <Route
            exact
            path="/:schoolLink/:clubId/settings"
            element={
              Object.keys(user).length !== 0 ? (
                ClubSettingsPage
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* User Settings Page */}
          {/* NOTE: Need to check if this is user school in component */}
          <Route
            exact
            path="/:schoolLink/:userId/settings"
            element={
              Object.keys(user).length !== 0 ? (
                UserSettingsPage
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
              Object.keys(user).length !== 0 ? (
                user.type === "admin" ? (
                  SchoolSettingsPage
                ) : (
                  <Navigate replace to={`/${user.school.link}`} />
                )
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* 404 Page */}
          <Route exact path="/404">
            {/* 404 Page Component Here */}
          </Route>

          {/* Redirect 404 Route */}
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </Router>
    </>
  );
}
