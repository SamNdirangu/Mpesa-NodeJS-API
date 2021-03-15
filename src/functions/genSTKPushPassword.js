import mpesaParams from 'constants/mpesa';
import genStringTimeStamp from 'functions/genStringTimeStamp';


const genSTKPushPassword = () => {

	const requestTimeStamp = genStringTimeStamp();
	
	const phrase = mpesaParams.BusinessShortCode+process.env.passkey+requestTimeStamp;
	const password = Buffer.from(phrase).toString('base64');

	return {
		password,
		requestTimeStamp
	};
};

export default genSTKPushPassword;