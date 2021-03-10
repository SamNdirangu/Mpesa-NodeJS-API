import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import express from 'express';


import rootRouter from './apis';
import { sequelize } from 'database';


// Create Express App
const app = express();
// Add middleware to enable CORS
app.use(cors());
// Add middleware to parse the POST data of the body
app.use(express.urlencoded({ extended: true }));
// Add middleware to parse application/json
app.use(express.json());
// Add routes
app.use(rootRouter);
// Add application error handler
//app.use(appErrorHandler);


// Start the HTTP Server using the Express App
const port =  process.env.SERVER_PORT || 8080; // can be mapped using docker
const httpServer = http.createServer(app);


sequelize.sync().then(async () => {

	httpServer.listen({ port }, () => {
		console.log('Server is listening to port: ' + port);
		console.log('Server is on at http://localhost:' + port);
	});

}).catch(e => {
	console.log(e);
});


