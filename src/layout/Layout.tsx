import Navbar from '@/components/navbar/Navbar';
import { Box, Flex, ScrollArea } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";
import { motion } from "motion/react"
import { ClientProvider } from '@/components/ClientContext';


function Layout() {

    return (
        <Box className='layout' m={"0"}>
            <Flex direction="row" height="100vh" >
                <ClientProvider>
                    <Box m={"4"} mr="2">
                        <Navbar />
                    </Box>

                    <Box m="4" ml="2" width={"100%"} className='view__container'>
                        <Outlet />
                    </Box>
                </ClientProvider>
            </Flex>
        </Box>
    );
}


export default Layout;