import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
// import { signOut } from "../contexts/AuthContext";
// import { AuthTokenError } from "./errors/AuthTokenError";

// interface FailedRequestQueue {
//   onSucess: (token: string) => void;
//   onFailure: (err: AxiosError) => void;
// }

// interface AxiosErrorData {
//   code: string;
// }

// let isRefreshing = false
// let failedRequestQueue: FailedRequestQueue[] = []

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    // headers: {
    //   Authorization: `Bearer ${cookies['nextauth.token']}`
    // }
  })

  // api.interceptors.response.use(response => {
  //   return response
  // }, (error: AxiosError<AxiosErrorData>) => {
  //   if (error.response?.status === 401) {
  //     if (error.response.data?.code === 'token.expired') {
  //       cookies = parseCookies(ctx)

  //       const { 'nextauth.refreshToken': refreshToken } = cookies
  //       const originalConfig = error.config

  //       if (!isRefreshing) {
  //         isRefreshing = true;

  //         api.post('/refresh', {
  //           refreshToken
  //         }).then(response => {
  //           const { token, refreshToken: newRefreshToken } = response.data

  //           setCookie(ctx, 'nextauth.token', token, {
  //             maxAge: 60 * 60 * 24 * 30, // 30 days
  //             path: '/',
  //           })
  //           setCookie(ctx, 'nextauth.refreshToken', newRefreshToken, {
  //             maxAge: 60 * 60 * 24 * 30, // 30 days
  //             path: '/',
  //           })

  //           api.defaults.headers['Authorization'] = `Bearer ${token}`

  //           failedRequestQueue.forEach(request => request.onSucess(token))
  //           failedRequestQueue = []
  //         })
  //           .catch((err) => {
  //             failedRequestQueue.forEach(request => request.onFailure(err))
  //             failedRequestQueue = []

  //             if (typeof window === 'object') {
  //               // signOut()
  //             }
  //           })
  //           .finally(() => {
  //             isRefreshing = false
  //           })
  //       }

  //       return new Promise((resolve, reject) => {
  //         failedRequestQueue.push({
  //           onSucess: (token: string) => {
  //             originalConfig.headers['Authorization'] = `Bearer ${token}`

  //             resolve(api(originalConfig))
  //           },
  //           onFailure: (err: AxiosError) => {
  //             reject(err)
  //           },
  //         })
  //       })
  //     } else {
  //       if (typeof window === 'object') {
  //         // signOut()
  //       } else {
  //         // return Promise.reject(new AuthTokenError())
  //       }
  //     }
  //   }

  //   return Promise.reject(error)
  // })

  return api
}

export const api = setupAPIClient()