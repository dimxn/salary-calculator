import { IoMdExit } from "react-icons/io";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineInfoCircle } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
import "./Navigation.css";
import { signOut } from "firebase/auth";

export const Navigation = ({ user, setUser, auth }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      setUser(null);
    } catch (error) {
      console.error("Помилка при виході з системи: ", error);
    }
  };

  return (
    <div className="navigation">
      <button className="navigation-button" onClick={() => navigate("/author")}>
        <AiOutlineInfoCircle size={30} />
        Автор
      </button>
      <button className="navigation-button" onClick={() => navigate("/")}>
        <AiOutlineHome size={30} />
        Головна
      </button>
      <button
        className="navigation-button"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        {user.photoURL ? (
          <div className="profile-avatar">
            <img src={user.photoURL} alt="avatar" />
          </div>
        ) : (
          <MdOutlineAccountCircle size={30} />
        )}
        Профіль
      </button>

      {showProfileMenu && (
        <div className="profile-menu">
          <img src={user.photoURL} alt="avatar" />
          <p>{user.displayName}</p>
          <hr />
          <button className="navigation-button" onClick={handleLogout}>
            <IoMdExit size={30} />
            Вихід
          </button>
        </div>
      )}
    </div>
  );
};
