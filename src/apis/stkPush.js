import mpesaParams from 'constants/mpesa';
import models from 'database';
import express from 'express';
import genSTKPushPassword from 'functions/genSTKPushPassword';
import genStringTimeStamp from 'functions/genStringTimeStamp';
import fetch from 'node-fetch';

export const stkPushRouter = express.Router();

//Initiate an stk push transaction
stkPushRouter.post('/', async (request, response) => {
	console.log('Initiation Started');
	//Check if request has a body
	if(!request.body.amount ||!request.body.phoneNumber || !request.body.transactionDesc){
		response.send({
			error: 'API Missing Certain Parameters'
		});
		return;
	}

	//Load parameters	
	const password = genSTKPushPassword();
	const requestTimeStamp = genStringTimeStamp();
	const callBack = request.body.callBack.toString();
	const paymentAmount = request.body.amount.toString();
	const customerPhone = request.body.phoneNumber.toString();
	var transactionDesc = '';
	if(request.body.transactionDesc){
		transactionDesc = request.body.transactionDesc;
	} else {
		transactionDesc = mpesaParams.transactionDesc;
	}
	//////////////////////////////////////////////////////////////
	//Parameter validation
	if(customerPhone.length < 12){
		response.send({
			error: 'Incorrect number format: Format is: 254712345678'
		});
		return;
	}

	//Build request payload
	const stkPushRequest = { 
		BusinessShortCode: mpesaParams.BusinessShortCode,
		Password: password,
		Timestamp: requestTimeStamp,
		TransactionType: mpesaParams.TransactionType,
		Amount: paymentAmount,
		PartyA: customerPhone,
		PartyB: mpesaParams.BusinessShortCode,
		PhoneNumber: customerPhone,
		CallBackURL: callBack,
		AccountReference: mpesaParams.accountReference,
		TransactionDesc: transactionDesc
	}; 
		
	try {
		const stkRequestResponse = await fetch(mpesaParams.STKPushURL,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ process.env.bearerToken
			},
			body: JSON.stringify(stkPushRequest)
		});
		const data = await stkRequestResponse.json(); //parse teh response
		const {     
			MerchantRequestID, 
			CheckoutRequestID, 
			ResponseCode, 
			ResponseDescription, 
			CustomerMessage,
			requestId,
			errorCode,
			errorMessage
		} = data;

		if(!data.errorCode) {
			//if request was successful
			const request = await models.stkPushRequests.create({
				MerchantRequestID,
				CheckoutRequestID,
				customerPhone,
				paymentAmount,
				requestTimeStamp,
				ResponseCode,
				ResponseDescription,
				CustomerMessage,
				accountReference: mpesaParams.accountReference,
				transactionDesc
			});
			const { requestID } = request;
			response.send({
				requestID,
				MerchantRequestID,
				CheckoutRequestID,
				ResponseCode,
				ResponseDescription,
				CustomerMessage
			});
			
		} else {
			//if request was successful
			const attempt = await models.stkPushRequestAttempts.create({
				requestId,
				errorCode,
				errorMessage,
				customerPhone,
				paymentAmount,
				requestTimeStamp,
				accountReference: mpesaParams.accountReference,
				transactionDesc
			});

			const { attemptID } = attempt;
			response.send({
				attemptID,
				requestId,
				errorCode,
				errorMessage,
			});
		}
		console.log('Initiation Done');
	} catch (error) {
		console.log('ooops');
		response.send({
			error: error.toString()
		});		
	}
});

















//Get all pricing (can include filters)
stkPushRouter.post('/callback', (request, response) => {
	console.log('Callback Started');
	//Check if request has a body
	if(!request.body){
		response.send({
			error: 'Empty Request'
		});
	}
	console.log(request.body);
	const {MerchantRequestID, ResultCode, ResultDesc} = request.body.Body.stkCallback;

	var paymentSuccess = false;
	if(ResultCode != 1032){
		paymentSuccess = true;
	}
	
	models.stkPushRequests.update({
		mpesaCalledBack: true,
		paymentSuccess,
		ResultCode,
		ResultDesc
	},{
		where: {
			MerchantRequestID
		}
	});
	response.send({
		success: true
	});
	console.log('Callback Ended');
});


//Get all pricing (can include filters)
stkPushRouter.get('/query', async (request, response) => {
	//Check if request has a body
	if(!request.body){
		response.send({
			error: 'Empty Request'
		});
	}

	const requestID = request.query.requestID;
	try {
		const stkPushRequest = await models.stkPushRequests.findByPk(requestID);
		response.send(stkPushRequest);
	} catch (error) {
		response.send({
			error: error.toString()
		});
	}
});