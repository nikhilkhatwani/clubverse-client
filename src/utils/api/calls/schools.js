const { API_URL } = require("../index");

export const schoolRegister = async (school) => {
  const { name, phoneNumber, email, state, username, password } = school;

  let url = `${API_URL}/schools/register`;

  let data = {
    name,
    phoneNumber,
    email,
    state,
    username,
    password,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const schoolUploadUserDB = async (userJSON, dbType, schoolID) => {
  let url = `${API_URL}/schools/upload-user-db`;

  let data = {
    userJSON,
    dbType,
    schoolID,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const schoolGetClubs = async (userId) => {
  let url = `${API_URL}/schools/get-clubs?userId=${userId}`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};
