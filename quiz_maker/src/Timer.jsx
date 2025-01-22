import React, { useEffect, useState } from 'react';

const Timer = ({ duration }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    return <div>Time Left: {timeLeft} seconds</div>;
};

export default Timer;
