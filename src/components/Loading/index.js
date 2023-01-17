import "./index.css";

export default function Loading({ insideWrapper = true }) {
  return (
    <>
      {insideWrapper ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="spinner small"></div>
      )}
    </>
  );
}
