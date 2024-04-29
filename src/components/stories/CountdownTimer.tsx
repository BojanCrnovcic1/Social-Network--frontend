import React, { useEffect, useState } from 'react';

const CountdownTimer: React.FC<{ startTime: Date }> = ({ startTime }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((startTime.getTime() + 24 * 60 * 60 * 1000 - now.getTime()) / 1000);
      setRemainingTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <p>Time remaining: {formatTime(remainingTime)}</p>
    </div>
  );
};

export default CountdownTimer;

