const { ApolloServer } = require("apollo-server");
const { PubSub } = require('graphql-subscriptions')
const mongoose = require("mongoose");
const cors = require('cors')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req, pubsub}),
  cors: {
    origin: 'http://localhost:3001',
    credentials: true
  },
});

mongoose
  .connect("mongodb://localhost:27017/socialMedia", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


const port = process.env.PORT || 5000;

server.listen(port).then(() => {
  console.log(`server running on port ${port}`);
});
