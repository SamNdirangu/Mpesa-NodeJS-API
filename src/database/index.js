import Sequelize from 'sequelize';
import stkPushRequests from 'database/models/stkPushRequests';
import stkPushRequestAttempts from 'database/models/stkPushRequestsAttempts';
import stkPushBackupRequests from 'database/models/stkPushBackupRequests';

//This file instantiates our connection to the database and our models
//This is done using sequilize

const sequelize = new Sequelize(
	process.env.DATABASE, //If running test switch to test db
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		dialect: process.env.DATABASE_DIALECT,
		logging: false,
	},
);

const models = {//Combine our different models
	stkPushRequests: stkPushRequests(),
	stkPushBackupRequests: stkPushBackupRequests(),
	stkPushRequestAttempts: stkPushRequestAttempts()
};

Object.keys(models).forEach(key => {
	//initialize our associations
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});


export { sequelize };
export default models;