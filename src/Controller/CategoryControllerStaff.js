const{ response } = require('express');
const pool = require('../Database/database');


const getAllCategory = async (req, res = response) => {
    try {

        var row = await pool.query(`CALL SP_ADD_CATEGORY(?,?)`,[in_category, null]);

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

const addCategory = async (req, res = response) => {
    const {in_category} = req.body;

    try {

        await pool.query(`CALL SP_ADD_CATEGORY(?,?)`,[in_category, null]);

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

const deleteCategory = async (req, res = response) =>{
    
    try {
        if(req.params.idCategory == undefined || req.params.idCategory == null || req.params.idCategory == ''){
            return res.status(400).json({
                resp : false,
                msj : 'Category deletion failed due to missing idCategory'
            });
        }
    
        await pool.query(`CALL SP_DELETE_CATEGORY(?);`,[req.params.idCategory]);
    
        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
}

const updateCategory = async (req, res = response) => {
    const {idCategory, category} = req.body;
    try {
        if(idCategory == undefined || category == undefined || idCategory == '' || category == ''){
            return res.status(400).json({
                resp : false,
                msj : 'update category failed. Check the category information again'
            });
        }

        await pool.query('UPDATE category SET category = ? WHERE id = ?',[category, idCategory]);

        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
}

const updatePictureCategory = async (req, res = response) => {
    const {idCategory} = req.body;
    try {
        if(idCategory == undefined || category == undefined || idCategory == '' || category == ''){
            return res.status(400).json({
                resp : false,
                msj : 'update category failed. Check the category information again'
            });
        }

        if(req.file == undefined){
            return res.status(400).json({
                resp : false,
                msj : 'You must select at least 1 file.'
            });
        }

        await pool.query('UPDATE category SET picture = ? WHERE id = ?',[category, idCategory]);

        return res.status(200).json({
            resp : true,
            msj : 'Success'
        });

    } catch (error) {
        return res.json({
            resp : false,
            msj : error
        });
    }
}



module.exports = {
    addCategory,
    deleteCategory,
    updateCategory,
    updatePictureCategory
}