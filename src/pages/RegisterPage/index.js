import React, { useEffect, useState } from "react";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../utils/api/validations";
import {
  schoolRegister,
  schoolUploadUserDB,
} from "../../utils/api/calls/schools";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx/xlsx.mjs";

import "./index.css";
import { states } from "../../utils/api/states";
import { userLogin } from "../../utils/api/calls/users";

export default function RegisterPage({ setToken, setUser }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    phoneNumber: "",
    schoolEmail: "",
    schoolState: "",
    username: "",
    password: "",
  });
  const [studentJSON, setStudentJSON] = useState([]);
  const [sponsorJSON, setSponsorJSON] = useState([]);
  const [school, setSchool] = useState({});

  const navigate = useNavigate();

  const onChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    if (name === "studentUpload") {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          setStudentJSON(json);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } else if (name === "sponsorUpload") {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          setSponsorJSON(json);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      const { schoolName, phoneNumber, schoolEmail } = formData;

      if (schoolName.length > 50 || schoolName.length < 3) {
        setError("School name must be between 3 and 50 characters");
      } else if (!validatePhoneNumber(phoneNumber)) {
        setError("Phone number must be 9 or 10 digits");
      } else if (!validateEmail(schoolEmail)) {
        setError("Email is not valid");
      } else {
        setError(null);
        setStep(2);
      }
    } else if (step === 2) {
      const { username, password } = formData;
      if (username.length < 3 || username.length > 25) {
        setError("Username must be between 3 and 25 characters");
      } else if (!validatePassword(password)) {
        setError(
          "Password must be between 8 and 25 characters and contain at least one number, one uppercase and one lowercase letter"
        );
      } else {
        setButtonLoading(true);
        let response = await schoolRegister({
          name: formData.schoolName,
          email: formData.schoolEmail,
          phoneNumber: formData.phoneNumber,
          state: formData.schoolState,
          username: formData.username,
          password: formData.password,
        });
        if (response.success) {
          setError(null);
          setSchool(response.school);
          setButtonLoading(false);
          setStep(3);
        } else {
          setError(response.message);
          setButtonLoading(false);
        }
      }
    } else if (step === 3 || step === 4) {
      const json = step === 3 ? studentJSON : sponsorJSON;
      if (json.length !== 0) {
        // check for duplicates
        let valueArr = json.map((item) => {
          console.log(item);
          return item.id;
        });

        let isDuplicate = valueArr.some((item, idx) => {
          return valueArr.indexOf(item) != idx;
        });

        if (isDuplicate) {
          console.log("Duplicate IDs found");
          setError("Duplicate IDs found");
        } else {
          setButtonLoading(true);
          let response = await schoolUploadUserDB(
            json,
            step === 3 ? "student" : "sponsor",
            school._id
          );

          if (response.success) {
            if (step + 1 === 5) {
              let response = await userLogin(
                school._id,
                formData.username,
                formData.password
              );
              if (response.success) {
                setUser(response.user);
                setToken(response.token);
                navigate(`/${school.link}`);
              } else {
                setError(response.message);
                navigate("/login");
              }
            } else {
              setError(null);
              setButtonLoading(false);
              setStep(step + 1);
            }
          } else {
            setError(response.message);
          }
        }
      }
    }
  };

  return (
    <div className="login-body">
      <div className="login-title">
        <div className="login-logo">
          <img className="login-img-ylw" src="/assets/logoyellow.png" alt="" />
          <img className="login-img-blue" src="/assets/logoblue.png" alt="" />
        </div>
        <div className="login-text">
          <h1>Clubverse</h1>
          <p>All the school's clubs accessible in one place</p>
        </div>
      </div>
      <div className="login-form">
        <h2>Register School</h2>
        <p>
          Not an admin? <Link to="/">Go back</Link>
        </p>
        {step === 3 && (
          <a
            target="_blank"
            href="/assets/user_data_excel_sample.png"
            className="db-image-hint"
          >
            Learn how the student database should look before uploading
          </a>
        )}
        {step === 4 && (
          <a
            target="_blank"
            href="/assets/sponsor_data_excel_sample.png"
            className="db-image-hint"
          >
            Learn how the sponsor database should look before uploading
          </a>
        )}
        {error && <p className="error">{error}</p>}
        <div className="login-form-group">
          {step === 1 ? (
            <>
              <input
                type="text"
                value={formData.schoolName}
                placeholder="School name"
                name="schoolName"
                onChange={onChange}
              />
              <input
                type="text"
                value={formData.phoneNumber}
                placeholder="School phone number"
                name="phoneNumber"
                onChange={onChange}
              />
              <input
                value={formData.schoolEmail}
                type="text"
                placeholder="School email"
                name="schoolEmail"
                onChange={onChange}
              />
              <select
                value={formData.schoolState}
                name="schoolState"
                id=""
                onChange={onChange}
              >
                <option value="" disabled>
                  Select a state
                </option>
                {states.map((state, i) => (
                  <option key={i} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <button className="go-forward" onClick={onSubmit}>
                Next step (1/4)
              </button>
            </>
          ) : step === 2 ? (
            <>
              <input
                type="text"
                value={formData.username}
                placeholder="Set admin username"
                name="username"
                onChange={onChange}
              />
              <input
                type="password"
                value={formData.password}
                placeholder="Set admin password"
                name="password"
                onChange={onChange}
              />

              <button
                className="go-forward"
                onClick={onSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Loading..." : "Next step (2/4)"}
              </button>
            </>
          ) : step === 3 ? (
            <>
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                name="studentUpload"
                id="studentUpload"
                placeholder="Upload student database from excel (.xlsx)"
                onChange={onChange}
                style={{ display: "none" }}
              />
              <label for="studentUpload">
                Upload student database from excel (.xlsx)
                <div className="upload-file">
                  <p>🡡</p>
                </div>
              </label>

              <button
                className="go-forward"
                onClick={onSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Loading..." : "Next step (3/4)"}
              </button>
            </>
          ) : step === 4 ? (
            <>
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                name="sponsorUpload"
                id="sponsorUpload"
                placeholder="Upload sponsor database from excel (.xlsx)"
                onChange={onChange}
                style={{ display: "none" }}
              />

              <label for="sponsorUpload">
                Upload sponsor database from excel (.xlsx)
                <div className="upload-file">
                  <p>🡡</p>
                </div>
              </label>
              <button
                className="go-forward"
                onClick={onSubmit}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Loading..." : "Next step (4/4)"}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
