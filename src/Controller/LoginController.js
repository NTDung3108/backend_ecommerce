const { response } = require('express');
const pool = require('../Database/database');
const bcrypt = require('bcrypt');
const { generarJsonWebToken, decodeToken } = require('../Helpers/JWToken');
const randToken = require('rand-token');
require('dotenv').config();


const LoginUser = async (req, res = response) => {

    const { phone, password } = req.body;

    const rows = await pool.query(`CALL SP_VALIDATE_LOGIN(?);`, [phone]);

    if (rows[0].length > 0) {

        const users = rows[0][0];
        console.log(users);

        let validatedPassword = await bcrypt.compareSync(password, users.passwordd);

        if (validatedPassword && users.group_id == 3 && users.statuss == 1) {

            console.log(users.persona_id);

            let accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

            let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

            const dataForAccessToken = {
                uid: users.persona_id,
                group_id: users.group_id
            };

            let token = await generarJsonWebToken(dataForAccessToken, accessTokenSecret, accessTokenLife);

            if (!token) {
                return res.status(401).json({
                    resp: true,
                    msj: 'Login unsuccessful',
                    users: { 'id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
                    token: 'invalid',
                    refreshToken: 'invalid'
                })
            }

            let refreshToken = randToken.generate(100); // tạo 1 refresh token ngẫu nhiên
            if (users.token == null) {
                console.log(users.token);
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                await pool.query(`CALL SP_UPDATE_TOKEN(?,?);`, [users.persona_id, refreshToken]);
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = users.token;
            }

            console.log('token: ' + token);
            console.log('refreshToken: ' + refreshToken);


            res.status(200).json({
                resp: true,
                msj: 'Welcome to ....',
                users: { 'id': users.persona_id, 'phone': users.phone, 'image': users.image },
                token: token,
                refreshToken: refreshToken
            });


        } else {

            return res.status(400).json({
                resp: false,
                msj: 'Wrong Credentials',
                users: { 'id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
                token: 'invalid',
                refreshToken: 'invalid'
            });
        }
    } else {
        return res.status(400).json({
            resp: false,
            msj: 'Wrong Credentials',
            users: { 'id': 'invalid', 'email': 'invalid', 'users': 'invalid' },
            token: 'invalid',
            refreshToken: 'invalid'
        });
    }
}

const LoginStaff = async (req, res = response, next) => {

    const { phone, password } = req.body;

    const rows = await pool.query(`CALL SP_VALIDATE_LOGIN_STAFF(?);`, [phone]);

    if (rows[0].length > 0) {

        const users = rows[0][0];
        console.log(users);

        let validatedPassword = await bcrypt.compareSync(password, users.passwordd);
        
        if (validatedPassword && users.group_id == 2) {
            if (users.statuss == 0) {
                return res.json({
                    resp: false,
                    msj: 'Your account has not been activated',
                    users: { 'id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
                    token: 'invalid',
                    refreshToken: 'invalid'
                });
            }

            let accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

            let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

            const dataForAccessToken = {
                uid: users.persona_id,
            };

            let token = await generarJsonWebToken(dataForAccessToken, accessTokenSecret, accessTokenLife);

            if (!token) {
                return res.status(401).json({
                    resp: false,
                    msj: 'Login unsuccessful',
                    users: { 'id': 'invalid', 'person_id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
                    token: 'invalid',
                    refreshToken: 'invalid'
                })
            }

            let refreshToken = randToken.generate(100); // tạo 1 refresh token ngẫu nhiên
            if (users.token == null) {
                console.log(users.token);
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                await pool.query(`CALL SP_UPDATE_TOKEN(?,?);`, [users.persona_id, refreshToken]);
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = users.token;
            }

            console.log('token: ' + token);
            console.log('refreshToken: ' + refreshToken);

            res.status(200).json({
                resp: true,
                msj: 'Welcome to ....',
                users: { 'id': users.staff_id, 'person_id': users.persona_id, 'phone': users.phone, 'image': users.image },
                token: token,
                refreshToken: refreshToken
            });

        } else {
            console.log(validatedPassword);
            return res.json({
                resp: false,
                msj: 'Wrong Credentials',
                users: { 'id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
                token: 'invalid',
                refreshToken: 'invalid'
            });
        }
    } else {
        return res.status(400).json({
            resp: false,
            msj: 'Wrong Credentials',
            users: { 'id': 'invalid', 'phone': 'invalid', 'users': 'invalid' },
            token: 'invalid',
            refreshToken: 'invalid'
        });
    }
}

const RefreshToken = async (req, res = response) => {

    // Lấy access token từ header
    const accessTokenFromHeader = req.header('xx-token');
    if (!accessTokenFromHeader) {
        return res.status(400).json({
            resp: false,
            msj: 'access token not found.',
            token: 'Invalid Token'
        });
    }

    // Lấy refresh token từ body
    const refreshTokenFromBody = req.body.refreshToken;
    if (!refreshTokenFromBody) {
        return res.status(400).json({
            resp: false,
            msj: 'refresh token not found.',
            token: 'Invalid Token'
        });
    }

    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    let accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

    // Decode access token đó

    const decoded = await decodeToken(
        accessTokenFromHeader,
        accessTokenSecret
    );
    console.log(decoded);
    if (!decoded) {
        return res.status(400).json({
            resp: false,
            msj: 'Access token is invalid.',
            token: 'Invalid Token'
        });
    }

    const personaId = decoded.uid; // Lấy uid từ payload

    const user = await pool.query('SELECT token FROM users WHERE persona_id = ?', [personaId]);
    if (!user) {
        return res.status(401).json({
            resp: false,
            msj: 'User does not exist.',
            token: 'Invalid Token'
        });
    }
    console.log(user[0].token);
    if (refreshTokenFromBody != user[0].token) {
        return res.status(400).json({
            resp: false,
            msj: 'Refresh token is not valid.',
            token: 'Invalid Token'
        });
    }

    // Tạo access token mới
    const dataForAccessToken = {
        personaId,
    };

    const accessToken = await generarJsonWebToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
    );
    if (!accessToken) {
        return res
            .status(400)
            .json({
                resp: false,
                msj: 'Access token generation failed, please try again.',
                token: 'Invalid Token'
            });
    }
    return res.json({
        resp: true,
        msj: 'Access Token',
        token: accessToken
    });
}

const RenewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJsonWebToken(uid);

    const rows = await pool.query(`CALL SP_RENEW_TOKEN(?);`, [uid]);

    const users = rows[0][0];

    return res.json({
        resp: true,
        msj: 'Welcome to...',
        users: { 'id': users.persona_id, 'phone': users.phone, 'image': users.image },
        token: token
    });
}

module.exports = {
    LoginUser,
    RenewToken,
    RefreshToken,
    LoginStaff
}
