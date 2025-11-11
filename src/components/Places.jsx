export default function Places({ title, places, fallbackText, onSelectPlace }) {
  // places - Массив выбранных мест.
  // onSelectPlace - Открытие <dialog> и получение текущего выбранного места
  // onSelectPlace - Добавление нового места в массив.
  const ulStyles =
    'border border-rose-500 max-w-7xl grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8 m-8 p-0 list-none';
  return (
    <section className='rounded-lg max-w-340 my-8 mx-auto p-4 border border-rose-500'>
      <h2>{title}</h2>
      {places.length === 0 && <p className='text-center'>{fallbackText}</p>}
      {places.length > 0 && (
        <ul className={ulStyles}>
          {places.map((place) => (
            <li key={place.id} className='place-item'>
              <button onClick={() => onSelectPlace(place.id)}>
                <img src={place.image.src} alt={place.image.alt} />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
