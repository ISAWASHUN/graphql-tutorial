const {ApolloServer, gql} = require("apollo-server")
const fs = require("fs")
const path = require("path")

const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    info: () => `Hackernews Clone`,
    feed: () => async (parent, args, context) => {
      return context.prisma.link.findMany()
    }
  },

  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url
        }
      })
      return newLink
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma
  }
})

server.listen().then(({url}) => {
  console.log(`Server is running on ${url}`)
})