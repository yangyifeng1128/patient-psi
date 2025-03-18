import NextAuth, { NextAuthConfig, NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import { getUser } from './app/login/actions';

const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const isOnSignupPage = nextUrl.pathname.startsWith('/signup');

      if (isLoggedIn) {
        if (isOnLoginPage || isOnSignupPage) {
          return Response.redirect(new URL('/', nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string };
        const { user } = session;

        session = { ...session, user: { ...user, id } };
      }

      return session;
    },
  },
  providers: [],
};

const authResult = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            // email: z.string().email(),
            // password: z.string().min(6)
            participantId: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          // const { email, password } = parsedCredentials.data
          const { participantId } = parsedCredentials.data;

          // const user = await getUser(email)
          const user = await getUser(participantId);

          if (!user) return null;

          // const encoder = new TextEncoder()
          // const saltedPassword = encoder.encode(password + user.salt)
          // const hashedPasswordBuffer = await crypto.subtle.digest(
          //   'SHA-256',
          //   saltedPassword
          // )
          // const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

          // if (hashedPassword === user.password) {
          //   return user
          // } else {
          //   return null
          // }
          return user;
        }

        return null;
      },
    }),
  ],
});

export const handlers: NextAuthResult['handlers'] = authResult.handlers;
export const auth: NextAuthResult['auth'] = authResult.auth;
export const signIn: NextAuthResult['signIn'] = authResult.signIn;
export const signOut: NextAuthResult['signOut'] = authResult.signOut;
