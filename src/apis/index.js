import express from 'express';
import { stkPushRouter } from './stkPush';


const mpesaRouter = express.Router();
mpesaRouter.use('/stkpush', stkPushRouter);


const rootRouter = express.Router();
rootRouter.use('/api/mpesa', mpesaRouter);

export default rootRouter;