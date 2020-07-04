module.exports = {
	permissao: (req,res,next) => {

		if(req.isAuthenticated()){
			return next();
		}

		res.redirect("/")
	}
}