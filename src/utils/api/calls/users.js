const { API_URL } = require("../index");

export const userLogin = async (schoolId, username, password) => {
  let url = `${API_URL}/users/login/${schoolId}`;

  let data = {
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

export const userVerify = async (token) => {
  let url = `${API_URL}/users/verify?token=${token}`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const userLogout = async (token) => {
  let url = `${API_URL}/users/logout?token=${token}`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application",
    },
  });

  return response.json();
};

export const userDelete = async (userId, deleteId) => {
  let url = `${API_URL}/users/delete`;

  let data = {
    userId,
    deleteId,
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

export const userNotificationsManage = async (
  updatedNotifications,
  userId,
  clubId
) => {
  let url = `${API_URL}/users/notifications/manage`;

  let data = {
    updatedNotifications,
    userId,
    clubId,
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

export const userSettings = async (updatedSettings, userId) => {
  let url = `${API_URL}/users/settings`;

  let data = {
    updatedSettings,
    userId,
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
