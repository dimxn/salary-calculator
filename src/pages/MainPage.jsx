import React from "react";
import { Navigation } from "../components/Navigation/Navigation";
import "./MainPage.css";
import LOGO from "../assets/logo.png";
export const MainPage = ({ title, user, setUser, auth, children }) => {
  return (
    <div className="main-page">
      <div className="main-page__header">
        <div className="main-page__header-container">
          <img src={LOGO} alt="logo" />
          <h3>Salary Calculator</h3>
        </div>
        <h1 className="main-page__title">{title}</h1>
      </div>
      <div className="main-page__container">
        <div className="main-page__content">{children}</div>
      </div>
      <Navigation user={user} setUser={setUser} auth={auth} />
    </div>
  );
};
