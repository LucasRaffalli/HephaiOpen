import Navbar from '@/components/navbar/Navbar';
import { Box, Flex } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";
import { motion, AnimatePresence } from "framer-motion";
import { ClientProvider } from '@/components/Clients/ClientContext';
import { useState, useEffect, useRef } from 'react';

function Layout() {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isHoverMode, setIsHoverMode] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();
    const resetTimeoutRef = useRef<NodeJS.Timeout>();
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const isMouseOverNavbar = useRef(false);
    const wasManuallyHidden = useRef(false);
    const mouseActivityTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                wasManuallyHidden.current = !isNavbarVisible;
                setIsHoverMode(false);
                setIsNavbarVisible(prev => !prev);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            lastMousePosition.current = { x: e.clientX, y: e.clientY };

            if (e.clientX < 25 && !isMouseOverNavbar.current && (!isNavbarVisible || wasManuallyHidden.current)) {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                }
                if (resetTimeoutRef.current) {
                    clearTimeout(resetTimeoutRef.current);
                }
                setIsHoverMode(true);
                setIsNavbarVisible(true);
            } else if (isHoverMode && !isMouseOverNavbar.current && e.clientX >= 100) {
                // Ne ferme que si la souris s'éloigne vraiment
                if (!hoverTimeoutRef.current) {
                    hoverTimeoutRef.current = setTimeout(() => {
                        setIsNavbarVisible(false);
                        setIsHoverMode(false);
                    }, 500);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('mousemove', handleMouseMove);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (mouseActivityTimeout.current) {
                clearTimeout(mouseActivityTimeout.current);
            }
        };
    }, [isHoverMode, isNavbarVisible]);

    useEffect(() => {
        if (isHoverMode) {
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }
        }
    }, [isHoverMode]);

    return (
        <Box className='layout' m={"0"} style={{ height: '100%' }}>
            <Flex direction="row" style={{ height: '100%', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
                <ClientProvider>
                    <AnimatePresence>
                        {isNavbarVisible && (
                            <motion.div
                                initial={{ x: -100, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: -100, opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeInOut" } }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                                className={isHoverMode ? 'navbar-absolute' : 'navbar-normal'}
                                onDoubleClick={() => {
                                    setIsHoverMode(false);
                                    setIsNavbarVisible(false);
                                }}
                                onMouseEnter={() => {
                                    isMouseOverNavbar.current = true;
                                    if (hoverTimeoutRef.current) {
                                        clearTimeout(hoverTimeoutRef.current);
                                    }
                                }}
                                onMouseLeave={() => {
                                    isMouseOverNavbar.current = false;
                                    if (isHoverMode) {
                                        hoverTimeoutRef.current = setTimeout(() => {
                                            setIsNavbarVisible(false);
                                            setIsHoverMode(false);
                                        }, 500);
                                    }
                                }}
                            >
                                <Navbar />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ x: -20, opacity: 0, scale: 0.95, skew: -2 }}
                        animate={{ x: 0, opacity: 1, scale: 1, skew: 0 }}
                        transition={{ duration: 0.3, delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        style={{ width: '100%', margin: "0rem 1rem 1rem 0.5rem", overflow: "hidden" }}
                    >
                        <Outlet />
                    </motion.div>
                </ClientProvider>
            </Flex>
        </Box>
    );
}

export default Layout;
