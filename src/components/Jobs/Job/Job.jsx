import { FaHandHoldingUsd } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { AiOutlineDollar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { MainPage } from "../../../pages/MainPage";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  updateDoc as updateSessionDoc,
} from "firebase/firestore";
import { PlayArrow, Stop } from "@mui/icons-material";
import { Loader } from "../../Loader/Loader";
import "./Job.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

export const Job = ({ db, user, setUser, auth }) => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [editingBonuses, setEditingBonuses] = useState({});
  const [openSummary, setOpenSummary] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const hasBonuses = job?.bonuses && job.bonuses.length > 0;

  const jobRef = user ? doc(db, "users", user.uid, "jobs", jobId) : null;
  const sessionsRef = user
    ? collection(db, "users", user.uid, "jobs", jobId, "sessions")
    : null;

  useEffect(() => {
    if (!jobRef) return;

    const unsubscribe = onSnapshot(jobRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setJob({ id: snapshot.id, ...data });

        const timer = data.timer || {};
        setStartTime(timer.startTime || null);
        setIsRunning(timer.isRunning || false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [jobRef]);

  useEffect(() => {
    if (!sessionsRef) return;

    const fetchSessions = async () => {
      const q = query(sessionsRef, orderBy("endTime", "desc"));
      const snapshot = await getDocs(q);
      const sessionList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(sessionList);
    };

    fetchSessions();
  }, [sessionsRef, loading]);

  useEffect(() => {
    let timer;

    if (isRunning && startTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const started = new Date(startTime).getTime();
        const seconds = Math.floor((now - started) / 1000);
        setElapsedSeconds(seconds);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  const startWork = async () => {
    const now = new Date().toISOString();
    await updateDoc(jobRef, {
      timer: {
        isRunning: true,
        startTime: now,
      },
    });
  };

  const stopWork = async () => {
    const now = new Date();
    const seconds = elapsedSeconds;
    const hours = seconds / 3600;
    const earnings = +(hours * job.hourlyRate).toFixed(2);

    await addDoc(sessionsRef, {
      startTime,
      endTime: now.toISOString(),
      duration: seconds,
      earnings,
      bonusesCount: 0,
    });

    await updateDoc(jobRef, {
      timer: {
        isRunning: false,
        startTime: null,
      },
    });

    setElapsedSeconds(0);
  };

  const handleBonusChange = (id, value) => {
    setEditingBonuses({ ...editingBonuses, [id]: value });
  };

  const saveBonus = async (id) => {
    const bonusesCount = Number(editingBonuses[id]) || 0;
    const sessionDoc = doc(sessionsRef, id);
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    // Сума всіх бонусів із job.bonuses
    const totalBonusValue = job.bonuses.reduce((sum, b) => sum + b.amount, 0);

    // Вираховуємо нову зарплату
    const baseEarnings =
      session.earnings - (session.bonusesCount || 0) * totalBonusValue; // прибираємо старі бонуси

    const updatedEarnings = baseEarnings + bonusesCount * totalBonusValue;

    await updateSessionDoc(sessionDoc, {
      bonusesCount,
      earnings: Number(updatedEarnings.toFixed(2)),
    });

    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              bonusesCount,
              earnings: Number(updatedEarnings.toFixed(2)),
            }
          : s
      )
    );
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString("uk-UA", { weekday: "long" })}`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Функція для плавного виходу
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/");
    }, 400);
  };

  if (loading) {
    return <Loader loaderText="Завантаження робочого місця" />;
  }

  if (!job) {
    return (
      <MainPage
        title="Упс! :("
        user={user}
        setUser={setUser}
        auth={auth}
        isBack={true}
        onBack={handleBack}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          {...(isExiting && { animate: { opacity: 0, y: 30 } })}
        >
          <h1>Робоче місце не знайдено!</h1>
          <h2>Перейдіть на головну сторінку :)</h2>
        </motion.div>
      </MainPage>
    );
  }

  return (
    <MainPage
      title={job.jobTitle}
      user={user}
      setUser={setUser}
      auth={auth}
      isBack={true}
      onBack={handleBack}
    >
      <motion.section
        className="job-timer"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        {...(isExiting && { animate: { opacity: 0, y: 30 } })}
      >
        <h2>Робочий таймер</h2>
        <div className="job-timer__clock">
          {Math.floor(elapsedSeconds / 3600)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor((elapsedSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0")}
          :{(elapsedSeconds % 60).toString().padStart(2, "0")}
        </div>
        <p className="job-timer__earnings">
          Зароблено:{" "}
          <strong>
            {((elapsedSeconds / 3600) * job.hourlyRate).toFixed(2)} грн
          </strong>
        </p>
        {!isRunning ? (
          <button className="job-timer__btn start" onClick={startWork}>
            Почати роботу
          </button>
        ) : (
          <button className="job-timer__btn stop" onClick={stopWork}>
            Завершити роботу
          </button>
        )}
      </motion.section>
      <motion.section
        className="job-info"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        {...(isExiting && { animate: { opacity: 0, y: 30 } })}
      >
        <div className="job-info__wrapper">
          <div className="job-info__card">
            <div className="icon">
              <BiCalendar size={24} />
            </div>
            <div className="job-info__card-value">
              <h3>{job.workDays}</h3>
              <p>Робочих днів</p>
            </div>
          </div>
          <div className="job-info__card">
            <div className="icon">
              <AiOutlineDollar size={24} />
            </div>
            <div className="job-info__card-value">
              <h3>
                {job.hourlyRate} <p>грн/год</p>
              </h3>
              <p>Погодинна ставка</p>
            </div>
          </div>
          {job.bonuses &&
            job.bonuses.map((bonus, idx) => (
              <div className="job-info__card" key={bonus.title + idx}>
                <div className="icon">
                  <FaHandHoldingUsd size={24} />
                </div>
                <div className="job-info__card-value">
                  <h3>{bonus.amount} грн</h3>
                  <p>{bonus.title}</p>
                </div>
              </div>
            ))}
        </div>
      </motion.section>
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          {...(isExiting && { animate: { opacity: 0, y: 20 } })}
        >
          <Button
            variant="contained"
            color="primary"
            className="show-summary-btn"
            onClick={() => setOpenSummary(true)}
          >
            Показати підсумки
          </Button>
        </motion.div>
      )}
      <motion.section
        className="sessions-history"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        {...(isExiting && { animate: { opacity: 0, y: 30 } })}
      >
        <h3>Історія сесій</h3>
        {sessions.length === 0 ? (
          <p className="no-sessions-msg">
            Ще не було жодної сесії. Почніть роботу, щоб побачити історію!
          </p>
        ) : (
          <TableContainer className="sessions-container" component={Paper}>
            <Table className="sessions-table" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>День</TableCell>
                  <TableCell>Початок роботи</TableCell>
                  <TableCell>Кінець роботи</TableCell>
                  {hasBonuses && <TableCell>Бонуси</TableCell>}
                  <TableCell>Заробіток</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{formatDateTime(session.startTime)}</TableCell>
                    <TableCell>{formatTime(session.startTime)}</TableCell>
                    <TableCell>{formatTime(session.endTime)}</TableCell>
                    {hasBonuses && (
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          variant="outlined"
                          value={
                            editingBonuses[session.id] !== undefined
                              ? editingBonuses[session.id]
                              : session.bonusesCount || 0
                          }
                          onChange={(e) =>
                            handleBonusChange(session.id, e.target.value)
                          }
                          onBlur={() => saveBonus(session.id)}
                          inputProps={{ min: 0, style: { width: 60 } }}
                          className="bonus-input"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <strong>{session.earnings} грн</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Dialog
          open={openSummary}
          onClose={() => setOpenSummary(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Підсумки</DialogTitle>
          <DialogContent>
            {sessions.length === 0 ? (
              <p className="no-summary-msg">
                Немає даних для підсумків — ще не було жодної сесії.
              </p>
            ) : (
              <table className="summary-table" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>Сесій</td>
                    <td>{sessions.length}</td>
                  </tr>
                  <tr>
                    <td>Зароблено загалом</td>
                    <td>
                      {sessions
                        .reduce((sum, s) => sum + (s.earnings || 0), 0)
                        .toFixed(2)}{" "}
                      грн
                    </td>
                  </tr>
                  {hasBonuses && (
                    <tr>
                      <td>Усього бонусів</td>
                      <td>
                        {sessions.reduce(
                          (sum, s) => sum + (s.bonusesCount || 0),
                          0
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSummary(false)} color="primary">
              Закрити
            </Button>
          </DialogActions>
        </Dialog>
      </motion.section>
    </MainPage>
  );
};
