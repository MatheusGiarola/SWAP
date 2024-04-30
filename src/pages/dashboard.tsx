import { NextPage } from "next";
import Head from "next/head";
import { ModalPage } from "../components/modalPage";
import axios from "axios";

import {
  Center,
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
  FormControl,
  FormLabel,
  Select
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import { useRouter } from "next/router";


async function getPublicProjects(params) {
  try {
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    let url = 'http://localhost:3333/project/public?' + query;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      const resposta = await res.json();

      return resposta;
    }
  } catch (error) {
    console.error(error)

    return {};
  };
}

const Dashboard: NextPage = () => {
  const { user, isLoading, isAuthenticated, authState } = useAuth()

  const [projetos, setProjetos] = useState([])
  const [courses, setCourses] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [openModals, setOpenModals] = useState({});

  let projectFilters = {};

  useEffect(() => {
    const fetchData = async () => {
      let params = {
        "take": projectsPerPage,
        "page": currentPage,
      };

      const { projects, total } = await getPublicProjects(params);

      if (projects && total) {
        setProjetos(projects);
        setTotalPages(total);
      } else {
        window.location.reload();
      }

    };
    fetchData();

    const courseFilter = async () => {
      try {
        const res = await fetch("http://localhost:3333/course", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (res.ok) {
          const courses = await res.json();
          setCourses(courses)
        }
      } catch (error) {
        console.log(error)
      };
    };
    courseFilter();
  }, [])

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const orderedProjects = projetos.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = async (event) => {
    event.preventDefault();
    projectFilters = {
      "search": event.target.elements['titulo'].value,
      "sponsorship": event.target.elements['fomentador'].value,
      "startYear": event.target.elements['anoInicio'].value,
      "endYear": event.target.elements['anoFinalizacao'].value,
      "courseId": event.target.elements['curso'].value
    };

    const { projects, total } = await getPublicProjects(Object.assign(projectFilters, {
      "take": projectsPerPage,
      "page": currentPage,
    }));

    if (projects && total) {
      setProjetos(projects);
      setTotalPages(total);
    } else {
      setProjetos([]);
    }
  };

  const handlePageChange = async (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setCurrentPage(page);

    const { projects, total } = await getPublicProjects(Object.assign(projectFilters, {
      "take": projectsPerPage,
      "page": page,
    }));

    if (projects && total) {
      setProjetos(projects);
      setTotalPages(total);
    } else {
      setProjetos([]);
    }

  };
  
  console.log(orderedProjects)
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Flex direction="column" h="100vh">
        <Header />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <SideBar />

          {!isLoading && projetos.length > 0
            ? (
              <SimpleGrid flex="1" gap="4"
                padding='30px'>
                {orderedProjects.map((projects) => (

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
                        {projects.coverUrl !== null ? (
                          <Image
                            objectFit='contain'
                            alignContent='center'
                            alt={projects.title}
                            width='40rem'
                            height='20rem'
                            src={projects.coverUrl}
                            margin="0 auto"
                          />) : ''}

                        <br />

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
                          onClick={() => setOpenModals(prevState => ({ ...prevState, [projects.id]: true }))}>
                          Ver projeto
                        </Button>
                      </CardFooter>

                      <br />
                    </Card>
                    <ModalPage projects={projects} isOpen={openModals[projects.id]} 
                    onClose={() => setOpenModals(prevState => ({ ...prevState, [projects.id]: false }))} />

                  </Flex>
                ))}

                {projetos.length === 0 ? (
                  <Text>Não há resultados correspondentes à sua pesquisa.</Text>
                ) : ''}
                <Box mt="4" display="flex" justifyContent="center">
                  <Pagination
                    totalCountOfRegisters={Math.floor(totalPages / projectsPerPage)}
                    currentPage={currentPage}
                    registersPerPage={projectsPerPage}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </SimpleGrid>

            ) : (
              <Center w="100%" h="100%">
                <Spinner size='xl' color="teal.500" />
              </Center>
            )}

          <Box as="aside" w="10rem" p='4' mr="8">
            <Heading size="md"
              color='GrayText'>Filtros</Heading>

            <br />

            <Stack spacing={4}>
              <form onSubmit={handleSubmit}>
                <Box>
                  <FormControl id="titulo">
                    <FormLabel>Título</FormLabel>
                    <Input type="text" />
                  </FormControl>

                  <FormControl id="fomentador">
                    <FormLabel>Fomentador</FormLabel>
                    <Input type="text" />
                  </FormControl>

                  <FormControl id="area">
                    <FormLabel>Área</FormLabel>
                    <Input type="text" />
                  </FormControl>

                  <FormControl id="anoInicio">
                    <FormLabel>Ano de Início</FormLabel>
                    <Input type="number" />
                  </FormControl>

                  <FormControl id="anoFinalizacao">
                    <FormLabel>Ano de Finalização</FormLabel>
                    <Input type="number" />
                  </FormControl>

                  <FormControl id="autor">
                    <FormLabel>Autor</FormLabel>
                    <Input type="text" />
                  </FormControl>

                  <FormControl id="curso">
                    <FormLabel>Área</FormLabel>
                    <Select placeholder=" ">
                      {courses.map((course) => {
                        return (
                          <option value={course.id}>{course.name}</option>
                        )
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <hr />
                  <br />

                  <Button type="submit"
                    colorScheme="teal">
                    Aplicar
                  </Button>
                </Box>
              </form>
            </Stack>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Dashboard