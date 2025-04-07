import Navbar from '@/components/navbar/Navbar';
import { Box, Flex, ScrollArea } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";
import { motion } from "framer-motion"
import { ClientProvider } from '@/components/Clients/ClientContext';

function Layout() {
    return (
        <Box className='layout' m={"0"}>
            <Flex direction="row" height="100vh" >
                <ClientProvider>
                    <motion.div
                        initial={{ x: -100, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{ 
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        style={{ margin: "1rem", marginRight: "0.5rem" }}
                    >
                        <Navbar />
                    </motion.div>

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