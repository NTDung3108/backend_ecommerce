const{ response } = require('express');
const pool = require('../Database/database');

const getAllDiscount = async(req, res = response) => {
    try {
        const disconnect = await pool.query('SELECT*FROM discount');
        console.log(disconnect);
        if(disconnect == null){
            return res.json({
                resp : false,
                msj : 'Get All Discount Fail',
                discounr: []
            });
        }
        return res.status(200).json({
            resp : true,
            msj : 'All Discount',
            discounr: disconnect
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            discount: []
        });
    }
}

const addDiscount = async (req, res = response) => {
    const {in_title, in_content, in_discount, in_startTime, in_endTime} = req.body;

    try {
        console.log(req.files);

        if(req.files == undefined || req.files.length <= 0){
            return res.json({
                resp : false,
                msj : 'You must select at least 1 file or more.'
            });
        }

        const pathNew = req.file.filename;

        await pool.query(`SP_ADD_DISCOUNT (?,?,?,?,?,?)`,[in_title, in_content, pathNew, in_discount, in_startTime, in_endTime]);

        return res.json({
            resp : true,
            msj : 'Success',
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
}

const deleteDiscount = async (req, res = response) => {
    const {in_idDiscount} = req.body;

    try {
       
        await pool.query('UPDATE discount SET status = 0 WHERE idDiscount = ?',[in_idDiscount]);

        return res.json({
            resp : true,
            msj : 'Success',
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
}

module.exports = {
    getAllDiscount,
    addDiscount
}