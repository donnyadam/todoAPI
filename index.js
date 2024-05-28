import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import checklistRouter from './routes/checklist-routes.js';
import todosRouter from './routes/todos-routes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/todos', todosRouter);



app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));