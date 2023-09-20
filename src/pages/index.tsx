import { NextPage } from "next";
import Head from "next/head";

import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/signIn')
  }, [])

  return (
    <>
      <Head>
        <title>Bem-vindo ao SWAP</title>
      </Head>

      <Flex direction="column" h="100vh">
        <Heading>Home page</Heading>
      </Flex>
    </>
  )
}


export default Home