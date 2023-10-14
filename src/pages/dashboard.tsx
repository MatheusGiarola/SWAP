import { NextPage } from "next";
import Head from "next/head";
import projects from '../../allPublicProjects-exemple.json';
import { ModalPage } from "../components/modalPage";

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
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { user, isLoading, isAuthenticated, authState } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 1;
  //const filteredProjects = Projects.filter((p) -> p. );
  const orderedProjects = projects.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const displayedProjects = orderedProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setCurrentPage(page);};
  
   const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const { success, redirect } = isAuthenticated()

    if (!isLoading) {
      if (!success) router.replace(redirect.path)
    }
  }, [isLoading, user]);//no isLoading do return eu mudei o spinner de lugar para visualizar o código pois o firebase fica carregando

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
              {displayedProjects.map((projects) => (
              
                <Flex>

                  <Card backgroundColor='gray.100'
                  borderColor='black'
                  border='2px'
                  maxWidth='150vh'
                  borderRadius='3xl'
                  key={projects.id}>

                    <CardHeader>
                      <Heading fontSize='xxx-large' 
                        color="teal.500"
                        marginStart='30px'
                        textAlign="center"
                      > {projects.title}</Heading>
                    </CardHeader>

                    <CardBody textAlign='justify'
                      marginLeft='30px'
                      alignSelf='center'>
                      <Image 
                        objectFit='contain'
                        alignContent='center'
                        alt={projects.title}
                        width='40rem'
                        height='20rem'
                        src='http://poiani.com.br/wp-content/uploads/2017/09/800x400-808x400.png'
                        margin="0 auto"
                      />

                      <br/>

                      <Text as='b' 
                      marginRight='30px'
                      noOfLines={[1, 2, 3, 4]}>{projects.description}</Text>

                      {projects.contributors.map((contributors) => (
                        <Text fontSize='xl'
                        color='teal.500'
                        textAlign='left'
                        >{contributors.name}</Text>
                      ))}
                    </CardBody>

                    <CardFooter alignSelf='center'>
                      <Button colorScheme='teal'
                      size='lg'
                      onClick={onOpen}> Ver projeto</Button>
                    </CardFooter>

                    <br/>

                  </Card>
                  <ModalPage projects={projects} isOpen={isOpen} onClose={onClose} />

                </Flex>
              ))}

              <Box mt="4" display="flex" justifyContent="center">
                <Pagination
                  totalCountOfRegisters={orderedProjects.length}
                  currentPage={currentPage}
                  registersPerPage={projectsPerPage}
                  onPageChange={handlePageChange}
                />
              </Box>
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