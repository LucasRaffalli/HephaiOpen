import React from 'react';
import { motion } from 'framer-motion';

interface SlidingTextProps {
    text: string;
    containerWidth: number;
    speed?: number;
}

const SlidingText: React.FC<SlidingTextProps> = ({ text, containerWidth, speed = 5 }) => {
    const textWidth = text.length * 8;
    const shouldSlide = textWidth > containerWidth;

    return (
        <div style={{ overflow: 'hidden', width: containerWidth, whiteSpace: 'nowrap', position: 'relative', }}>
            <motion.div initial={{ x: 0 }} animate={shouldSlide ? { x: -textWidth } : { x: 0 }} transition={shouldSlide ? { repeat: Infinity, repeatType: 'loop', duration: speed, ease: 'linear', } : { duration: 0 }} style={{ display: 'inline-block' }}>
                {text}
            </motion.div>
        </div>
    );
};

export default SlidingText;
