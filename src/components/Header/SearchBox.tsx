import { Flex, Input, Icon } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { RiSearchLine } from "react-icons/ri";

export function SearchBox() {
  const theme = useTheme()

  return (
    <Flex
      as="label"
      flex="1"
      py="2"
      px="4"
      ml="6"
      maxWidth={400}
      align="center"
      alignSelf="center"
      color="gray.200"
      position="relative"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0px 0px 7px -2px rgba(0,0,0,0.2)"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        mr="4"
        placeholder="Buscar na plataforma"
        _placeholder={{ color: 'teal.700' }}
      />
      <Icon as={RiSearchLine} fontSize="20" color="teal.700"/>
    </Flex>
  )
}