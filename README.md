# GraphQL API
_Fully Functional GraphQL API with input validation and JWT Authentication._

## About GraphQL
_GraphQL is a query language for an API. GraphQL allows you to select only that data which is important to you._

## TechStack Used
<a href="https://nodejs.org" target="_blank"><img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="node" width="40" height="40"/></a><a href="https://graphql.org" target="_blank"><img src="https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg" alt="graphql" width="40" height="40"/></a>

## NPM Packages Used
1. **Apollo Server Express** - For creating graphql endpoint in express server
2. **Express** - For creating a request listener over HTTP
3. **GraphQL Shield** - For implementing authorization in queries and mutations 
4. **Mongoose** - For implementing a data schema over MongoDB
5. **Express JWT** - For implementing PassportJWT strategy in express server
6. **Joi** - For data validation

## Platform Requriements

1. Latest version of Nodejs LTS
2. Postman(Desktop App) or ThunderClient(VS Code Extension) - For testing API
3. A Web Browser for querying data in graphql playground

## Quick start

1. Clone this repository
2. `npm install` or `yarn install` in the project root folder on local
3. Put your MongoDB URI and JWT secret inside `.env`.
4. `npm run dev` or `yarn dev` to start the API on localhost at port 3001
5. Open your web browser and go to `http://localhost:3001/graphql` to open graphql playground in your browser

