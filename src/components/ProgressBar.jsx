import { useEffect, useState } from 'react';

export default function ProgressBar({ timer }) {
  // Рендер состояния таймера обратного отсчета.
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}
