import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useBreakpointValue } from "@chakra-ui/react";
import { useSideBarDrawer } from "../../contexts/SidebarDrawerContext";
import SideBarNav from "./SideBarNav";

export function SideBar() {
    const { isOpen, onClose } = useSideBarDrawer()

    const isDrawerSideBar = useBreakpointValue({
        base: true,
        lg: false,
    })

    if (isDrawerSideBar) {
        return (
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} >
                <DrawerOverlay >
                    <DrawerContent bg="teal.900" p="4">
                        <DrawerCloseButton mt="6" />
                        <DrawerHeader color="white">Navegação</DrawerHeader>
                        <DrawerBody>
                            <SideBarNav />
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        )
    }
    return (
        <Box as="aside" w="64" mr="8">
            <SideBarNav />
        </Box >
    )
}