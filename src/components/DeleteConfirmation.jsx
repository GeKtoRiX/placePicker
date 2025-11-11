export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // onCancel -  Закрытие всплывающего окна <dialog>
  // onConfirm - Удаление изображения/ Закрытие всплывающего окна
  return (
    <div id='delete-confirmation'>
      <h2>Вы уверены?</h2>
      <p>Вы действительно хотите удалить это место?</p>
      <div id='confirmation-actions'>
        <button onClick={onCancel} className='button-text'>
          No
        </button>
        <button onClick={onConfirm} className='button'>
          Yes
        </button>
      </div>
    </div>
  );
}
