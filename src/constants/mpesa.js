const mpesaParams = {
	accountReference: 'Testing',
	transactionDesc: 'testing',

	BusinessShortCode: '174379',
	TransactionType: 'CustomerPayBillOnline',
	PartyB: '174379',
	CallBackURL: ' https://thin-bullfrog-36.loca.lt/api/mpesa/stkpush/callback',
	STKPushURL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
};

export default mpesaParams;