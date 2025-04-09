import Navbar from '@/components/navbar/Navbar';
import { Box, Flex, ScrollArea } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";
import { motion, AnimatePresence } from "framer-motion"
import { ClientProvider } from '@/components/Clients/ClientContext';
import { useState, useEffect, useRef } from 'react';

function Layout() {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isHoverMode, setIsHoverMode] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();
    const isMouseOverNavbar = useRef(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setIsHoverMode(false);
                setIsNavbarVisible(prev => !prev);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientX < 50 && !isMouseOverNavbar.current && !isNavbarVisible) {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                }
                setIsHoverMode(true);
                setIsNavbarVisible(true);
            } else if (isHoverMode && !isMouseOverNavbar.current && e.clientX >= 25) {
                hoverTimeoutRef.current = setTimeout(() => {
                    setIsNavbarVisible(false);
                    setIsHoverMode(false);
                }, 300);
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
        };
    }, [isHoverMode, isNavbarVisible]);

    return (
        <Box className='layout' m={"0"}>
            <Flex direction="row" height="100vh" position={"relative"}>
                <ClientProvider>
                    <AnimatePresence>
                        {isNavbarVisible && (
                            <motion.div
                                initial={{ x: -100, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ 
                                    x: -100, 
                                    opacity: 0, 
                                    scale: 0.9,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeInOut"
                                    }
                                }}
                                transition={{
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }}
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
                                        }, 300);
                                    }
                                }}
                            >
                                <Navbar />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{
                            x: -20,
                            opacity: 0,
                            scale: 0.95,
                            skew: -2
                        }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            scale: 1,
                            skew: 0
                        }}
                        transition={{
                            duration: 0.3,
                            delay: 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        style={{
                            width: '100%',
                            margin: "1rem",
                            marginLeft: "0.5rem",
                            overflow: "hidden"
                        }}
                    >
                        <Outlet />
                    </motion.div>
                </ClientProvider>
            </Flex>
        </Box>
    );
}

export default Layout;