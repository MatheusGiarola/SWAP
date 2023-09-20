import { NextPage } from "next";
import Head from "next/head";

import { Avatar, Box, Divider, Flex, HStack, Select, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { UserCard } from "../components/UserCard";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const { success, redirect } = isAuthenticated()

    if (!isLoading) {
      if (!success) router.replace(redirect.path)
    }
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Usuários</title>
      </Head>

      <Flex direction="column" h="100vh">
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <SideBar />

          <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start" column={2}>
            <UserCard />
            <UserCard />
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard