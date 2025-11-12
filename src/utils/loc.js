/* 
Преобразование угола из градусов в радианы.
*/
function toRad(value) {
  return (value * Math.PI) / 180;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  // Радиус Земли в километрах (среднее значение).
  const R = 6371;
  // Разница широт между двумя точками, переведённая в радианы.
  const dLat = toRad(lat2 - lat1);
  // Разница долгот между двумя точками, переведённая в радианы.
  const dLon = toRad(lng2 - lng1);
  // Широта первой точки в радианах(нужна для формулы).
  const l1 = toRad(lat1);
  // Широта второй точки в радианах.
  const l2 = toRad(lat2);

  // Вычисление Расстоения от точки пользователя, до точки места.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export function sortPlacesByDistance(places, lat, lon) {
  // Создаёт копию исходного массива, чтобы не мутировать оригинал.
  const sortedPlaces = [...places];
  // Сортирует массив по возрастанию расстояния от (lat, lon) до каждой точки.
  sortedPlaces.sort((a, b) => {
    // Вычисляет расстояние от заданной точки до объекта A.
    const distanceA = calculateDistance(lat, lon, a.lat, a.lon);
    // Вычисляет расстояние от заданной точки до объекта B.
    const distanceB = calculateDistance(lat, lon, b.lat, b.lon);
    /* 
    Если результат отрицательный — А ближе.
    Если положительный — B ближе.
    */
    return distanceA - distanceB;
  });
  // Возврат отсортированного массива.
  return sortedPlaces;
}
