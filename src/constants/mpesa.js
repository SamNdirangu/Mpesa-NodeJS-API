const mpesaParams = {
	BusinessShortCode: '174379',
	TransactionType: 'CustomerPayBillOnline',
	PartyB: '174379',
	
	CallBackURL: 'https://thin-bullfrog-36.loca.lt/api/mpesa/stkpush/callback', ///Set this to current url
	STKPushURL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
	oAuthURL: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
};

export default mpesaParams;