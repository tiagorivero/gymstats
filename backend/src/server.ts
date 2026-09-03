import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/error';
import { router } from './routes/index';

export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);
