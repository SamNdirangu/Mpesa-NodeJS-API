import 'dotenv/config';
import http from 'http';
import helmet from 'helmet';
import express from 'express';

import rootRouter from './apis';
import { sequelize } from 'database';

//Create Express App
const app = express();
//Add helmet for added Security
app.use(helmet());
//Add middleware to parse application/json
app.use(express.json());
//Add middleware to parse the POST data of the body
app.use(express.urlencoded({ extended: true }));

//Add API Routes
app.use(rootRouter);


// Start the HTTP Server using the Express App
const port =  process.env.SERVER_PORT || 8080;

const httpServer = http.createServer(app);
sequelize.sync({force: true}).then(async () => { //Sync our sequelize then start listening
	httpServer.listen({ port }, () => {
		console.log('Server is listening to port: ' + port);
		console.log('Server is on at http://localhost:' + port);
	});
}).catch(e => {
	console.log(e);
});


