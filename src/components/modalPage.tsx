import { parseISO,format } from "date-fns";

import {Flex,
  Heading,
  Image, 
  Text, 
  Button, 
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  HStack, } from "@chakra-ui/react";

export const ModalPage = ({ projects, isOpen, onClose }) => {
    return(
        <Modal isOpen={isOpen} 
        onClose={onClose} 
        closeOnOverlayClick={false}
        scrollBehavior='inside'
        size='full'
        isCentered>
          <ModalContent style={{
            position: "fixed",
            right: "0",
            width: "80%",}}>

            <ModalHeader>
              <Heading color='teal.500'>{projects.title}</Heading>
            </ModalHeader>

            <ModalBody>
              <Flex direction='column' gap='1.5rem'>
                <Image 
                  objectFit='contain'
                  alignContent='center'
                  alt={projects.title}
                  width='40rem'
                  height='20rem'
                  src='http://poiani.com.br/wp-content/uploads/2017/09/800x400-808x400.png'
                  margin="0 auto"
                  />

                <HStack spacing='3rem'>
                  <Box>
                    <Heading size='md' color='teal.500'
                    >Data de Início</Heading>
                    <Text>{format(parseISO(projects.createdAt), "dd/MM/yyyy")}</Text>
                  </Box>

                  <Box>
                    <Heading size='md'color='teal.500'
                    >Data de Finalização</Heading>
                    <Text>{projects.endDate === null ? "Em andamento" :
                      format(parseISO(projects.endDate), "dd/MM/yyyy") }</Text>
                  </Box>
                </HStack>

                <Box>
                  <Heading size='md'color='teal.500'
                  >Resumo</Heading>
                  <Text>{projects.description}</Text>
                </Box>
                
                <Box>
                  <Heading size='md'color='teal.500'
                  >Descrição</Heading>
                  <Text>{projects.description}</Text>
                </Box>

                <Box>
                  <Heading size='md'color='teal.500'
                  >Objetivo Geral</Heading>
                  <Text>{projects.description}</Text>
                </Box>

                <Box>
                  <Heading size='md'color='teal.500'
                  >Objetivos Específicos</Heading>
                  <Text>Objetivo 1</Text>
                  <Text>Objetivo 2</Text>
                  <Text>Objetivo 3</Text>
                </Box>

                <HStack spacing='3rem'>
                  <Box>
                    <Heading size='md' color='teal.500'
                    >Área</Heading>
                    <Text>Ciências Econômicas</Text>
                  </Box>

                  <Box>
                    <Heading size='md'color='teal.500'
                    >Tipo</Heading>
                    <Text>Artigo Acadêmico</Text>
                  </Box>
                </HStack>
                
                {projects.typeOfFinancing === null ? "" :
                  <Box>
                    <Heading size='md'color='teal.500'
                    >Tipo de Financiamento</Heading>
                    <Text>{projects.typeOfFinancing}</Text>
                  </Box> 
                }

                <Box>
                  <Heading size='md'color='teal.500'
                  >Membros</Heading>
                  {projects.contributors.map((contributors) => (
                  <Text>{contributors.name}</Text>))}
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='teal' mr={3} onClick={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    );
};