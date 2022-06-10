const { validationResult } = require("express-validator");
const pool = require("../Database/database");

const ValidatedAuth = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        
        return res.status(400).json({
            resp: false,
            errors: errors.mapped()
        })
    }

    next();
}

const isAuth = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.header('xx-token');
	if (!accessTokenFromHeader) {
		return res.status(401).json({
            resp: false,
            msj: 'Access token not found!'
        });
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.json({
                resp: false,
                msj: 'You do not have access to this feature!'
            });
	}
    
    next();
};

module.exports = {
    ValidatedAuth
}