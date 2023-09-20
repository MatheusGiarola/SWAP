import { NextPage } from "next";
import Link from 'next/link';
import { Button, Flex, Stack, Link as ChakraLink, useToast, VStack, Text, HStack, Heading, Box } from "@chakra-ui/react";
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { FcGoogle } from 'react-icons/fc'

import { Input } from "../components/Form/Input";
import { Logo } from '../components/Header/Logo';
import { useAuth } from "../hooks/useAuth";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type SignInFormData = {
    email: string;
    password: string;
}

const signInFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("E-mail deve ser válido.")
        .required("E-mail é obrigatório."),
    password: yup
        .string()
        .required('Senha é obrigatória.')
})

const SignIn: NextPage = () => {
    const router = useRouter()
    const toast = useToast()
    const { signInWithEmail, signInWithGoogle, isNotAuthenticated, isLoading } = useAuth()
    const [isThirdPartyProvider, setIsThirdPartyProvider] = useState<boolean>()


    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(signInFormSchema),
    })

    useEffect(() => {
        const { success, redirect } = isNotAuthenticated()

        console.log({success, redirect})
        if (!isLoading) {
            if (!success) router.replace(redirect.path)
        }
    }, [isLoading]);

    const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
        const { success, message } = await signInWithEmail(data)

        showToast({ success, message })
    }

    function showToast({ success, message }) {
        if (success) {
            toast({
                title: 'Logado.',
                status: 'success',
                duration: 1500,
                isClosable: true,
            })
        } else {
            toast({
                title: 'Não Autorizado.',
                description: message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }

    }


    return (
        <>
            <Head>
                <title>Entrar</title>
            </Head>

            <VStack
                w="100vw"
                h="100vh"
                align="center"
                justify="center"
            >
                <HStack
                    bg="white"
                    p="8"
                    borderRadius={8}
                    w="clamp(360px, 80%, 850px)"
                    gap={4}
                >

                    <VStack
                        flex={1}
                    // bgColor="blue"
                    >
                        <Logo fontSize={["6xl", "7xl"]} />
                    </VStack>

                    <VStack
                        flex={1}
                        px="8"
                    >

                        <Box alignSelf="start" mb="4">
                            <Heading
                                as="h1"
                                fontSize="4xl"
                                fontWeight={300}
                            >
                                Acesse sua conta
                            </Heading>
                            <Heading
                                as="h2"
                                fontSize="md"
                                fontWeight={100}
                            >Já possui uma conta? Faça login e aproveite 😉
                            </Heading>
                        </Box>

                        <Flex
                            as="form"
                            w="100%"
                            flexDir="column"
                            onSubmit={handleSubmit(handleSignIn)}
                        >
                            <Stack spacing="4">
                                <Input
                                    name="email"
                                    type="email"
                                    label="E-mail"
                                    error={errors.email as FieldError}
                                    {...register('email')}
                                />
                                <Input
                                    name="password"
                                    type="password"
                                    label="Senha"
                                    error={errors.password as FieldError}
                                    {...register('password')}
                                />
                            </Stack>

                            <Button
                                type="submit"
                                mt="6"
                                size="lg"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Entrar
                            </Button>
                        </Flex>

                        <Text size="xs">ou acesso com</Text>

                        <Button
                            type="submit"
                            onClick={async () => {
                                setIsThirdPartyProvider(true)
                                const { success, message } = await signInWithGoogle()

                                if (!success) {
                                    setIsThirdPartyProvider(false)
                                    showToast({ success, message })

                                }

                            }}
                            leftIcon={<FcGoogle />}
                            variant='outline'
                            width="100%"
                            mt="6"
                            size="lg"
                            colorScheme="teal"
                            isLoading={isThirdPartyProvider}
                        >
                            Google
                        </Button>

                        <Text color="gray.700"> Não possui conta?
                            <Link href="/signUp" passHref>
                                <ChakraLink color='teal.500' fontWeight="500" ml='2'>
                                    Crie uma conta.
                                </ChakraLink>
                            </Link>

                        </Text>
                    </VStack>

                </HStack>

            </VStack>
        </>
    )
}

export default SignIn