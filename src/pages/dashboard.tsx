import { NextPage } from "next";
import Head from "next/head";
import Projects from '../../allPublicProjects-exemple.json';

import { Center, 
  Flex, 
  SimpleGrid, 
  Spinner, 
  Card, 
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Image, 
  Text, 
  Button, 
  Box} from "@chakra-ui/react";
//import {Paginator} from 'chakra-paginator';
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { user, isLoading, isAuthenticated, authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const { success, redirect } = isAuthenticated()

    if (!isLoading) {
      if (!success) router.replace(redirect.path)
    }
  }, [isLoading, user]);//no isLoading do return eu mudei o spinner de lugar para visualizar o código pois o firebase fica carregando
  
  const orderedProjects = Projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const DisplayedProjects = orderedProjects.slice(0,5); 

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Flex direction="column" h="100vh">
        <Header />
 
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <SideBar />

          {isLoading
            ? (
            <SimpleGrid flex="1" gap="4" 
            padding='30px'>
              {DisplayedProjects.map((Projects) => (

                  <Card backgroundColor='gray.100'
                  borderColor='black'
                  border='2px'
                  maxWidth='150vh'
                  borderRadius='3xl'
                  key={Projects.id}>

                    <CardHeader>
                      <Heading fontSize='xxx-large' 
                        color="teal.500"
                        marginStart='30px'
                        textAlign="center"
                      > {Projects.title}</Heading>
                    </CardHeader>

                    <CardBody textAlign='justify'
                      marginLeft='30px'
                      alignSelf='center'>
                      <Image 
                        objectFit='contain'
                        alignContent='center'
                        alt={Projects.title}
                        width='30rem'
                        height='30rem'
                        src='https://www.solidscape.com/wp-content/uploads/2021/10/800x800-300x300.png'
                        margin="0 auto"
                      />

                      <br/>

                      <Text as='b' 
                      marginRight='30px'
                      noOfLines={[1, 2, 3, 4]}>{Projects.description}</Text>

                      {Projects.contributors.map((contributors) => (
                        <Text fontSize='xl'
                        color='teal.500'
                        textAlign='left'
                        >{contributors.name}</Text>
                      ))}
                    </CardBody>

                    <CardFooter alignSelf='center'>
                      <Button colorScheme='teal'
                      size='lg'> Ver projeto</Button>
                    </CardFooter>

                    <br/>

                  </Card>
                ))}
              </SimpleGrid>
            ): (
              <Center w="100%" h="100%">
                <Spinner size='xl' color="teal.500" />
              </Center>
          )}

          <Box as="aside" w="10rem" p='4' mr="8">
            <Text as='b' 
            color='GrayText'>Filtros</Text>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard