import { useEffect } from 'react';
import ProgressBar from './ProgressBar';

const TIMER = 5000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // onCancel -  Закрытие всплывающего окна <dialog>
  // onConfirm - Удаление изображения/ Закрытие всплывающего окна

  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id='delete-confirmation'>
      <h2>Вы уверены?</h2>
      <p>Вы действительно хотите удалить это место?</p>
      <div id='confirmation-actions'>
        <button onClick={onCancel} className='button-text'>
          Нет
        </button>
        <button onClick={onConfirm} className='button'>
          ДА
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
