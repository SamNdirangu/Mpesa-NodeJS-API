import { sequelize } from 'database';
import * as DataTypes from 'sequelize';

//Stored requests made but no response from MPESA as backup in case reequest went through but the response timed out.
const stkPushBackupRequests = () => {
	const stkPushBackupRequest = sequelize.define('stkPushBackupRequests', {
		//Request Data
		backupRequestID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
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
		},

		//Mpesa Callback response
		mpesaCalledBack: {
			type: DataTypes.BOOLEAN
		},
		paymentSuccess:  {
			type: DataTypes.BOOLEAN
		},
		ResultCode: {
			type: DataTypes.INTEGER
		},
		ResultDesc:{
			type: DataTypes.TEXT
		}
	});
	return stkPushBackupRequest;
};
 
export default stkPushBackupRequests;

