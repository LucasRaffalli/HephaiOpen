import React, { useEffect, useRef, useState } from 'react'
import '@/css/parallax.css'

interface ParallaxEffectProps {
    children: React.ReactNode;
    intensity?: number;
    perspective?: number;
    tiltMax?: number;
    deadzoneX?: number;
    deadzoneY?: number;
    shadowColor?: string;
}

export default function ParallaxEffect({ children, intensity = 0.05, perspective = 1000, tiltMax = 15, deadzoneX = 0.4, deadzoneY = 0.4, shadowColor = 'rgba(0, 0, 0, 0.3)' }: ParallaxEffectProps) {
    const parallaxRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 10,
        shadowOpacity: 0.3
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (parallaxRef.current) {
                const rect = parallaxRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distanceX = Math.abs(e.clientX - centerX);
                const distanceY = Math.abs(e.clientY - centerY);

                const maxDistanceX = window.innerWidth * deadzoneX;
                const maxDistanceY = window.innerHeight * deadzoneY;
                if (distanceX > maxDistanceX || distanceY > maxDistanceY) {
                    setTransform({
                        x: 0, y: 0, rotateX: 0, rotateY: 0,
                        shadowX: 0, shadowY: 0, shadowBlur: 10, shadowOpacity: 0.3
                    });
                    return;
                }

                const percentX = (e.clientX - centerX) / (rect.width / 2);
                const percentY = (e.clientY - centerY) / (rect.height / 2);

                const falloffX = Math.max(0, 1 - (distanceX / maxDistanceX));
                const falloffY = Math.max(0, 1 - (distanceY / maxDistanceY));
                const falloff = Math.min(falloffX, falloffY);

                const rotateY = percentX * tiltMax * falloff;
                const rotateX = -percentY * tiltMax * falloff;
                const translateX = percentX * 20 * intensity * falloff;
                const translateY = percentY * 20 * intensity * falloff;

                const shadowX = -percentX * 20 * falloff;
                const shadowY = -percentY * 20 * falloff;
                const shadowBlur = 30 - (falloff * 20);
                const shadowOpacity = 0.5 * falloff;

                setTransform({
                    x: translateX, y: translateY, rotateX, rotateY,
                    shadowX, shadowY, shadowBlur, shadowOpacity
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [intensity, tiltMax, deadzoneX, deadzoneY]);

    return (
        <div className="parallax-wrapper" >
            <div ref={parallaxRef} className="parallax-container" style={{ transform: `perspective(${perspective}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translate3d(${transform.x}px, ${transform.y}px, 0)` }}>
                {children}
            </div>
        </div>
    );
}
