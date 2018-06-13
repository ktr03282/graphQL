import * as express from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from "graphql-tools"
import * as fs from "fs"
import * as path from "path"

const mock = fs.readFileSync(path.resolve(__dirname, "mock.json"), "utf-8")
const books = JSON.parse(mock)

const END_POINT: string = "/graphql"
const END_PORT: number = 4000
const ENTRY_POINT: string = "/graphiql"
const ENTRY_PORT: number = 3000

const typeDefs = `
  type Query {
    books: [Book]
  }

  type Book {
    title: String,
    author: String,
    price: Int
  }
`

const resolvers = { Query: { books: () => books } }

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const app = express()

const corsOptions = {
  origin: `http://localhost:${ENTRY_PORT}`,
  optionSuccessStatus: 200
}

app.use(
  END_POINT,
  bodyParser.json(),
  cors(corsOptions),
  graphqlExpress({ schema })
)

app.use(ENTRY_POINT, graphiqlExpress({ endpointURL: END_POINT }))

app.listen(END_PORT, () => {
  console.log(`http://localhost:${END_PORT}/graphiql to run queries`)
})

module.exports = app
