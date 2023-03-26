export const testing = false;

export const API_URL = testing
  ? "http://localhost:8080/api"
  : "https://clubverse.vercel.app/api" || "https://api.clubverse.us/api";

export const handleKeyDown = (e, func) => {
  if (e.key === "Enter") {
    func(e);
  }
};
