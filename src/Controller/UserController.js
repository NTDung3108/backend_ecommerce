const { response } = require('express');
const fs = require('fs-extra');
const path = require('path');
const pool = require('../Database/database');
const bcrypt = require('bcrypt');

const changePhotoProfile = async (req, res = response ) => {

    const { uidPerson } = req.body;
    const pathNew = req.file.filename;
    console.log(req.file);

    if(uidPerson == undefined || pathNew == undefined){
        return res.status(400).json({
            resp: false,
            msj : 'Updated image failed',
            profile : 'undefined'
        });
    }

    const rows = await pool.query('SELECT image FROM person WHERE uid = ?', [uidPerson]);

    if( rows[0].image != null){
        await fs.unlink(path.resolve('src/Uploads/Profile/'+rows[0].image))
    }

    console.log(pathNew);

    await pool.query(`CALL SP_SAVE_IMAGE_PROFILE(?,?);`,[pathNew, uidPerson]);

    return res.status(200).json({
        resp: true,
        msj : 'Updated image',
        profile : pathNew
    });
}

const userPersonalRegister = async ( req, res = response ) => {

    const { firstname, lastname, phone, address, reference, uid} = req.body;

    //const uid = req.uid;

    await pool.query(`CALL SP_REGISTER_PERSONAL(?,?,?,?,?,?);`, [ firstname, lastname, phone, address, reference, uid]);

    return res.json({
        resp: true,
        msj: 'Infomation personal added'
    });
}

const getPersonalInformation = async ( req, res = response ) => {

    const uid = req.uid;

    const user = await pool.query('SELECT uid, firstName, lastName, phone, address, reference, image FROM person WHERE uid = ?',[ uid ]);

    console.log(user);

    return res.json({
        resp: true,
        msj: 'Get personal, information',
        information: user[0]
    });
}

const updateFirstName = async ( req, res = response ) => {

    const uid = req.uid;
    const group_id = req.group_id;
    const {firstName} = req.body;

    console.log(firstName);
    try {
        if(firstName != undefined && group_id == 3){
            await pool.query('UPDATE person SET firstName = ? WHERE uid = ?',[firstName, uid]);
    
            return res.json({
                resp: true,
                msj: 'Update success',
            });
        }else{
    
            return res.json({
                resp: false,
                msj: 'Something wrong',
            });
        }
    } catch (error) {
        return res.json({
            resp: false,
            msj: error,
        });
    }
}

const updateLastName = async ( req, res = response ) => {

    const uid = req.uid;
    const {lastName} = req.body;

    console.log(lastName);

   await pool.query('UPDATE person SET lastName = ? WHERE uid = ?',[lastName, uid]);

    return res.json({
        resp: true,
        msj: 'Update success',
    });
}

const updatePhone = async ( req, res = response ) => {

    const uid = req.uid;
    const {phone} = req.body;

    console.log(phone);

   await pool.query('UPDATE person SET phone = ? WHERE uid = ?',[phone, uid]);

    return res.json({
        resp: true,
        msj: 'Update success',
    });
}

const updateAddress = async ( req, res = response ) => {

    const uid = req.uid;
    const {address} = req.body;

    console.log(address);

   await pool.query('UPDATE person SET address = ? WHERE uid = ?',[address, uid]);

    return res.json({
        resp: true,
        msj: 'Update success',
    });
}

const checkPhone = async ( req, res = response ) => {

   const phone = await pool.query('SELECT phone FROM users WHERE phone = ?',[req.params.phone]);

   console.log(phone);
   
   if(phone.length == 0){
    return res.json({
        resp: true,
        msj: 'okay',
    });
   }
   return res.json({
    resp: false,
    msj: 'Phone number already in use',
   });
}

const forgotPassword = async ( req, res = response ) => {

    const {passwordd, phone} = req.body;

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(passwordd, salt);

    await pool.query('UPDATE users SET passwordd = ? WHERE phone = ?;',[pass, phone]);
 
    console.log(phone);
    console.log(passwordd);

    
    if(phone == '' || passwordd == '' || phone == null || passwordd == null || phone == undefined || passwordd == undefined){
     return res.json({
         resp: false,
         msj: 'An error occurred, please try again',
     });
    }
    return res.json({
     resp: true,
     msj: 'Password has been changed',
    });
 }

module.exports = {
    changePhotoProfile,
    userPersonalRegister,
    getPersonalInformation,
    updateFirstName,
    updateLastName,
    updatePhone,
    updateAddress,
    checkPhone,
    forgotPassword
}