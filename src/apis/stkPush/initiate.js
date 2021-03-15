import fetch from 'node-fetch'
;
import models from 'database';
import mpesaParams from 'constants/mpesa';
import genAccessToken from 'functions/genAccessToken';
import genSTKPushPassword from 'functions/genSTKPushPassword';


////////////////////////////////////////////////////////////////////////////////////////
//Initiate an stk push transaction
/////////////////////////////////
const stkPushInitiate = async (request, response) => {
	console.log('Initiation Started');
	//Check if request has all required parameters
	if(!request.body.amount ||!request.body.phoneNumber || !request.body.accountReference || !request.body.transactionDesc){
		response.send({
			error: 'API Missing Certain Parameters:: Required: amount,phoneNumber,account,transactionDesc'
		});
		return;
	}

	//Load parameters
	const access_token = await genAccessToken();
	const { password, requestTimeStamp } = genSTKPushPassword();

	const callBack = request.body.callBack;
	const paymentAmount = request.body.amount;
	const customerPhone = request.body.phoneNumber;
	const transactionDesc = request.body.transactionDesc;
	const accountReference = request.body.accountReference;
	
	//////////////////////////////////////////////////////////////
	//Parameter validation
	if(customerPhone.length < 12){
		response.send({
			error: 'Incorrect number format: Format is: 254712345678'
		});
		return;
	}
	if(access_token == null){
		response.send({
			error: 'Unable to authenticate to MPESA, Mpesa might be unresponsive'
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
		AccountReference: accountReference,
		TransactionDesc: transactionDesc
	};
		
	try {
		const stkRequestResponse = await fetch(mpesaParams.STKPushURL,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ access_token
			},
			body: JSON.stringify(stkPushRequest)
		});
		const {
			//Successfull request 
			MerchantRequestID, 
			CheckoutRequestID, 
			ResponseCode, 
			ResponseDescription, 
			CustomerMessage,
			//Unsuccesful request 
			requestId, 
			errorCode, 
			errorMessage
		} = await stkRequestResponse.json(); //parse the response

		//Check for response code
		if(ResponseCode) { 
			//if request was successful, store to db as a request
			const request = await models.stkPushRequests.create({
				MerchantRequestID,
				CheckoutRequestID,
				customerPhone,
				paymentAmount,
				requestTimeStamp,
				ResponseCode,
				ResponseDescription,
				CustomerMessage,
				accountReference,
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
			
		} else if(errorCode){
			//if request was not successful, store as an attempt
			const attempt = await models.stkPushRequestAttempts.create({
				requestId,
				errorCode,
				errorMessage,
				customerPhone,
				paymentAmount,
				requestTimeStamp,
				accountReference,
				transactionDesc
			});

			const { attemptID } = attempt;
			response.send({
				attemptID,
				requestId,
				errorCode,
				errorMessage
			});
		} else {
			//if the request timed out or not found
			//store request as backup incase request went through but mpesa server failed to respond
			const backupRequest = await models.stkPushBackupRequests.create({
				customerPhone,
				paymentAmount,
				requestTimeStamp,
				accountReference,
				transactionDesc
			});

			const { backupRequestID } = backupRequest;
			response.send({
				error: 'No response from MPESA',
				backupRequestID
			});
		}
		console.log('Initiation Done');

	} catch (error) {
		console.log('ooops snap');
		console.log({error: error});
		response.send({
			error: 'Something wrong happened, please try again'
		});		
	}
};
export default stkPushInitiate;