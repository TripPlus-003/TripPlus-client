import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      roles: string[];
      token: string;
    };
  }

  export interface User {
    name: string;
    roles: string[];
    token: string;
  }
}
