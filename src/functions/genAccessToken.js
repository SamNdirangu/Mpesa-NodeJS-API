import configs from 'configs/mpesa';
import fetch from 'node-fetch';

var tokenData = {};

const genAccessToken = async () => {
	const currentTimeStamp = new Date().getTime();
	if(tokenData.token){
		//if token is already present
		//check if token is already expired
		if(currentTimeStamp >= tokenData.expiry){
			//if goood return token
			return tokenData.token;
		}
	}
	//if no token or expired gen new token
	console.log('fetch fresh token');
	try {
		const response = await fetch(configs.oAuthURL,{
			method: 'GET',
			headers: {
				Authorization: 'Basic '+ process.env.authorizationKey + '=='
			}
		});
		const tokenPayLoad = await response.json();
		tokenData = {
			token: tokenPayLoad.access_token,
			expiry: currentTimeStamp + tokenPayLoad.expires_in - 300
		};
		return tokenData.token;
		
	} catch (error) {
		console.log('oops snap: Authentication failed');
		console.log(error.toString());
		return null;
	}
	
};
export default genAccessToken;