import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEscapeKey = () => {
    const navigate = useNavigate();
    const lastEscTime = useRef(0);
    const DOUBLE_PRESS_DELAY = 300;

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - lastEscTime.current;

                if (timeDiff < DOUBLE_PRESS_DELAY) {
                    navigate('/');
                    lastEscTime.current = 0;
                } else {
                    lastEscTime.current = currentTime;
                }
            }
        };

        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [navigate]);
};
