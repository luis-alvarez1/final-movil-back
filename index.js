const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const path = require('path');
const fs = require('fs');

const { Input } = require('./src/model/Input');
const DBConfig = require('./src/config/database/database');

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    helloWorld: String!
  }

  input UploadInfo {
    file: Upload
    description: String
    sentBy: String
    long: Int!
    lat: Int!
  }

  type Mutation {
    uploadFile(file: Upload, description: String, sentBy: String, long: Int, lat: Int): String
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    helloWorld: async () => 'hello world',
  },
  Mutation: {
    uploadFile: async (_, { file, description, sentBy, long, lat }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const pathName = path.join(__dirname, `/images/img${filename}`);
      const stream = createReadStream();
      await stream.pipe(fs.createWriteStream(pathName));

      try {
        Input.create({
          description,
          sentBy,
          coordinates: { long, lat },
          file: `http://localhost:4000/graphql/images/${filename}`,
        });
        return `http://localhost:4000/graphql/images/${filename}`;
      } catch (error) {
        console.log(error);
        return JSON.stringify(error);
      }
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  app.listen({ port: 4000 });

  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

DBConfig.connectDB();
startServer();
