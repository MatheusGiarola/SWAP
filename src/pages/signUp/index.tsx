import { NextPage } from "next";
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Button, Flex, Stack, Link as ChakraLink, useToast, VStack, Text, HStack, Heading, Box, Spinner } from "@chakra-ui/react";
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { FcGoogle } from 'react-icons/fc'

import { Input } from "../../components/Form/Input";
import { Logo } from '../../components/Header/Logo';
import { useAuth } from "../../hooks/useAuth";
import Head from "next/head";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CreateUserResponse } from "../api/user";

type SignUpFormData = {
    email: string;
    password: string;
    passwordCheck: string;
}

const signUpFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("E-mail deve ser válido.")
        .required("E-mail é obrigatório."),
    password: yup
        .string()
        .required('Senha é obrigatória.'),
    passwordCheck: yup
        .string()
        .oneOf([yup.ref('password'), null], 'A confirmação deve ser igual a senha.')
        .required('A confirmação da senha é obrigatória.'),
})

const SignUp: NextPage = () => {
    const router = useRouter()
    const toast = useToast()
    const { authState, isNotAuthenticated, isLoading, signInWithGoogle, signInWithEmail } = useAuth()
    const [isThirdPartyProvider, setIsThirdPartyProvider] = useState<boolean>()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(signUpFormSchema),
    })

    useEffect(() => {
        const { success, redirect } = isNotAuthenticated()

        if (!isLoading) {
            if (!success) router.replace(redirect.path)
        }
    }, [isLoading]);

    const handleSignIn: SubmitHandler<SignUpFormData> = async (formData) => {
        try {
            await api.post<CreateUserResponse>('user', {
                user: formData
            })

            await signInWithEmail(formData)

        } catch (error) {
            let message: string
            
            switch (error.response?.status) {
                case 409:
                    message = 'E-mail já registrado.'
                    break;
                default:
                    message = error.response?.data?.message
                    break;
            }

            showToast(false, message)
        }
    }

    function showToast(success: boolean, message: string) {
        toast({
            title: message,
            status: success ? 'success' : 'error',
            duration: 1500,
            isClosable: true,
        })
    }

    return (
        <>
            <Head>
                <title>Crie sua conta</title>
            </Head>

            <VStack
                w="100vw"
                h="100vh"
                align="center"
                justify="center"
            >
                {isLoading || authState !== 'unauthenticated' ? (
                    <Spinner size='xl' color="teal.500" />
                ) : (
                    <HStack
                        bg="white"
                        p="8"
                        borderRadius={8}
                        w="clamp(360px, 80%, 850px)"
                        gap={4}
                    >

                        <VStack
                            flex={1}
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
                                    Crie sua conta
                                </Heading>
                                <Heading
                                    as="h2"
                                    fontSize="sm"
                                    fontWeight={100}
                                >Ainda não possui uma conta? Crie uma agora mesmo
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
                                    <Input
                                        name="password-check"
                                        type="password"
                                        label="Confirme sua senha"
                                        error={errors.passwordCheck as FieldError}
                                        {...register('passwordCheck')}
                                    />
                                </Stack>

                                <Button
                                    type="submit"
                                    mt="6"
                                    size="lg"
                                    colorScheme="teal"
                                    isLoading={isSubmitting}
                                >
                                    Criar
                                </Button>
                            </Flex>

                            <Text size="xs">ou acesso com</Text>

                            <Button
                                type="submit"
                                onClick={async () => {
                                    setIsThirdPartyProvider(true)
                                    const { success, message } = await signInWithGoogle()

                                    if (!success) setIsThirdPartyProvider(false)

                                    showToast(success, message)
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

                            <Text color="gray.700"> Já possui uma conta?
                                <Link href="/signIn" passHref>
                                    <ChakraLink color='teal.500' fontWeight="500" ml='2'>
                                        Entre.
                                    </ChakraLink>
                                </Link>

                            </Text>
                        </VStack>

                    </HStack>
                )}
            </VStack>
        </>
    )
}

export default SignUp