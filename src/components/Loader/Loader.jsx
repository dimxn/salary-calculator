import "./Loader.css";

export const Loader = ({ loaderText }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <div className="calculator">
          <div className="screen" />
          <div className="buttons" />
        </div>
        <div className="coin" />
        <div className="loading-text">
          {loaderText}
          <span className="dots">...</span>
        </div>
      </div>
    </div>
  );
};
