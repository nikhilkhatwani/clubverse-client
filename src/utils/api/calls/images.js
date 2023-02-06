const { API_URL } = require("../index");

export const uploadImages = async (images) => {
  let data = {
    images,
  };

  let response = await fetch(`${API_URL}/images/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
