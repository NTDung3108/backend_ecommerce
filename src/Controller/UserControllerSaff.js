const{ response } = require('express');
const { uid } = require('rand-token');
const pool = require('../Database/database');

const getAllUsers = async (req, res = response) => {
    try {
        const rows = await pool.query(`CALL SP_GET_ALL_USER();`);

        console.log(rows);

        const users = rows[0];

        return res.status(200).json({
            resp : true,
            msj : 'Get all user succes',
            users: users
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            users: []
        });
    }
}

const getAllStaff = async (req, res = response) => {
    
    const uid = req.uid;

    try {

        const groupId = await pool.query("SELECT group_id FROM users WHERE persona_id  = ?", [uid]);

        if(groupId[0] == 1){
            const rows = await pool.query(`CALL SP_GET_ALL_STAFF`);

            const users = rows[0];
    
            return res.status(200).json({
                resp : true,
                msj : 'Get all user succes',
                users: users
            });  
        }

        return res.json({
            resp : false,
            msj : 'You do not have permission to use this function',
            users: []
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            users: []
        });
    }
}

const verifyStaff = async (req, res = response) => {
    
    const uid = req.uid;

    const {staffId, isVerify} = req.body;

    try {

        const groupId = await pool.query("SELECT group_id FROM users WHERE persona_id  = ?", [uid]);

        if(groupId[0] == 1){

            await pool.query("UPDATE users SET isVerify = true WHERE persona_id = ?", [isVerify, staffId]);
    
            return res.status(200).json({
                resp : true,
                msj : 'Account confirmed',
            });  
        }

        return res.json({
            resp : false,
            msj : 'You do not have permission to use this function',
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
}

const registerInfoStaff = async (req, res = response, next) => {

    const {sid, nam, lastt, phone, gender, email, address} = req.body;

    try {

        if(sid != undefined || nam != undefined || lastt != undefined || phone != undefined || gender != undefined || email != undefined || address != undefined){

            await pool.query(`CALL SP_REGISTER_STAFF_INFO(?,?,?,?,?,?,?);`,[nam, lastt, phone, gender, email, address, sid]);
    
            return res.status(200).json({
                resp : true,
                msj : 'Register info success',
            });  
        }

        return res.json({
            resp : false,
            msj : 'Register info success',
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
}


module.exports = {
    getAllUsers,
    getAllStaff,
    verifyStaff,
    registerInfoStaff,
}