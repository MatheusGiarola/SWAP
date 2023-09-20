import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../services/firebase-admin";

export interface CreateUserResponse {
    user?: UserRecord,
    message?: string;
}

interface UpdateUserData {
    email?: string;
    phoneNumber?: string;
    displayName?: string;
    photoURL?: string;
    // emailVerified: boolean;
    // password: string;
    // disabled: boolean,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateUserResponse>) {
    if (req.method === 'POST') {
        const { user } = req.body

        try {
            const userData = await firebaseAdmin.auth().createUser({
                emailVerified: false,
                ...user
            })

            return res
                .status(201) //Created
                .json({
                    user: userData
                })
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return res
                    .status(409) //Conflict
                    .json({
                        message: error.message
                    })
            }

            return res
                .status(400) //Bad Request
                .json({
                    message: error.message
                })
        }
    } else if (req.method === 'PUT') {
        const { uid, data } = req.body

        try {
            await firebaseAdmin.auth().updateUser(uid, data)

            return res
                .status(200) //No Content
                .json({})
        } catch (error) {
            return res
                .status(400) //Bad Request
                .json({
                    message: error.message
                })
        }

    } else {
        return res.status(405) //Method not allowed
    }
}