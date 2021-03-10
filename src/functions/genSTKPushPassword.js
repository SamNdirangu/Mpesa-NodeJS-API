import mpesaParams from 'constants/mpesa';
import genStringTimeStamp from 'functions/genStringTimeStamp';

const genSTKPushPassword = () => {


	const phrase = mpesaParams.BusinessShortCode+process.env.passkey+genStringTimeStamp();
	const password = Buffer.from(phrase).toString('base64');

	return password;
};

export default genSTKPushPassword;