import { AiOutlineDelete } from "react-icons/ai";
import React, { useEffect } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";
import { toast } from "react-toastify";
import { Loader } from "../Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";

export const Jobs = ({
  user,
  db,
  loading,
  setLoading,
  jobs,
  isDeleteMode,
  setIsDeleteMode,
}) => {
  const navigate = useNavigate();
  const handleDelete = async (jobId) => {
    if (!user) {
      console.error("Користувач не авторизований");
      toast.error("Користувач не авторизований");
      return;
    }
    toast.info(
      "Видалення робочого місця... Натисніть ще раз для підтвердження",
      { autoClose: 3000 }
    );
    // Додаємо підтвердження через повторне натискання
    if (handleDelete.lastJobId === jobId) {
      try {
        const jobDocRef = doc(db, "users", user.uid, "jobs", jobId);
        await deleteDoc(jobDocRef);
        toast.success("Робоче місце видалено");
        setIsDeleteMode(false);
        handleDelete.lastJobId = null;
      } catch (error) {
        console.error("Помилка при видаленні робочого місця: ", error);
        toast.error("Помилка при видаленні робочого місця");
      }
    } else {
      handleDelete.lastJobId = jobId;
      setTimeout(() => {
        handleDelete.lastJobId = null;
      }, 3000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader loaderText="Завантаження робочого місця..." />;
  }

  if (jobs.length === 0) {
    return <p>Немає робочих місць</p>;
  }

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <motion.div
      className="jobs"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Робочі місця
      </motion.h2>
      <div className="jobs__list">
        <div className="main-page__content-buttons">
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="jobs__item"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <motion.div
                  layout
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <motion.button
                    className="main-page__content-button"
                    onClick={() => handleJobClick(job.id)}
                    layout
                    style={{
                      width: isDeleteMode ? "calc(100% - 60px)" : "100%",
                      marginRight: isDeleteMode ? 12 : 0,
                      borderTopRightRadius: isDeleteMode ? 0 : "",
                      borderBottomRightRadius: isDeleteMode ? 0 : "",
                      transition:
                        "width 0.4s cubic-bezier(0.4,0,0.2,1), margin-right 0.4s cubic-bezier(0.4,0,0.2,1), border-radius 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    {job.jobTitle}
                  </motion.button>
                  <AnimatePresence>
                    {isDeleteMode && (
                      <motion.button
                        className="jobs__delete-button"
                        onClick={() => handleDelete(job.id)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        whileHover={{ scale: 1.15, color: "#d32f2f" }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          marginLeft: 0,
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          width: 60,
                          minWidth: 60,
                          height: 48,
                        }}
                      >
                        <AiOutlineDelete />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
