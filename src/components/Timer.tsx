import React, { useState, useEffect } from "react";

function Timer({ limitInMinutes, redirectPath, onExpiration, onUpdate }) {
  const [timer, setTimer] = useState(limitInMinutes * 60);
  const [mouseMoved, setMouseMoved] = useState(false);

  useEffect(() => {
    let interval = null;

    const handleMouseMove = () => {
      setMouseMoved(true);
    };

    const handleKeyboardActivity = () => {
      setMouseMoved(true);
    };

    const startTimer = () => {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    };

    const resetTimer = () => {
      setTimer(limitInMinutes * 60);
      setMouseMoved(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyboardActivity);
    document.addEventListener("keyup", handleKeyboardActivity);

    if (!mouseMoved) {
      startTimer();
    } else {
      resetTimer();
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyboardActivity);
      document.removeEventListener("keyup", handleKeyboardActivity);
    };
  }, [limitInMinutes, mouseMoved]);

  useEffect(() => {
    if (timer === 0) {
      onExpiration();
    }
  }, [timer, onExpiration]);

  useEffect(() => {
    if (onUpdate) {
      onUpdate(timer);
    }
  }, [timer, onUpdate]);

  return (
    <div>
      <h2>{formatTime(timer)}</h2>
    </div>
  );
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default Timer;
