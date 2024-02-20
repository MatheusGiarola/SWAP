import { NextPage } from "next";
import Head from "next/head";
import projects from '../../projects.json';
import { ModalPage } from "../components/modalPage";
import axios from "axios";

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
  Input,
  Stack,
  Link,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { user, isLoading, isAuthenticated, authState } = useAuth()

  const [nome, setNome] = useState('')
  const [patrocinador, setPatrocinador] = useState('')
  const [curso, setCurso] = useState('')
  const [dInicio, setDInicio] = useState('')
  const [dFinal, setDFinal] = useState('')
  const [autor, setAutor] = useState('')
  const [projetos, setProjetos]=useState(projects)

  const numDInicio= isNaN(parseInt(dInicio))? null : parseInt(dInicio);
  const numDFinal= isNaN(parseInt(dFinal))? null : parseInt(dFinal);
  
  const handleSubmit= async (event) =>{
    event.preventDefault();
    try {
      const res = await fetch('/api/projects', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({nome,patrocinador,curso,numDInicio,numDFinal,autor})
      })
      if (res.ok) {
        const resposta= await res.json();
        setProjetos(resposta);
      }
    } catch (error) {
      console.log(error)
      alert("Um erro inesperado aconteceu, tente novamente.")
    }
  };

  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 1;
  const orderedProjects = projetos.sort((a, b) =>
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
  }, [isLoading, user]);
  
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
              {projetos.length===0?(
                <Text>Não há resultados correspondentes à sua pesquisa</Text>
              ):''}
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
            <Heading size="md" 
            color='GrayText'>Filtros</Heading>

              <br/>

            <Stack spacing={4}>
              <Box>
                <Text as="b">Título</Text>
                <Input focusBorderColor='teal.500'
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="b">Fomentador</Text>
                <Input focusBorderColor='teal.500'
                value={patrocinador}
                onChange={(event) => setPatrocinador(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="b">Área</Text>
                <Input focusBorderColor='teal.500'
                value={curso}
                onChange={(event) => setCurso(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="b">Ano de Início</Text>
                <Input focusBorderColor='teal.500'
                value={dInicio}
                onChange={(event) => setDInicio(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="b">Ano de Finalização</Text>
                <Input focusBorderColor='teal.500'
                value={dFinal}
                onChange={(event) => setDFinal(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="b">Autor</Text>
                <Input focusBorderColor='teal.500'
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
                />
              </Box>
              <hr/>
                <Button onClick={handleSubmit}
                colorScheme="teal">
                  Aplicar
                </Button>
            </Stack>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard