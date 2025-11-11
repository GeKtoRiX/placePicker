import { useRef, useState } from 'react';

// Массив шаблонных мест для посещения.
import { AVAILABLE_PLACES } from './data.js';

// Логотип приложения.
import logoImg from './assets/logo.png';

// Модальное окно <dialog>
import Modal from './components/Modal.jsx';
// Компонент вывода в модальном окне <dialog>
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
// Компонент рендера шаблонных мест для посещения.
import Places from './components/Places.jsx';

export default function App() {
  //Проброшенный хук useRef() в <dialog>
  const modal = useRef();
  // Проброшенный хук useRef() текущего выбранного места.
  const selectedPlace = useRef();
  // Массив выбранных мест.
  const [pickedPlaces, setPickedPlaces] = useState([]);

  // Добавление нового места в массив.
  function handleSelectPlace(id) {
    // Нажатие на место, которое ранее уже было выбрано.
    setPickedPlaces((prevPickedPlaces) => {
      // Проверяет, удовлетворяет ли хотя бы один элемент массива заданному условию(true/false).
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      // Поиск места в массиве по id в шаблонных местах для посещения.
      // Останавливает перебор сразу после нахождения первого подходящего элемента.
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      // Возврат модифицированного массива для перерендера.
      return [...prevPickedPlaces, place];
    });
  }

  // Открытие <dialog> и получение текущего выбранного места.
  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }
  // Закрытие всплывающего окна <dialog>
  function handleStopRemovePlace() {
    modal.current.close();
  }
  // Удаление места.
  function handleRemovePlace() {
    // Возврат модифицированного массива для перерендера.
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title='Я бы хотел(а) посетить...'
          fallbackText='Выберите места которые вы хотели бы посетить.'
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title='Available Places'
          places={AVAILABLE_PLACES}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}
