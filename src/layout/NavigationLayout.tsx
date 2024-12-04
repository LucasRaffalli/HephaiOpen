import { Box, Flex, ScrollArea } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import "../css/layout.css";


function NavigationLayout() {
    return (
        <Box height={"100%"} style={{"backgroundColor":"blue"}}>
            <Outlet />
        </Box>
    );
}


export default NavigationLayout;