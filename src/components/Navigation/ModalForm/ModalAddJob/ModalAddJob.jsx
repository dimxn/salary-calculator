import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { toast } from "react-toastify";

export const ModalAddJob = ({ user, closeModal }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [workDays, setWorkDays] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bonusTitle, setBonusTitle] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!jobTitle) newErrors.jobTitle = "Назва робочого місця обов'язкова";
    if (!hourlyRate) newErrors.hourlyRate = "Введіть заробіток за годину";
    if (hourlyRate && isNaN(hourlyRate))
      newErrors.hourlyRate = "Заробіток за годину повинен бути числом";
    if (!workDays) newErrors.workDays = "Кількість робочих днів обов'язкова";
    if (workDays && isNaN(workDays))
      newErrors.workDays = "Кількість робочих днів повинна бути числом";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("Користувач не авторизований");
      toast.error("Користувач не авторизований");
      return;
    }

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const jobData = {
        jobTitle,
        workDays,
        hourlyRate,
        bonuses: [],
      };

      if (bonusTitle && bonusAmount) {
        jobData.bonuses.push({
          title: bonusTitle,
          amount: bonusAmount,
        });
      }

      const userJobsRef = collection(db, "users", user.uid, "jobs");
      await addDoc(userJobsRef, jobData);

      setJobTitle("");
      setWorkDays("");
      setHourlyRate("");
      setBonusTitle("");
      setBonusAmount("");
      setErrors({});

      closeModal();
      toast.success("Робота додана успішно!");
    } catch (error) {
      console.error("Помилка при додаванні роботи: ", error);
      toast.error("Помилка при додаванні роботи", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Додати робоче місце</h3>
      <input
        type="text"
        placeholder="Введіть назву робочого місця"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
      />
      {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
      <input
        type="text"
        placeholder="Введіть кількість робочих днів"
        value={workDays}
        onChange={(e) => setWorkDays(e.target.value)}
      />
      {errors.workDays && <p className="error">{errors.workDays}</p>}
      <input
        type="text"
        placeholder="Введіть заробіток за годину"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
      />
      {errors.hourlyRate && <p className="error">{errors.hourlyRate}</p>}
      <p>
        Якщо є якісь бонуси то введіть назву бонусу та ціну за виконання бонусу
      </p>
      <input
        type="text"
        placeholder="Введіть назву бонусу"
        value={bonusTitle}
        onChange={(e) => setBonusTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Введіть ціну за виконання бонусу"
        value={bonusAmount}
        onChange={(e) => setBonusAmount(e.target.value)}
      />
      <button type="submit">Додати</button>
    </form>
  );
};
