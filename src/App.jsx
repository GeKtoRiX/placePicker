import { useRef, useState, useEffect, useCallback } from 'react';

// Массив шаблонных мест для посещения.
import { AVAILABLE_PLACES } from '@/data/data.js';
// Просчет расстояния от геолокации пользователя до геолокации мест.
import { sortPlacesByDistance } from '@/utils/loc.js';

// Логотип приложения.
import logoImg from './assets/img/logo.png';

// Модальное окно <dialog>
import Modal from './components/Modal.jsx';
// Компонент вывода в модальном окне <dialog>
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
// Компонент рендера шаблонных мест для посещения.
import Places from './components/Places.jsx';

// Масиив IDs(идентификаторов) выбранных пользователем.
const storeIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
// Массив выбранных мест пользователем.
const StorePlaces = storeIDs.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

export default function App() {
  // Проброшенный хук useRef() текущего выбранного места.
  const selectedPlace = useRef();
  // Хук отслеживания состояния открытия окна <dialog>
  const [isModelOpen, setIsModelOpen] = useState(false);
  // Отсортированный массив выбранных мест по геолокации пользователя.
  const [sortedPlaces, setSortedPlaces] = useState([]);
  // Массив выбранных мест.
  const [pickedPlaces, setPickedPlaces] = useState(StorePlaces);

  // Сортировка списка мест по геолокации пользователя.
  // Чем место ближе, тем более высокую строку оно занимает.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((userPosition) => {
      // latitude - широта(положение север/юг от экватора).
      // longitude- это долгота(положение восток/запад от нулевого меридиана).
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        userPosition.coords.latitude,
        userPosition.coords.longitude
      );
      setSortedPlaces(sortedPlaces);
    });
  }, []);

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

    // Парсинг(получение) массива ID(идентификаторов) из локального хранилища браузера.
    const storedIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    // Исключение дублирование уже существующих записей ID(идентификаторов).
    if (storedIDs.indexOf(id) === -1) {
      // Запись нового массива ID(идентификаторов) в локальное хранилища браузера элементов ID.
      localStorage.setItem('selectedPlaces', JSON.stringify([...storedIDs, id]));
    }
  }
  // Открытие <dialog> и получение текущего выбранного места.
  function handleStartRemovePlace(id) {
    setIsModelOpen(true);
    selectedPlace.current = id;
  }

  // Закрытие всплывающего окна <dialog>
  function handleStopRemovePlace() {
    setIsModelOpen(false);
  }

  const handleRemovePlace = useCallback(
    // Удаление места.
    function handleRemovePlace() {
      // Возврат модифицированного массива для перерендера.
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );

      // Удаление ID объекта из localStorage.
      const storedIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify(storedIDs.filter((id) => id !== selectedPlace.current))
      );
      setIsModelOpen(false);
    },
    []
  );

  return (
    <>
      <Modal open={isModelOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt='Stylized globe' />
        <h1>PlacePicker</h1>
        <p>
          Создайте свою личную коллекцию мест, которые вы хотели бы посетить или которые
          вы уже посетили.
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
          title='Доступные места'
          fallbackText='Сортирование мест по геолокации пользователя...'
          places={sortedPlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}
