import "./ModalForm.css";

export const ModalForm = ({ closeModal, children }) => {
  return (
    <div className="modal-form">
      <div className="modal-form__container">
        <button
          className="modal-form__close-button"
          onClick={closeModal}
          type="button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
