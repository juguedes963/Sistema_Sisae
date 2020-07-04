module.exports = {
	permissao: (req,res,next) => {

		if(req.isAuthenticated() && req.user[0].permissao == 1){
			return next();
		}

		res.redirect("/")
	}
}