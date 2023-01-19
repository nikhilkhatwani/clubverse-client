import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loading } from "../../components";
import { handleKeyDown } from "../../utils/api";
import { getSchools } from "../../utils/api/calls/schools";
import { userLogin } from "../../utils/api/calls/users";

import "./index.css";

export default function LoginPage({ setToken, setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    school: "",
  });
  const [schools, setSchools] = useState([]);
  const [schoolNames, setSchoolNames] = useState([]);
  const [error, setError] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const onChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { username, password, school } = formData;

    if (!username || !password || !school) {
      setError("Please fill in all fields");
      return;
    }

    const schoolSelected = schools.find(
      (school) => school.name === formData.school
    );

    if (!schoolSelected) {
      setError("Please select a school");
      return;
    }

    setIsButtonLoading(true);
    let response = await userLogin(schoolSelected._id, username, password);
    if (response.success) {
      setIsButtonLoading(false);
      setError(null);
      setToken(response.token);
      setUser(response.user);
      navigate(`/${response.user.school.link}`);
    } else {
      setIsButtonLoading(false);
      setError(response.message);
    }
  };

  useEffect(() => {
    async function getAllSchools() {
      const response = await getSchools();
      if (response.success) {
        const schoolNames = response.schools.map((school) => school.name);
        setSchoolNames(schoolNames);
        setSchools(response.schools);
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    }

    getAllSchools();
  }, []);

  const goToBottomOfForm = () => {
    console.log("scrolling");

    const form = document.querySelector(".login-form");
    console.log(form);
    form.scrollTo({ top: form.scrollHeight, behavior: "smooth" });
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
        <h2>Login</h2>
        <p>
          School not listed? <Link to="/register">Register as an admin</Link>
        </p>
        {error && <p className="error">{error}</p>}
        <div className="login-form-group">
          <select
            name="school"
            id=""
            value={formData.school}
            onChange={onChange}
          >
            <option value="" disabled>
              Select school
            </option>
            {schools.map((school, i) => (
              <option key={i} value={school.name}>
                {school.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={formData.username}
            placeholder="Username"
            name="username"
            onChange={onChange}
            onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          />
          <input
            type="password"
            value={formData.password}
            placeholder="Password"
            name="password"
            onChange={onChange}
            onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          />

          <button
            disabled={isButtonLoading}
            onClick={onSubmit}
            className="go-forward"
          >
            {isButtonLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>

      <button onClick={goToBottomOfForm} className="form-go-down-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-down"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
    </div>
  );
}
