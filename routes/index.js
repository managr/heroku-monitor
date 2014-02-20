
/*
 * GET home page.
 */

exports.index = function(req, res){
	// need to extract and generate token
	res.redirect(process.env.HEROKU_AUTH_URL + '/oauth/authorize?client_id=' + process.env.HEROKU_OAUTH_ID + '&response_type=code&scope=read&state=ala_ma_kota');
};