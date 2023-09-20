import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import nookies from 'nookies'

export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = nookies.get(ctx)

        if (cookies[process.env.NEXT_PUBLIC_TOKEN_NAME]) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        return await fn(ctx)
    }
}