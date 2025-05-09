import { BsGoogle } from "react-icons/bs";
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { app, db } from "../firebaseConfig";
import "./LoginPage.css";
import LOGO from "../assets/logo.png";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const auth = getAuth(app);

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(collection(db, "users"), user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      navigate("/");
    } catch (error) {
      console.error("Помилка авторизації через Google: ", error);
      toast.error("Помилка авторизації через Google");
    }
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <motion.div
          className="logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src={LOGO} alt="logo" />
        </motion.div>
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Salary Calculator
        </motion.h1>
        <motion.div
          className="login-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="description">
            Для початку роботи увійдіть за допомогою облікового запису Google
          </p>
          <motion.button
            className="login-with-google-button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Увійти з Google
            <BsGoogle style={{ marginLeft: 10 }} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
