import { sequelize } from 'database';
import * as DataTypes from 'sequelize';


const stkPushRequestAttempts = () => {
	const stkPushRequestAttempt = sequelize.define('stkPushRequestAttempts', {
		//Request Data
		attemptID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		requestId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		errorCode: {
			type: DataTypes.STRING,
			allowNull: false
		},
		errorMessage:{
			type: DataTypes.TEXT,
			allowNull: false
		},
		customerPhone:{
			type: DataTypes.STRING(12),
			allowNull: false
		},
		paymentAmount:{
			type: DataTypes.STRING,
			allowNull: false
		},
		requestTimeStamp:{
			type: DataTypes.STRING(30),
			allowNull: false
		},
		accountReference: {
			type: DataTypes.STRING
		},
		transactionDesc: {
			type: DataTypes.STRING
		}		
	});
	return stkPushRequestAttempt;
};
 
export default stkPushRequestAttempts;

