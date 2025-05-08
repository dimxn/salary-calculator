import { BsGoogle } from "react-icons/bs";
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { app, db } from "../firebaseConfig";
import "./LoginPage.css";
import LOGO from "../assets/logo.png";
import { toast } from "react-toastify";

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
    <div className="login-page">
      <div className="container">
        <div className="logo">
          <img src={LOGO} alt="logo" />
        </div>
        <h1 className="title">Salary Calculator</h1>
        <div className="login-wrapper">
          <p className="description">
            Для початку роботи увійдіть за допомогою облікового запису Google
          </p>
          <button
            className="login-with-google-button"
            onClick={handleGoogleLogin}
          >
            Увійти з Google
            <BsGoogle style={{ marginLeft: 10 }} />
          </button>
        </div>
      </div>
    </div>
  );
};
