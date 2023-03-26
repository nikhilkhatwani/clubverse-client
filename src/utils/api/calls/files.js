const { API_URL } = require("../index");

export const uploadImages = async (images) => {
  let data = {
    images,
  };

  let response = await fetch(`${API_URL}/files/upload/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

const stringify = (obj) => {
  const replacer = [];
  for (const key in obj) {
    replacer.push(key);
  }
  return JSON.stringify(obj, replacer);
};

export const uploadFile = async (file) => {
  let response = await fetch(`${API_URL}/files/upload/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringify(file),
  });

  return response.json();
};
