import { Button, Center, Flex, VStack } from "@chakra-ui/react"
import { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { IoIosHome } from "react-icons/io"

const FourOhFour: NextPage = () => {
    return (
        <>
            <Head>
                <title>Está perdido ?</title>
            </Head>

            <Center h="100vh">
                <Link href="/" passHref >
                    <Button as="a" colorScheme='teal' size='lg' leftIcon={<IoIosHome />}>
                        Voltar
                    </Button>
                </Link>
            </Center>
        </>
    )
}

export default FourOhFour