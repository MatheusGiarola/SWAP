import { NextPage } from "next";
import { VStack, HStack, Spinner, useToast } from "@chakra-ui/react";
import { SubmitHandler } from 'react-hook-form';
import Head from "next/head";
import { PersonalData, SignUpForm } from "../../components/Form/SignUpForm";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { onlyNumbers } from "../../utils/usefulMethods";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUp: NextPage = () => {
    const { user, isLoading, authState, updateProfile } = useAuth()
    const router = useRouter()
    const toast = useToast()

    useEffect(() => {
        if (!isLoading) {
            if (authState === 'authenticated') {
                router.replace('/dashboard')
            } else if (authState === 'unauthenticated') {
                router.replace('/signIn')
            } else {
                toast({
                    title: 'Complete o seu cadastro',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                })
            }
        }
    }, [isLoading, authState]);

    const handleSignIn: SubmitHandler<PersonalData> = async (userData) => {
        try {
            await Promise.all([
                setDoc(doc(db, "user", user.uid), {
                    ...userData,
                    cpf: onlyNumbers(userData.cpf),
                    phone: onlyNumbers(userData.phone),
                }),
                await updateProfile({
                    displayName: `${userData.name} ${userData.lastName}`,
                    phoneNumber: `+55${onlyNumbers(userData.phone)}`
                })
            ])

            toast({
                title: 'Cadastro concluído.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            toast({
                title: 'Ocorreu um erro.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Head>
                <title>Complete seu perfil</title>
            </Head>

            <VStack
                w="100vw"
                h="100vh"
                align="center"
                justify="center"
            >
                {isLoading || authState !== 'missingInfo' ? (
                    <Spinner size='xl' color="teal.500" />
                ) : (
                    <HStack
                        bg="white"
                        p="8"
                        justifyContent="center"
                        borderRadius={8}
                        w="clamp(360px, 80%, 850px)"
                        gap={4}
                    >

                        <VStack
                            flex={1}
                        >
                            <SignUpForm
                                defaultValues={{
                                    name: user?.displayName?.split(' ')[0],
                                    lastName: user?.displayName?.split(' ')[1]
                                }}
                                onSubmit={handleSignIn}
                            />

                        </VStack>



                    </HStack>
                )}

            </VStack>
        </>
    )
}

export default SignUp