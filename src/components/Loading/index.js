import "./index.css";

export default function Loading({ insideWrapper = true, size = "normal" }) {
  return (
    <>
      {insideWrapper ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={`spinner ${size}`}></div>
      )}
    </>
  );
}
