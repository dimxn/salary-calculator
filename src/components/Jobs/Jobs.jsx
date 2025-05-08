import { AiOutlineDelete } from "react-icons/ai";
import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";
import { toast } from "react-toastify";

export const Jobs = ({
  user,
  db,
  loading,
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

  if (loading) {
    return <p>Завантаження...</p>;
  }

  if (jobs.length === 0) {
    return <p>Немає робочих місць</p>;
  }

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="jobs">
      <h2>Робочі місця</h2>
      <div className="jobs__list">
        <div className="main-page__content-buttons">
          {jobs.map((job) => (
            <div key={job.id} className="jobs__item">
              <button
                className="main-page__content-button"
                onClick={() => handleJobClick(job.id)}
              >
                {job.jobTitle}
              </button>
              {isDeleteMode && (
                <button
                  className="jobs__delete-button"
                  onClick={() => handleDelete(job.id)}
                >
                  <AiOutlineDelete />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
