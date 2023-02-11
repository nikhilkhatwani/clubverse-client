import "./index.css";

export default function Loading({
  insideWrapper = true,
  size = "normal",
  color = "#004e78",
}) {
  return (
    <>
      {insideWrapper ? (
        <div className="loading-wrapper">
          <div
            className="spinner"
            style={{ borderColor: `${color} transparent ${color} transparent` }}
          ></div>
        </div>
      ) : (
        <div
          className={`spinner ${size}`}
          style={{ borderColor: `${color} transparent ${color} transparent` }}
        ></div>
      )}
    </>
  );
}
