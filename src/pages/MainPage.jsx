import React from "react";
import { Navigation } from "../components/Navigation/Navigation";
import "./MainPage.css";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const MainPage = ({ title, user, setUser, auth, children, isBack }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="main-page__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="main-page__header-container">
          <motion.img
            src={LOGO}
            alt="logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Salary Calculator
          </motion.h3>
        </div>
        <motion.div
          className="main-page__wrapper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {isBack && (
            <motion.button
              onClick={() => navigate("/")}
              className="main-page__back-button"
              aria-label="На головну"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ←
            </motion.button>
          )}
          <motion.h1
            className="main-page__title"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {title}
          </motion.h1>
        </motion.div>
      </motion.div>
      <motion.div
        className="main-page__container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="main-page__content">{children}</div>
      </motion.div>
      <Navigation user={user} setUser={setUser} auth={auth} />
    </motion.div>
  );
};
