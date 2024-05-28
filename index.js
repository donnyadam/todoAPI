import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import checklistRouter from './routes/checklist-routes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use('/', usersRouter);
app.use('/', authRouter);
app.use('/checklist', checklistRouter);



app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));