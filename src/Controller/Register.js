const { response } = require('express');
const pool = require('../Database/database');
const bcrypt = require('bcrypt');

const createUser = async (req, res = response) => {

    const { phone, password, idUser} = req.body;

    console.log(phone+password+idUser+"abc");

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(password, salt);

    const hasPhone = await pool.query('SELECT phone FROM users WHERE phone = ?', [phone]);

    if( hasPhone.length == 0){
        await pool.query(`CALL SP_REGISTER_USER(?,?,?);`,[phone, pass, idUser]);

        return res.json({
            resp : true,
            msj : 'User' + phone + ' has been created successfully' 
        });
    }else{

        return res.json({
            resp: false,
            msj: 'Phone number is registered'
        });
    }
};

const createStaff = async (req, res = response, next) => {

    const { phone, password, idUser} = req.body;

    console.log(phone+password+idUser);

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(password, salt);

    const hasPhone = await pool.query('SELECT phone FROM users WHERE phone = ?', [phone]);

    if( hasPhone.length == 0){
        await pool.query(`CALL SP_REGISTER_STAFF(?,?,?);`,[phone, pass, idUser]);

        return res.json({
            resp : true,
            msj : 'User' + phone + ' has been created successfully' 
        });
    }else{

        return res.json({
            resp: false,
            msj: 'Phone number is registered'
        });
    }
};

module.exports = {
    createUser,
    createStaff
};