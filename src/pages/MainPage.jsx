import React, { useState } from "react";
import { Navigation } from "../components/Navigation/Navigation";
import "./MainPage.css";
import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const MainPage = ({
  title,
  user,
  setUser,
  auth,
  children,
  isBack,
  onBack,
}) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setIsExiting(true);
      setTimeout(() => {
        navigate("/");
      }, 700); // Час відповідає анімації
    }
  };

  return (
    <div className="main-page">
      <div className="main-page__header">
        <div className="main-page__header-container">
          <motion.img
            src={LOGO}
            alt="logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Salary Calculator
          </motion.h3>
        </div>
        <motion.div
          className="main-page__wrapper"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          {...(isExiting && { animate: { opacity: 0, x: 20 } })}
        >
          {isBack && (
            <motion.button
              onClick={handleBack}
              className="main-page__back-button"
              aria-label="На головну"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                delay: 0.4,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ←
            </motion.button>
          )}
          <motion.h1
            className="main-page__title"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            {...(isExiting && { animate: { opacity: 0, x: 20 } })}
          >
            {title}
          </motion.h1>
        </motion.div>
      </div>
      <div className="main-page__container">
        <div className="main-page__content">{children}</div>
      </div>
      <Navigation user={user} setUser={setUser} auth={auth} />
    </div>
  );
};
