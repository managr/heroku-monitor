
/*
 * GET home page.
 */

exports.index = function(req, res){
	// need to extract and generate token
	res.redirect('https://id.heroku.com/oauth/authorize?client_id=feb3855e-4a35-4d99-b5a0-431f7d39c0b1&response_type=code&scope=read&state=ala_ma_kota');
};