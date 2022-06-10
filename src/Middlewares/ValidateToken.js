const jwt = require('jsonwebtoken');
const { uid } = require('rand-token');



const validateToken = async ( req, res, next ) => {

    let token = req.header('xx-token');

    if( !token ){
        return res.status(401).json({
            resp: false,
            msj : "There is not Token in the request",
        });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    try {

        // -----------------------------------Add key Jwt TOKEN
        const { uid } = await jwt.verify( token, accessTokenSecret, {
			ignoreExpiration: true,
		} );       

        req.uid = uid;

        next();
        
    } catch (e) {
        return res.status(401).json({
            resp: false,
            msj : 'Invalid Token',
        });
    }

}

module.exports = {
    validateToken
}