import "./ModalForm.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const ModalForm = ({ closeModal, children }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      closeModal();
    }, 400); // Час відповідає transition нижче
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="modal-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="modal-form__container"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <button
              className="modal-form__close-button"
              onClick={handleClose}
              type="button"
            >
              &times;
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
