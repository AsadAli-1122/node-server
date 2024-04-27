import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/index.js';
import resolvers from './resolvers/index.js';
import connectDB from './db/index.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use('/graphql', graphqlHTTP((req, res) => ({
  schema,
  rootValue: resolvers,
  graphiql: true,
  context: { user: req.user },
})));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});