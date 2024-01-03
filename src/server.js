const {ApolloServer, gql} = require("apollo-server")
const fs = require("fs")
const path = require("path")

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  },
  {
    id: "link-1",
    url: "www.google.com",
    description: "Google search engine"
  }
]

const resolvers = {
  Query: {
    info: () => `Hackernews Clone`,
    feed: () => links
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server is running on ${url}`)
})