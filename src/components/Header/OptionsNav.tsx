import { HStack, Icon, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { RiNotificationLine, RiAddCircleFill, RiUserAddLine } from "react-icons/ri";

export function OptionsNav() {
  return (
    <HStack
      spacing={["2", "4"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      borderRightWidth={1}
      borderColor="teal.700"
    >
      <Link href="/newProject">
        <IconButton
          aria-label='Adicionar novo projeto'
          icon={<RiNotificationLine fontSize="25px" />}
          color="teal.500"
          bg="transparent"
          _hover={{ color: 'teal.800' }}
        />
      </Link>
      <Link href="/newProject">
        <IconButton
          aria-label='Adicionar novo projeto'
          icon={<RiAddCircleFill fontSize="25px" />}
          size="sm"
          color="teal.500"
          bg="transparent"
          _hover={{ color: 'teal.800' }}
        />
      </Link>
    </HStack>

  )
}