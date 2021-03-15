import express from 'express';

import stkPushCallback from 'apis/stkPush/callBack';
import stkPushInitiate from 'apis/stkPush/initiate';
import sktPushQuery  from 'apis/stkPush/query';


const stkPushRouter = express.Router();

//initiate
stkPushRouter.post('/', (request, response) => stkPushInitiate(request,response));
//handle callback from mpesa
stkPushRouter.post('/callback', (request, response) => stkPushCallback(request,response));
//handle queries from external ie PoS
stkPushRouter.get('/query', (request, response) => sktPushQuery(request,response));


export default stkPushRouter;


