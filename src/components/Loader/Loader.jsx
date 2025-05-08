import React from "react";
import "./Loader.css";

export const Loader = ({ loaderText }) => {
  return (
    <div className="loader1">
      <div class="loader">
        <div class="loader__image">
          <div class="loader__coin">
            <img
              src="https://www.dropbox.com/s/fzc3fidyxqbqhnj/loader-coin.png?raw=1"
              alt=""
            />
          </div>
          <div class="loader__hand">
            <img
              src="https://www.dropbox.com/s/y8uqvjn811z6npu/loader-hand.png?raw=1"
              alt=""
            />
          </div>
          <h2 className="loader__title">{loaderText}</h2>
        </div>
      </div>
    </div>
  );
};
