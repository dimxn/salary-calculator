import React, { useEffect, useState } from "react";
import { CgExtensionRemove } from "react-icons/cg";
import { MdOutlineDomainAdd } from "react-icons/md";
import { ModalForm } from "./components/Navigation/ModalForm/ModalForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "./firebaseConfig";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import "./App.css";
import { MainPage } from "./pages/MainPage";
import { Jobs } from "./components/Jobs/Jobs";
import { Job } from "./components/Jobs/Job/Job";
import { ModalAddJob } from "./components/Navigation/ModalForm/ModalAddJob/ModalAddJob";
import { Loader } from "./components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleDeleteMode = () => setIsDeleteMode((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const jobsRef = collection(db, "users", user.uid, "jobs");

    const unsubscribe = onSnapshot(
      jobsRef,
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
      },
      (error) => {
        console.error("Помилка при отриманні робочих місць: ", error);
        setError(error.message);
        toast.error(`Помилка: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <Loader loaderText="Завантаження..." />;
  }

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              user ? (
                <MainPage
                  title={`Вітаємо, ${user.displayName}`}
                  user={user}
                  setUser={setUser}
                  auth={auth}
                >
                  <h2>Оберіть дію:</h2>
                  <div className="main-page__content-buttons">
                    <button
                      className="main-page__content-button"
                      onClick={openModal}
                    >
                      <MdOutlineDomainAdd size={30} />
                      Додати робоче місце
                    </button>
                    {isModalOpen && (
                      <ModalForm closeModal={closeModal}>
                        <ModalAddJob user={user} closeModal={closeModal} />
                      </ModalForm>
                    )}
                    <button
                      className="main-page__content-button"
                      onClick={toggleDeleteMode}
                    >
                      <CgExtensionRemove size={30} />
                      Видалити робоче місце
                    </button>
                  </div>
                  <Jobs
                    jobs={jobs}
                    user={user}
                    db={db}
                    loading={loading}
                    isDeleteMode={isDeleteMode}
                    setIsDeleteMode={setIsDeleteMode}
                  />
                </MainPage>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/job/:jobId"
            element={<Job db={db} user={user} setUser={setUser} auth={auth} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
