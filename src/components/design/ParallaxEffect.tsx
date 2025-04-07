import React, { useEffect, useRef, useState } from 'react'
import '@/css/component/parallax.css'

interface ParallaxEffectProps {
    children: React.ReactNode;
    intensity?: number;
    perspective?: number;
    tiltMax?: number;
    deadzoneX?: number; // Pourcentage de la largeur de l'écran
    deadzoneY?: number; // Pourcentage de la hauteur de l'écran
    shadowColor?: string; // Couleur personnalisable pour l'ombre
}

export default function ParallaxEffect({
    children,
    intensity = 0.05,
    perspective = 1000,
    tiltMax = 15,
    deadzoneX = 0.4, // 40% de la largeur de l'écran
    deadzoneY = 0.4, // 40% de la hauteur de l'écran
    shadowColor = 'rgba(0, 0, 0, 0.3)' // Ombre douce par défaut
}: ParallaxEffectProps) {
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

                // Calcul des distances relatives
                const distanceX = Math.abs(e.clientX - centerX);
                const distanceY = Math.abs(e.clientY - centerY);

                // Deadzone
                const maxDistanceX = window.innerWidth * deadzoneX;
                const maxDistanceY = window.innerHeight * deadzoneY;
                if (distanceX > maxDistanceX || distanceY > maxDistanceY) {
                    setTransform({
                        x: 0, y: 0, rotateX: 0, rotateY: 0,
                        shadowX: 0, shadowY: 0, shadowBlur: 10, shadowOpacity: 0.3
                    });
                    return;
                }

                // Pourcentage de position (-1 à 1)
                const percentX = (e.clientX - centerX) / (rect.width / 2);
                const percentY = (e.clientY - centerY) / (rect.height / 2);

                // Atténuation
                const falloffX = Math.max(0, 1 - (distanceX / maxDistanceX));
                const falloffY = Math.max(0, 1 - (distanceY / maxDistanceY));
                const falloff = Math.min(falloffX, falloffY);

                // Transformations
                const rotateY = percentX * tiltMax * falloff;
                const rotateX = -percentY * tiltMax * falloff;
                const translateX = percentX * 20 * intensity * falloff;
                const translateY = percentY * 20 * intensity * falloff;

                // Ombre dynamique
                const shadowX = -percentX * 20 * falloff; // Inverse pour effet naturel
                const shadowY = -percentY * 20 * falloff;
                const shadowBlur = 30 - (falloff * 20); // Plus net au centre
                const shadowOpacity = 0.5 * falloff; // Plus fort au centre

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
            <div
                ref={parallaxRef}
                className="parallax-container"
                style={{
                    transform: `perspective(${perspective}px) 
                                rotateX(${transform.rotateX}deg) 
                                rotateY(${transform.rotateY}deg) 
                                translate3d(${transform.x}px, ${transform.y}px, 0)`
                }}
            >
                {children}
            </div>
        </div>
    );
}
