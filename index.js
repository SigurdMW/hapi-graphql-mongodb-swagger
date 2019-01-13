const hapi = require("hapi")
// Deviating from tutorial, see comment here: https://medium.com/@stevenscol/thanks-for-the-tutorial-c50a36f8d8fb
const { ApolloServer } = require("apollo-server-hapi")
const schema = require("./graphql/schema")
// initialize database connection to local MongoDb
require("./db")

// swagger section
const Inert = require("inert")
const Vision = require("vision")
const HapiSwagger = require("hapi-swagger")
const Pack = require("./package")

const Painting = require("./models/Painting")

const apolloServer = new ApolloServer({
  schema
})

const server = hapi.server({
  port: 3000,
  host: "localhost"
})

const apiBase = "/api/v1/"
const makePaintingBaseUrl = (endpoint) => apiBase + endpoint

const init = async () => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Paintings API Documentation",
          version: Pack.version
        }
      }
    }
  ])

  server.route([
    {
      method: "GET",
      path: "/",
      config: {
        description: "Get the front page",
        tags: ["yeah"]
      },
      handler: (req, reply) => `<h1>Test</h1>`
    },
    {
      method: "GET",
      path: makePaintingBaseUrl("paintings"),
      options: {
        description: "Get todo",
        notes: "Returns a todo item by the id passed in the path",
        tags: ["api"]
      },
      handler: (req, reply) => Painting.find()
    },
    {
      method: "POST",
      path: makePaintingBaseUrl("paintings"),
      config: {
        description: "Posts a new painting",
        tags: ["post", "new"]
      },
      handler: (req, reply) => {
        const { name, url, techniques } = req.payload
        const painting = new Painting({
          name,
          url,
          techniques
        })
        return painting.save()
      }
    }
  ])

  try {
    await apolloServer.applyMiddleware({ app: server })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }

  try {
    await server.start()
    console.log(`Server starting at ${server.info.uri}`)
  } catch (e) {
    console.log(e)
    throw e
  }
}

init()
