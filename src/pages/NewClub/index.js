import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleKeyDown } from "../../utils/api";
import { clubCreate } from "../../utils/api/calls/clubs";

import "./index.css";

export default function NewClub({ user, setUser, setToken, token }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    room: "",
  });

  const onChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { name, description, room } = formData;

    if (!name || !description || !room) {
      setError("Please fill in all fields");
      return;
    } else if (name.length < 3 || name.length > 30) {
      setError("Club name must be between 3 and 30 characters");
      return;
    } else if (description.length < 3 || description.length > 200) {
      setError("Club description must be between 3 and 200 characters");
      return;
    } else {
      setIsButtonLoading(true);
      let response = await clubCreate({
        name,
        description,
        room,
        sponsorId: user._id,
      });
      if (response.success) {
        let newUser = response.user;
        newUser.school = response.school;
        setUser(newUser);

        setIsButtonLoading(false);
        navigate(`/${user.school.link}/${response.club._id}`);
      } else {
        setError(response.message);
        setIsButtonLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user || user.type !== "sponsor") {
      navigate("/");
      return;
    }
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
        <h2>New Club</h2>
        {error && <p className="error">{error}</p>}
        <div className="login-form-group">
          <input
            type="text"
            value={formData.name}
            placeholder="Club name"
            name="name"
            onChange={onChange}
            onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          />
          <input
            type="text"
            value={formData.description}
            placeholder="Club Description"
            name="description"
            onChange={onChange}
            onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          />
          <input
            type="text"
            value={formData.room}
            placeholder="Club Room #"
            name="room"
            onChange={onChange}
            onKeyDown={(e) => handleKeyDown(e, onSubmit)}
          />
          <button
            disabled={isButtonLoading}
            onClick={onSubmit}
            className="go-forward"
          >
            {isButtonLoading ? "Loading..." : "Create"}
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
