'use server';

import { kv } from '@vercel/kv';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { User } from '@/lib/types';
import { ResultCode } from '@/lib/utils';

// export async function getUser(email: string) {
//   const user = await kv.hgetall<User>(`user:${email}`)
//   return user
// }
export async function getUser(participantId: string) {
  const user = await kv.hgetall<User>(`user:${participantId}`);
  return user;
}

export interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function authenticate(_prevState: Result | undefined, formData: FormData): Promise<Result | undefined> {
  try {
    // const email = formData.get('email')
    // const password = formData.get('password')
    const participantId = formData.get('participantId');

    const parsedCredentials = z
      .object({
        // email: z.string().email(),
        // password: z.string().min(6)
        participantId: z.string(),
      })
      .safeParse({
        // email,
        // password
        participantId,
      });

    if (parsedCredentials.success) {
      await signIn('credentials', {
        // email,
        // password,
        participantId,
        redirect: false,
      });

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn,
      };
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials,
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials,
          };
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError,
          };
      }
    }
  }
}
