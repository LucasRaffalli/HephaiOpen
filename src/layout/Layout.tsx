import Navbar from '@/components/navbar/Navbar';
import { Box, Flex, ScrollArea } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";
import { motion } from "motion/react"


function Layout() {

    return (
        <Box className='layout'>
            <Flex direction="row" height="100vh">
                <Box m="2">
                    <Navbar />
                </Box>

                <Box m="2" width={"100%"} className='view__container'>
                    <ScrollArea type={'auto'} scrollbars="vertical">
                        <Outlet />
                    </ScrollArea>
                </Box>
            </Flex>
        </Box>
    );
}


export default Layout;