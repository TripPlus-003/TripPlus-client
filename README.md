# Tripplun-front

## About this Repo

## Prerequisites

Git
Node.js v 16.+
pnpm v 7.+

## Getting started

- Clone this repository to your local machine.
- Run `pnpm install` in the project directory to install all required dependencies.
- Create a .env file at the root directory of the project and add the necessary environment variables.
    - .env.development.local : for development
    - .env.production.local : for production
    - .env.local : always overrides the defaults set.

### development

-  Run `pnpm dev` to start the application.
-  First, run the development server, open http://localhost:3000 with your browser to see the result.

### production

- Run `pnpm build` to build production application.
- Run `pnpm start` to start the application.
- Open http://localhost:3000 with your browser to see the result.

### docker

 - build
`docker build -t nextjs-docker .`
- run
`docker run -d -p 80:3000 --name nextjs-docker nextjs-docker`

## Core Skills

- [Next.js](https://nextjs.org/) : React framework for building server-side rendered (SSR) and statically generated (SSG) web applications.
- [Chakra UI](https://chakra-ui.com/) : React UI library.
- [MongoDB](https://www.mongodb.com/) : NoSQL document-oriented database.
- `WebSocket` : Real-time communication between the client and the server.

## Tools

- [TypeScript](https://www.typescriptlang.org/) : Strongly typed programming language builds on JavaScript.
- [Husky](https://typicode.github.io/husky/#/) : Unify git commit tools.
- [commitlint](https://commitlint.js.org/#/) : Lint git commit message.
- [Axios](https://github.com/axios/axios) : Promise based HTTP client for the browser and node.js.
- [React Hooks Form](https://github.com/react-hook-form/react-hook-form) : React Hooks for form state management and validation.
- [SWR](https://swr.vercel.app/) : SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data.

## Documents

- [document preview](https://tripplus-003.github.io/frontend-docs/)

## Coding Style

### Commit Message Guidelines

## Contributors

- [yuhantaiwan]()
- [happy9990929]()
- [Wendy03]()
- [chilinglee]()
- [gn00678465]()