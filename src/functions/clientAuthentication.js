const clientAuthentication = (req,res,next) => {
	const token = req.headers['access-key'];
	if(token != process.env.clientKey) {
		res.sendStatus(403);
		return;
	}
	next();
};
export default clientAuthentication;