import { useAuth } from "../../hooks/useAuth";
import { AddIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, Button, Avatar, MenuList, MenuItem as MenuItemChakra, MenuDivider, Icon, Skeleton } from "@chakra-ui/react";

import { RiLogoutBoxLine } from 'react-icons/ri'

function MenuItem({ children, ...rest }) {
    return (
        <MenuItemChakra
            color="blackAlpha.800"
            fontSize="md"
            {...rest}
        >
            {children}
        </MenuItemChakra>
    )
}


export function SettingsMenu() {
    const { user, isLoading, signOut } = useAuth()

    return (
        <Menu
            autoSelect={false}
        >
            <MenuButton
                as={Button}
                p={0}
                h="100%"
                borderRadius="50%"
                backgroundColor="transparent"
            >
                <Skeleton isLoaded={!isLoading} >
                    <Avatar size="md" name={user?.displayName} src={user?.photoURL} />
                </Skeleton>
            </MenuButton>
            <MenuList  >

                <MenuItem icon={<AddIcon fontSize="md" />}>
                    Criar novo projeto
                </MenuItem>

                <MenuDivider />
                <MenuItem
                    icon={<Icon as={RiLogoutBoxLine} fontSize="md" />}
                    onClick={async () => await signOut()}
                >
                    Sair
                </MenuItem>
            </MenuList>
        </Menu>
    )
} 