import { sequelize } from 'database';
import * as DataTypes from 'sequelize';


const stkPushRequests = () => {
	const stkPushRequest = sequelize.define('stkPushRequests', {
		//Request Data
		requestID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		MerchantRequestID: {
			type: DataTypes.STRING,
			allowNull: false
		},
		CheckoutRequestID: {
			type: DataTypes.STRING,
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
		},


		//Request Response
		ResponseCode: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		ResponseDescription:{
			type: DataTypes.TEXT,
		},
		CustomerMessage:{
			type: DataTypes.TEXT,
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
	return stkPushRequest;
};
 
export default stkPushRequests;

