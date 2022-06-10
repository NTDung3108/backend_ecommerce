const { response } = require('express');
const pool = require('../Database/database');

const ListCategoriesHome =  async ( req, res = response ) => {

    const categories = await pool.query('SELECT * FROM Category WHERE status = 1 LIMIT 5');

    if( categories.length > 0 ){

        return res.json({
            resp: true,
            msj : 'List categories',
            categories : categories
        });

    } else {
        return res.json({
            resp: false,
            msj : 'Without List of Categories'
        });
    }
}

const ListProductsHome = async ( req, res = response ) => {

    const products = await pool.query(`CALL SP_LIST_PRODUCTS_HOME();`);

    if( products[0].length > 0 ){
        const product = products[0];
      
        for(i=0; i< product.length; i++){
            const colors = JSON.parse(product[i].colors);

            const picture = JSON.parse(product[i].picture);

            product[i].picture = picture;

            product[i].colors = colors;

        }
        return res.json({
            resp: true,
            msj : 'List Products Home',
            products: products[0]
        });
    } else {
        
        return res.json({
            resp: false,
            msj : 'Without List Products' 
        });
    }
}

const ListCategoriesAll = async ( req, res = response ) => {

    const category = await pool.query('SELECT*FROM Category WHERE status = 1');

    if( category.length > 0){

        return res.json({
            resp: true,
            msj: 'List Categories All',
            categories: category
        });
    }else{

        return res.json({
            resp: false,
            msj: 'Without list categories'
        });
    }
}

const ListSubCategoriesAll = async ( req, res = response ) => {

    const subCategory = await pool.query('SELECT*FROM subcategory WHERE category_id = ? AND status = 1', [req.params.idCategory]);

    if( subCategory.length > 0){

        return res.json({
            resp: true,
            msj: 'List Sub Categories All',
            subcategories: subCategory
        });
    }else{

        return res.json({
            resp: false,
            msj: 'Without list categories'
        });
    }
}

const ListDiscaountBannerHome =  async ( req, res = response ) => {
    
    const discounts = await pool.query('SELECT*FROM discount ORDER BY endTime DESC LIMIT 3');

    if( discounts.length > 0 ){

        return res.json({
            resp: true,
            msj : 'List Discount',
            discounts : discounts
        });

    } else {
        return res.json({
            resp: false,
            msj : 'Without List of Discount'
        });
    }
}

const ListSubcategoriesHome =  async ( req, res = response ) => {
    
    const subcategories = await pool.query('SELECT*FROM subcategory WHERE status = 1 ORDER BY views DESC LIMIT 5');

    if( subcategories.length > 0 ){

        return res.json({
            resp: true,
            msj : 'List Discount',
            subcategories : subcategories
        });

    } else {
        return res.json({
            resp: false,
            msj : 'Without List of subcategories'
        });
    }
}

const getAllSubCategories = async ( req, res = response ) => {

    const subCategory = await pool.query('SELECT*FROM subcategory WHERE status = 1');

    if( subCategory.length > 0){

        return res.json({
            resp: true,
            msj: 'List All Category',
            subcategories: subCategory
        });
    }else{

        return res.json({
            resp: false,
            msj: 'Without list categories'
        });
    }
}

module.exports = {
    ListProductsHome,
    ListCategoriesAll,
    ListCategoriesHome,
    ListSubCategoriesAll,
    ListDiscaountBannerHome,
    ListSubcategoriesHome,
    getAllSubCategories
}