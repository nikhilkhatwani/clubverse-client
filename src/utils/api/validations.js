export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // Password must be between 8 and 25 characters and contain at least one number, one uppercase and one lowercase letter
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,25}$/;
  return re.test(String(password));
};

export const validatePhoneNumber = (phoneNumber) => {
  const re = /^\d{9,10}$/;
  return re.test(String(phoneNumber));
};
