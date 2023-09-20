import { Text, TextProps } from "@chakra-ui/react";

export function Logo(props: TextProps) {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      color="gray.700"
      {...props}
    >
      SWAP
      <Text as="span" ml="1" color="teal.500">.</Text>
    </Text>
  )
}