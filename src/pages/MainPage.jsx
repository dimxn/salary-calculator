import React from "react";
import { Navigation } from "../components/Navigation/Navigation";
import "./MainPage.css";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export const MainPage = ({ title, user, setUser, auth, children, isBack }) => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="main-page__header">
        <div className="main-page__header-container">
          <img src={LOGO} alt="logo" />
          <h3>Salary Calculator</h3>
        </div>
        <div className="main-page__wrapper">
          {isBack && (
            <button
              onClick={() => navigate("/")}
              className="main-page__back-button"
              aria-label="На головну"
            >
              ←
            </button>
          )}
          <h1 className="main-page__title">{title}</h1>
        </div>
      </div>
      <div className="main-page__container">
        <div className="main-page__content">{children}</div>
      </div>
      <Navigation user={user} setUser={setUser} auth={auth} />
    </div>
  );
};
