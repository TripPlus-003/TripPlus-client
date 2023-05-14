import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { apiPostLogin } from '@/service/api';
import { safeAwait } from '@/utils';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      id: 'email',
      name: 'login',
      credentials: {},
      // @ts-ignore 會報錯誤，先行忽略
      async authorize(credentials) {
        const { email, password, isRemember } =
          credentials as LoginInterface.FormInputs;
        const [err, res] = await safeAwait(
          apiPostLogin({ email, password, isRemember })
        );
        if (res && res.status === 'Success') return res.data;
        if (err) {
          throw new Error(err.message);
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

export default NextAuth(authOptions);
