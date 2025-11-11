import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children }, ref) {
  // ref - Внешний проброшенный хук modal из App.jsx
  // { children } - Вложенный копонент <DeleteConfirmation>

  // Локальный хук доступа к <dialog>
  const dialog = useRef();

  // Функция выборочного доступа к <dialog>
  useImperativeHandle(ref, () => {
    return {
      // Открытие диалогового окна.
      open: () => {
        dialog.current.showModal();
      },
      // Закрытие диалогового окна.
      close: () => {
        dialog.current.close();
      },
    };
  });

  // Перемещение <dialog> в div 'modal'
  return createPortal(
    <dialog className='modal' ref={dialog}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
