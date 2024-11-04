import express, { Request, Response, RequestHandler } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDatabase } from "./config/database";
import document from './routes/document';

const app = express();
const PORT = process.env.PORT || 4000;

connectDatabase();

app.use(cors());
app.use(express.json());

app.use('/document', document)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
