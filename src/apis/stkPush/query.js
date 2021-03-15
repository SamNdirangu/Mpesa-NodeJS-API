import models from 'database';

////////////////////////////////////////////////
//Query Payments done
const sktPushQuery = async (request, response) => {
	//Check if request has a body
	if(!request.body){
		response.send({
			error: 'Empty Request'
		});
	}

	const requestID = request.query.requestID;
	try {
		const stkPushRequest = await models.stkPushRequests.findByPk(requestID);
		if(stkPushRequest){
			response.send(stkPushRequest);
			return;
		} else {
			response.send({
				error: 'Unable to locate current request'
			});
		}
	} catch (error) {
		response.send({
			error: error.toString()
		});
	}
};

export default sktPushQuery;