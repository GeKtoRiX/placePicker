import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children }) {
  // ref - Внешний проброшенный хук modal из App.jsx
  // { children } - Вложенный копонент <DeleteConfirmation>

  // Локальный хук доступа к <dialog>
  const dialog = useRef();

  useEffect(() => {
    open ? dialog.current.showModal() : dialog.current.close();
  }, [open]);

  // Перемещение <dialog> в div 'modal'
  return createPortal(
    <dialog className='modal' ref={dialog}>
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
