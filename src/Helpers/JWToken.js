const jwt = require('jsonwebtoken');


const generarJsonWebToken = (payload, secretSignature, tokenLife) => {

    return new Promise( ( resolve, reject ) => {
        console.log(process.env.JWT_KEY+'');
        jwt.sign( 
            payload, 
            secretSignature, 
            { 
            algorithm: "HS256",
            expiresIn: tokenLife
        }, (error, token) => {
            if (error) {
              return reject(error);
            }
            resolve(token);
        });
    });   
}

const verifyToken = async (token, secretKey) => {
	return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

const decodeToken = async (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, {
      ignoreExpiration: true,
    }, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
    generarJsonWebToken,
    verifyToken,
    decodeToken
}