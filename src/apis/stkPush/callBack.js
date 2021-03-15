import models from 'database';

/////////////////////////////////////////////////////
//Receives Callback from mpesa
const stkPushCallback = (request, response) => {
	console.log('Callback Started');
	//Check if request has a body
	if(!request.body){
		response.send({
			error: 'Empty Request'
		});
	}
	//Parse request body
	const { MerchantRequestID, ResultCode, ResultDesc } = request.body.Body.stkCallback;

	var paymentSuccess = false;
	if(ResultCode == 0)	paymentSuccess = true;
	
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
};

export default stkPushCallback;
