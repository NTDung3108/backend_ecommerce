const{ response } = require('express');
const pool = require('../Database/database');

const getRating = async(req, res = response) => {
    try {
        console.log(req.params.productId);
        const rows = await pool.query('SELECT * FROM rating WHERE product_id = ?', [req.params.productId]);
        console.log(rows)
        if(rows.length == 0){
            return res.json({
                resp : true,
                msj : 'No rating',
                rating:[]
            });
        }
        return res.json({
            resp : true,
            msj : 'Ratings',
            ratings: rows
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            rating:[]
        });
    }
    
}

const getAVGRating = async(req, res = response) => {
    try {
        console.log(req.params.productId);
        const rows = await pool.query('SELECT avg(rating) AS rating FROM rating WHERE product_id = ?', [req.params.productId]);
        var rating = rows[0].rating + 0.0;
        console.log(rating)
        if(rating == 0 || rating == null){
            return res.json({
                resp : true,
                msj : 'No rating',
                rating: 0.0
            });
        }

        var rating = rows[0].rating + 0.0;

        return res.json({
            resp : true,
            msj : 'Rating',
            rating: rating
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            rating: 0.0
        });
    }
    
}

const addNewRating = async(req, res = response) => {
    const {in_productId, in_personId, in_rating, in_comment, in_date} = req.body;
    try {
        if(in_productId == undefined || in_personId == undefined || in_rating == undefined || in_comment == undefined,
            in_image == undefined, in_date == undefined){
            return res.json({
                resp : true,
                msj : 'Missing product information',
            });
        }

        const respone = await pool.query(`CALL SP_RATING(?,?,?,?,?,?)`, in_productId, in_personId, in_rating, in_comment, '', in_date);

        console.log(respone);

        return res.json({
            resp : true,
            msj : 'Rating success',
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
        });
    }
    
}

module.exports = {
    getRating,
    getAVGRating,
    addNewRating
}